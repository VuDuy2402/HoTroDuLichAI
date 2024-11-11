using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public class NotificationService : INotificationService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly UserManager<UserEntity> _userManager;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(
            HoTroDuLichAIDbContext dbContext,
            UserManager<UserEntity> userManager,
            ILogger<NotificationService> logger
        )
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<ApiResponse<BasePagedResult<NotificationDetailResponseDto>>> GetWithPagingAsync(
            NotificationPagingAndFilterParam param, ModelStateDictionary? modelState = null)
        {
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<BasePagedResult<NotificationDetailResponseDto>>();
            if (param == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Dữ liệu gửi về không hợp lệ. Vui lòng kiểm tra lại.",
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                response.StatusCode = StatusCodes.Status400BadRequest;
                return response;
            }
            if (!errors.IsNullOrEmpty())
            {
                return await ResponseHelper.BadRequestErrorAsync(errors: errors, response: response);
            }
            try
            {
                var currentUser = RuntimeContext.CurrentUser;
                if (currentUser == null)
                {
                    return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                }
                bool hasAdminRole = (await _userManager.GetRolesAsync(user: currentUser)).Contains(CRoleType.Admin.ToString());
                IQueryable<NotificationEntity> collection = _dbContext.Notifications;
                if (!hasAdminRole)
                {
                    collection = collection.Where(nt => nt.UserId == currentUser.Id);
                }
                if (!string.IsNullOrEmpty(param.SearchQuery))
                {
                    collection = collection.Where(nt => (nt.Title + " " +
                        nt.Id).ToLower().Contains(param.SearchQuery.ToLower()));
                }
                if (param.FilterProperty != null)
                {
                    var filter = param.FilterProperty;
                    if (filter.Type.HasValue)
                    {
                        collection = collection.Where(nt => nt.Type == filter.Type.Value);
                    }
                }
                collection.OrderByDescending(nt => nt.IsRead);
                var pagedList = await PagedList<NotificationEntity>.ToPagedListAsync(
                    source: collection,
                    pageNumber: param.PageNumber,
                    pageSize: param.PageSize);
                var selected = pagedList.Select(nt => new NotificationDetailResponseDto()
                {
                    NotificationId = nt.Id,
                    UserId = nt.UserId,
                    Title = nt.Title,
                    Content = nt.Content,
                    IsRead = nt.IsRead,
                    ReadDate = nt.ReadDate,
                    CreatedDate = nt.CreatedDate,
                    Type = nt.Type
                }).ToList();
                var data = new BasePagedResult<NotificationDetailResponseDto>()
                {
                    CurrentPage = pagedList.CurrentPage,
                    Items = selected,
                    PageSize = pagedList.PageSize,
                    TotalItems = pagedList.TotalCount,
                    TotalPages = pagedList.TotalPages,
                    ObjFilterProperties = param.FilterProperty
                };
                response.StatusCode = StatusCodes.Status200OK;
                response.Result.Success = true;
                response.Result.Data = data;
                return response;
            }
            catch (Exception ex)
            {
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
    }
}