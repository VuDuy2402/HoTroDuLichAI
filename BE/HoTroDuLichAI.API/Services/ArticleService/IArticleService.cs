using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface IArticleService
    {
        Task<ApiResponse<BasePagedResult<ArticleDetailResponseDto>>> GetWithPagingAsync(ArticlePagingAndFilterParams param,
            ModelStateDictionary? modelState = null);
    }
}