using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI.API
{
    public class ArticleService : IArticleService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly UserManager<UserEntity> _userManager;
        private readonly ILogger<ArticleService> _logger;

        public ArticleService(
            HoTroDuLichAIDbContext dbContext,
            UserManager<UserEntity> userManager,
            ILogger<ArticleService> logger
        )
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<ApiResponse<BasePagedResult<ArticleDetailResponseDto>>> GetWithPagingAsync(ArticlePagingAndFilterParams param,
            ModelStateDictionary? modelState = null)
        {
            var response = new ApiResponse<BasePagedResult<ArticleDetailResponseDto>>();
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            if (!errors.IsNullOrEmpty())
            {
                return await ResponseHelper.BadRequestErrorAsync(errors: errors, response: response);
            }
            try
            {
                IQueryable<ArticleEntity> collection = _dbContext.Articles.Include(ar => ar.User);
                if (!string.IsNullOrEmpty(param.SearchQuery))
                {
                    collection = collection.Where(c => c.Title.ToLower().Contains(param.SearchQuery.ToLower()));
                }
                var pagedList = await PagedList<ArticleEntity>.ToPagedListAsync(
                    source: collection, pageNumber: param.PageNumber, pageSize: param.PageSize);
                var selected = pagedList.Select(pl => new ArticleDetailResponseDto
                {
                    ArticleId = pl.Id,
                    Title = pl.Title,
                    Content = pl.Content,
                    Type = pl.Type,
                    Approved = pl.Approved,
                    CreatedDate = pl.CreatedDate,
                    Thumbnail = pl.Thumbnail,
                    OwnerProperty = new OwnerProperty()
                    {
                        Avatar = pl.User.Avatar,
                        Email = pl.User.Email ?? string.Empty,
                        FullName = pl.User.FullName,
                        UserId = pl.UserId
                    }
                }).ToList();
                var data = new BasePagedResult<ArticleDetailResponseDto>()
                {
                    CurrentPage = pagedList.CurrentPage,
                    Items = selected,
                    PageSize = pagedList.PageSize,
                    TotalItems = pagedList.TotalCount,
                    TotalPages = pagedList.TotalPages,
                    // ObjFilterProperties = param.FilterProperty,
                };
                response.Result.Success = true;
                response.Result.Data = data;
                response.StatusCode = StatusCodes.Status200OK;
                return response;

            }
            catch (Exception ex)
            {
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
    }
}