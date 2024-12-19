using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.ML;

namespace HoTroDuLichAI.API.Controllers
{
    [ApiController]
    [Route("/api/v1/ai")]
    public class AIController : ControllerBase
    {
        private readonly IAIService _aIService;
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly MLContext _mlContext;
        private readonly ITransformer _model;

        public AIController(IAIService aIService, HoTroDuLichAIDbContext dbContext)
        {
            _aIService = aIService;
            _dbContext = dbContext;
            _mlContext = new MLContext();

            var basePath = Path.Combine(Directory.GetCurrentDirectory(), "AITraining", "Data", "model.zip");

            if (!System.IO.File.Exists(basePath))
            {
                throw new FileNotFoundException($"Không tìm thấy mô hình tại {basePath}");
            }

            using (var stream = new FileStream(basePath, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                _model = _mlContext.Model.Load(stream, out var modelInputSchema);
            }
        }

        [HttpPost("business/suggestion")]
        public async Task<IActionResult> GetBusinessSuggestion(Guid placeId, Guid provinceId)
        {
            var result = await _aIService.GetBusinessRoute(startProvinceId: provinceId, destinationPlaceId: placeId);
            return Ok(result);
        }

        //     [HttpPost("GetBusinessServices")]
        //     public async Task<IActionResult> GetBusinessServices([FromBody] BusinessServiceRequest request)
        //     {
        //         var businessok = await _dbContext.Businesses.ToListAsync();
        //         var por = new List<BusinessServiceProperty>();
        //         foreach(var item in businessok)
        //         {
        //             por.AddRange(item.ServiceProperties);
        //         }
        //         var businesses = await _aIService.GetBusinessRoute(startProvinceId: request.ProvinceId, destinationPlaceId: request.PlaceId);

        //         var businessServices = new List<BusinessServicePrediction>();

        //         var predictionEngine = _mlContext.Model.CreatePredictionEngine<BusinessServiceInput, BusinessServicePrediction>(_model);

        //         foreach (var business in businesses)
        //         {
        //             foreach (var service in business.BusinessServiceProperties)
        //             {
        //                 var input = new BusinessServiceInput
        //                 {
        //                     SoNguoi = request.SoNguoi,
        //                     SoNgay = request.SoNgay,
        //                     TongTien = (float)request.TongTien,
        //                     ServiceAmount = (float)service.Amount,
        //                     ServiceQuantity = service.Quantity
        //                 };

        //                 var prediction = predictionEngine.Predict(input);

        //                 if (prediction.Score > 0.5)
        //                 {
        //                     businessServices.Add(new BusinessServicePrediction
        //                     {
        //                         Score = prediction.Score
        //                     });
        //                 }
        //             }
        //         }

        //         var result = businessServices.OrderByDescending(s => s.Score).ToList();
        //         return Ok(result);
        //     }
        // }

        // public class BusinessServiceRequest
        // {
        //     public int SoNguoi { get; set; }
        //     public int SoNgay { get; set; }
        //     public decimal TongTien { get; set; }
        //     public Guid PlaceId { get; set; }
        //     public Guid ProvinceId { get; set; }
        // }

        // public class BusinessServiceInput
        // {
        //     public float SoNguoi { get; set; }
        //     public float SoNgay { get; set; }
        //     public float TongTien { get; set; }
        //     public float ServiceAmount { get; set; }
        //     public float ServiceQuantity { get; set; }
        // }

        // public class BusinessServicePrediction
        // {
        //     public float Score { get; set; }
        // }


        [HttpPost("GetBusinessServices")]
        public async Task<IActionResult> GetBusinessServices([FromBody] BusinessServiceRequest request)
        {
            // Lấy tất cả các dịch vụ từ các khách sạn
            var businesses = await _aIService.GetBusinessRoute(startProvinceId: request.ProvinceId, destinationPlaceId: request.PlaceId);

            // Tạo danh sách tất cả các dịch vụ có thể sử dụng (phòng)
            var allRooms = new List<BusinessServiceProperty>();
            foreach (var business in businesses)
            {
                foreach (var service in business.BusinessServiceProperties)
                {
                    // if (service.Type == CBusinessServiceType.Room)
                    // {
                    allRooms.Add(service);
                    // }
                }
            }

            // Áp dụng thuật toán tối ưu hóa (Knapsack) để tìm ra các lựa chọn hợp lý
            var routeOptions = OptimizeRouteOptions(allRooms, request.SoNguoi, request.SoNgay, request.TongTien);

            return Ok(routeOptions);
        }

        // Hàm tối ưu hóa kết hợp các dịch vụ phòng sao cho tổng chi phí và số người phù hợp
        private List<RouteOption> OptimizeRouteOptions(
            List<BusinessServiceProperty> allRooms,
            int requiredPeople,
            int requiredDays,
            decimal budget)
        {
            // Chuyển đổi ngân sách từ decimal sang int (đơn vị là xu)
            int budgetInCents = (int)(budget * 100);

            // Dựng bảng giá trị tối ưu (Knapsack DP)
            var dp = new List<List<int>>();
            var combinations = new List<List<BusinessServiceProperty>>();

            // Khởi tạo bảng với kích thước (tổng số người + 1) x (tổng chi phí + 1)
            for (int i = 0; i <= requiredPeople; i++)
            {
                dp.Add(new List<int>(new int[budgetInCents + 1]));
                combinations.Add(new List<BusinessServiceProperty>());
            }

            // Duyệt qua tất cả các phòng và cập nhật bảng tối ưu
            foreach (var room in allRooms)
            {
                // Lấy giá phòng theo số lượng ngày (chuyển từ decimal sang int)
                int roomCostInCents = (int)(room.Amount * requiredDays * 100);

                for (int people = requiredPeople; people >= room.Quantity; people--)
                {
                    for (int cost = budgetInCents; cost >= roomCostInCents; cost--)
                    {
                        var prevCost = dp[people - room.Quantity][cost - roomCostInCents];
                        var newCost = prevCost + roomCostInCents;

                        if (newCost <= budgetInCents && newCost > dp[people][cost])
                        {
                            dp[people][cost] = newCost;
                            combinations[people].Add(room);
                        }
                    }
                }
            }

            // Xây dựng các lộ trình từ bảng tối ưu
            var routeOptions = new List<RouteOption>();
            for (int people = requiredPeople; people >= 0; people--)
            {
                for (int cost = budgetInCents; cost >= 0; cost--)
                {
                    if (dp[people][cost] != 0)
                    {
                        var option = new RouteOption
                        {
                            Services = combinations[people],
                            TotalCost = dp[people][cost] / 100m, // Chuyển từ cent sang decimal
                            TotalPeople = people,
                            TotalDays = requiredDays
                        };
                        routeOptions.Add(option);
                    }
                }
            }

            return routeOptions;
        }
    }
    public class RouteOption
    {
        public List<BusinessServiceProperty> Services { get; set; }
        public decimal TotalCost { get; set; }
        public int TotalPeople { get; set; }
        public int TotalDays { get; set; }
    }

    public class BusinessServiceRequest
    {
        public int SoNguoi { get; set; }
        public int SoNgay { get; set; }
        public decimal TongTien { get; set; }
        public Guid PlaceId { get; set; }
        public Guid ProvinceId { get; set; }
    }
}