using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HoTroDuLichAI.API.Controllers
{
    [ApiController]
    [Route("/api/v1/admin/business")]
    public class BusinessController : ControllerBase
    {
        private readonly IBusinessService _businessService;

        public BusinessController(IBusinessService businessService)
        {
            _businessService = businessService;
        }

        [HttpPost("my/paging")]
        [Authorize(Roles = RoleDescription.Business)]
        public async Task<IActionResult> GetWithPaging(BusinessPagingAndFilterParams param)
        {
            param.IsMy = true;
            var result = await _businessService.GetWithPagingAsync(param: param, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("manage/request/paging")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> GetNewBusinessWithPaging(BusinessPagingAndFilterParams param)
        {
            param.IsRequest = true;
            var result = await _businessService.GetWithPagingAsync(param: param, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("manage/paging")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> GetWithPagingManage(BusinessPagingAndFilterParams param)
        {
            param.IsAdmin = true;
            var result = await _businessService.GetWithPagingAsync(param: param, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }
        
        [HttpGet("manage/{businessId}")]
        public async Task<IActionResult> GetBusinessById(Guid businessId)
        {
            var result = await _businessService.GetBusinessDetailByIdAsync(businessId: businessId);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpGet("manage/getforupdate/{businessId}")]
        public async Task<IActionResult> GetBusinessForUpdateById(Guid businessId)
        {
            var result = await _businessService.GetBusinessDetailForUpdateByIdAsync(businessId: businessId);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("manage")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> CreateBusiness(CreateBusinessRequestDto requestDto)
        {
            var result = await _businessService.CreateBusinessAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPut("manage")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> UpdateBusiness(UpdateBusinessRequestDto requestDto)
        {
            var result = await _businessService.UpdateBusinessAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpDelete("{businessId}")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> DeleteBusiness(Guid businessId)
        {
            var result = await _businessService.DeleteBusinessAsync(businessId: businessId);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        #region Business Services
        [HttpPost("services/getall")]
        [Authorize(Roles = $"{RoleDescription.Admin}, {RoleDescription.Business}")]
        public async Task<IActionResult> GetAllBusinessService([FromBody]Guid businessId)
        {
            var result = await _businessService.GetAllBusinessServicesAsync(businessId: businessId);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("services/getbyid")]
        // [Authorize(Roles = $"{RoleDescription.Admin}, {RoleDescription.Business}")]
        public async Task<IActionResult> GetBusinessServiceById(GetOrDeleteBusinessServiceRequestDto requestDto)
        {
            var result = await _businessService.GetBusinessServiceByBusinessIdAndServiceIdAsync(requestDto: requestDto);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }


        [HttpPost("services/create")]
        [Authorize(Roles = $"{RoleDescription.Admin}, {RoleDescription.Business}")]
        public async Task<IActionResult> CreateBusinessService(CreateBusinessServiceRequestDto requestDto)
        {
            var result = await _businessService.CreateBusinessServiceAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }


        [HttpPost("services/updatebyid")]
        [Authorize(Roles = $"{RoleDescription.Admin}, {RoleDescription.Business}")]
        public async Task<IActionResult> UpdateBusinessServiceByID(UpdateBusinessServiceRequestDto serviceProperty)
        {
            var result = await _businessService.UpdateBusinessServiceByIdAsync(serviceProperty: serviceProperty, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("services/deletebyid")]
        [Authorize(Roles = $"{RoleDescription.Admin}, {RoleDescription.Business}")]
        public async Task<IActionResult> DeleteBusinessServiceById(GetOrDeleteBusinessServiceRequestDto requestDto)
        {
            var result = await _businessService.DeleteBusinessServiceByIdAsync(requestDto: requestDto);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        #endregion Business Services

        #region report
        [HttpPost("report/viewcontact")]
        [Authorize(Roles = RoleDescription.Business)]
        public async Task<IActionResult> GetMyViewContactReport(ReportRequestDto requestDto)
        {
            var result = await _businessService.GetMyViewContactReportAsync(requestDto: requestDto);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("report/serviceused")]
        [Authorize(Roles = RoleDescription.Business)]
        public async Task<IActionResult> GetMyServiceUsedReport(ReportRequestDto requestDto)
        {
            var result = await _businessService.GetMyServiceUsedReportAsync(requestDto: requestDto);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpGet("contactperson")]
        [Authorize(Roles = RoleDescription.Business)]
        public async Task<IActionResult> GetBusinessContactPerson()
        {
            var result = await _businessService.GetBusinessContactPersonAsync();
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }
        #endregion report

        #region become to a business
        [HttpPost("becometobusiness/request")]
        [Authorize(Roles = RoleDescription.NormalUser)]
        public async Task<IActionResult> RequestToRegisterBusiness(RequestToCreateBusinessRequestDto requestDto)
        {
            var result = await _businessService.RequestToRegisterBusinessAsyn(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("becometobusiness/approve")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> ApproveNewBusinessRequest(ApproveNewBusinessRequestDto requestDto)
        {
            var result = await _businessService.ApprovalNewBusinessRequestAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }
        #endregion become to a business

    }
}