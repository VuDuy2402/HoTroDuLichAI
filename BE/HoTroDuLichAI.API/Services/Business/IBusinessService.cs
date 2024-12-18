using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface IBusinessService
    {
        Task<ApiResponse<BasePagedResult<BusinessMoreInfoResponseDto>>> GetWithPagingAsync(BusinessPagingAndFilterParams param,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<BusinessMoreInfoResponseDto>> GetBusinessDetailByIdAsync(Guid businessId);
        Task<ApiResponse<UpdateBusinessRequestDto>> GetBusinessDetailForUpdateByIdAsync(Guid businessId);
        Task<ApiResponse<BusinessDetailResponseDto>> CreateBusinessAsync(CreateBusinessRequestDto requestDto, ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> UpdateBusinessAsync(UpdateBusinessRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> DeleteBusinessAsync(Guid businessId);

        #region business services
        Task<ApiResponse<List<BusinessServiceProperty>>> GetAllBusinessServicesAsync(Guid businessId);
        Task<ApiResponse<BusinessServiceProperty>> GetBusinessServiceByBusinessIdAndServiceIdAsync(GetOrDeleteBusinessServiceRequestDto requestDto);
        Task<ApiResponse<ResultMessage>> CreateBusinessServiceAsync(CreateBusinessServiceRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> UpdateBusinessServiceByIdAsync(UpdateBusinessServiceRequestDto serviceProperty,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> DeleteBusinessServiceByIdAsync(GetOrDeleteBusinessServiceRequestDto requestDto);
        #endregion business services


        #region report
        Task<ApiResponse<BusinessViewContactReportResponseDto>> GetMyViewContactReportAsync(ReportRequestDto requestDto);
        Task<ApiResponse<List<BusinessServiceUsedReportResponseDto>>> GetMyServiceUsedReportAsync(ReportRequestDto requestDto);
        Task<ApiResponse<BusinessContactPersonInfoResponseDto>> GetBusinessContactPersonAsync();
        #endregion report

        #region become to a business
        Task<ApiResponse<ResultMessage>> RequestToRegisterBusinessAsyn(RequestToCreateBusinessRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> ApprovalNewBusinessRequestAsync(ApproveNewBusinessRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        #endregion become to a business
        
    }
}