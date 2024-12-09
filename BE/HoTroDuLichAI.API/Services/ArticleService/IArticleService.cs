using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface IArticleService
    {
        Task<ApiResponse<BasePagedResult<ArticleDetailResponseDto>>> GetWithPagingAsync(ArticlePagingAndFilterParams param,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> CreateArticleAsync(CreateArticleRequestDto requestDto, ModelStateDictionary? modelState = null);
        Task<ApiResponse<ArticleDetailResponseDto>> GetArticleDetailByIdAsync(Guid articleId);
        Task<ApiResponse<ResultMessage>> UpdateArticleAsync (UpdateArticleRequestDto requestDto, ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> DeleteArticleAsync(Guid articleId);
        Task<ApiResponse<ResultMessage>> ApprovalRequestCreateArticleAsync(ApproveCreateArticleRequestDto requestDto);
    }
}