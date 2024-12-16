using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI.API
{
    public class AIService : IAIService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;

        public AIService(HoTroDuLichAIDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<BusinessRoutePrediction>> GetBusinessRoute(Guid startProvinceId, Guid destinationPlaceId)
        {
            var startProvince = await _dbContext.Provinces.FindAsync(startProvinceId);
            var destinationPlace = await _dbContext.Places.FindAsync(destinationPlaceId);

            if (startProvince == null || destinationPlace == null)
                throw new InvalidOperationException("Start Province or Destination Place not found.");

            float startLat = startProvince.Latitude;
            float startLon = startProvince.Longitude;
            float endLat = destinationPlace.Latitude;
            float endLon = destinationPlace.Longitude;

            var businessPredictions = new List<BusinessRoutePrediction>();
            var businesses = await _dbContext.Businesses.ToListAsync();

            // Tính khoảng cách trực tiếp giữa điểm xuất phát và điểm đích
            double directDistance = DistanceCalculator.GetDistanceInKm(startLat, startLon, endLat, endLon);

            foreach (var business in businesses)
            {
                // Tính khoảng cách giữa điểm xuất phát và doanh nghiệp
                double distanceToBusiness = DistanceCalculator.GetDistanceInKm(startLat, startLon, business.Latitude, business.Longitude);
                // Tính khoảng cách giữa doanh nghiệp và điểm đích
                double businessToDestination = DistanceCalculator.GetDistanceInKm(business.Latitude, business.Longitude, endLat, endLon);

                // Tính tổng khoảng cách (Xuất phát -> Doanh nghiệp -> Đích)
                double totalRouteDistance = distanceToBusiness + businessToDestination;

                // Kiểm tra xem tổng khoảng cách có nhỏ hơn khoảng cách trực tiếp hay không
                if (totalRouteDistance <= directDistance * 1.1) // 10% sai số cho phép
                {
                    businessPredictions.Add(new BusinessRoutePrediction
                    {
                        BusinessId = business.Id,
                        BusinessName = business.BusinessName,
                        BusinessLatitude = business.Latitude,
                        BusinessLongitude = business.Longitude,
                        Distance = (float)(totalRouteDistance)
                    });
                }
            }

            // Sắp xếp doanh nghiệp theo khoảng cách
            return businessPredictions
                .OrderBy(p => p.Distance)
                .ToList();
        }
    }

    public class DistanceCalculator
    {
        public static double GetDistanceInKm(float lat1, float lon1, float lat2, float lon2)
        {
            var radianLat1 = Math.PI * lat1 / 180;
            var radianLat2 = Math.PI * lat2 / 180;
            var radianLon1 = Math.PI * lon1 / 180;
            var radianLon2 = Math.PI * lon2 / 180;
            var dlat = radianLat2 - radianLat1;
            var dlon = radianLon2 - radianLon1;
            var a = Math.Pow(Math.Sin(dlat / 2), 2) +
                    Math.Cos(radianLat1) * Math.Cos(radianLat2) *
                    Math.Pow(Math.Sin(dlon / 2), 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var distance = 6371 * c; // km
            return distance;
        }
    }

    public class BusinessRoutePrediction
    {
        public Guid BusinessId { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public float BusinessLatitude { get; set; }
        public float BusinessLongitude { get; set; }
        public float Distance { get; set; }
    }
}
