using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface IBusinessService
    {
        Task<ApiResponse<BasePagedResult<BusinessDetailResponseDto>>> GetWithPagingAsync(BusinessPagingAndFilterParams param, ModelStateDictionary? modelState = null);
        Task<ApiResponse<BusinessMoreInfoResponseDto>> GetBusinessDetailByIdAsync(Guid businessId);
        Task<ApiResponse<BusinessDetailResponseDto>> CreateBusinessAsync(CreateBusinessRequestDto requestDto, ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> UpdateBusinessAsync(UpdateBusinessRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> DeleteBusinessAsync(Guid businessId);


        #region report
        Task<ApiResponse<BusinessViewContactReportResponseDto>> GetMyViewContactReportAsync(ReportRequestDto requestDto);
        Task<ApiResponse<List<BusinessServiceUsedReportResponseDto>>> GetMyServiceUsedReportAsync(ReportRequestDto requestDto);
        Task<ApiResponse<BusinessContactPersonInfoResponseDto>> GetBusinessContactPersonAsync();
        #endregion report

        #region become to a business
        Task<ApiResponse<ResultMessage>> RequestToCreateBusinessAsyn(RequestToCreateBusinessRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        #endregion become to a business
        
    }
}