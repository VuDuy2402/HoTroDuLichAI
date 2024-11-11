using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI.API
{
    public class PlaceService : IPlaceService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly UserManager<UserEntity> _userManager;
        private readonly ILogger<PlaceService> _logger;

        public PlaceService(
            HoTroDuLichAIDbContext dbContext,
            ILogger<PlaceService> logger,
            UserManager<UserEntity> userManager)
        {
            _dbContext = dbContext;
            _logger = logger;
            _userManager = userManager;
        }

        public async Task<ApiResponse<BasePagedResult<PlaceDetailResponseDto>>> GetWithPagingAsync(
            PlacePagingAndFilterParams param, ModelStateDictionary? modelState = null)
        {
            var response = new ApiResponse<BasePagedResult<PlaceDetailResponseDto>>();
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            if (param == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Dữ liệu gửi về không đúng định dạng. Vui lòng kiểm tra lại.",
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.Result.Success = false;
                response.Result.Errors.AddRange(errors);
                response.StatusCode = StatusCodes.Status400BadRequest;
                return response;
            }
            if (!errors.IsNullOrEmpty())
            {
                return await ResponseHelper.BadRequestErrorAsync(errors: errors, response: response);
            }
            try
            {
                IQueryable<PlaceEntity> collection = _dbContext.Places.Include(pl => pl.User);
                var currentUser = RuntimeContext.CurrentUser;
                if (param.IsAdmin)
                {
                    if (currentUser == null)
                    {
                        return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                    }
                    var roles = await _userManager.GetRolesAsync(user: currentUser);
                    if (!roles.Contains(CRoleType.Admin.ToString()))
                    {
                        errors.Add(new ErrorDetail()
                        {
                            Error = $"Bạn không đủ quyền để truy cập tài nguyên này.",
                            ErrorScope = CErrorScope.PageSumarry
                        });
                        response.Result.Errors.AddRange(errors);
                        response.Result.Success = false;
                        response.StatusCode = StatusCodes.Status403Forbidden;
                        return response;
                    }
                }
                if (param.IsMy)
                {
                    if (currentUser == null)
                    {
                        return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                    }
                    collection = collection.Where(c => c.UserId == currentUser.Id);
                }
                if (!string.IsNullOrEmpty(param.SearchQuery))
                {
                    collection = collection.Where(pl => (
                        pl.Address + " " +
                        pl.CreatedDate + " " +
                        pl.Latitude + " " +
                        pl.Longitude + " " +
                        pl.Name
                    ).ToLower().Contains(param.SearchQuery.ToLower()));
                }
                if (param.FilterProperty != null)
                {
                    var filter = param.FilterProperty;
                    if (filter.ApprovalType.HasValue)
                    {
                        collection = collection.Where(pl => pl.Appoved == filter.ApprovalType.Value);
                    }
                    if (filter.PlaceType.HasValue)
                    {
                        collection = collection.Where(pl => pl.PlaceType == filter.PlaceType.Value);
                    }
                    if (filter.FromDate.HasValue)
                    {
                        collection = collection.Where(pl => pl.CreatedDate >= filter.FromDate.Value);
                    }
                    if (filter.ToDate.HasValue)
                    {
                        collection = collection.Where(pl => pl.CreatedDate <= filter.ToDate.Value);
                    }
                }
                if (param.SortProperty != null)
                {
                    var sorter = param.SortProperty;
                    if (!string.IsNullOrEmpty(sorter.KeyName))
                    {
                        if (sorter.KeyName.Equals(nameof(PlaceEntity.Name), StringComparison.OrdinalIgnoreCase))
                        {
                            collection = sorter.IsASC ? collection.OrderBy(pl => pl.Name) : collection.OrderByDescending(pl => pl.Name);
                        }
                    }
                }
                var pagedList = await PagedList<PlaceEntity>.ToPagedListAsync(
                    source: collection, pageNumber: param.PageNumber, pageSize: param.PageSize);
                var selected = pagedList.Select(pl => new PlaceDetailResponseDto
                {
                    PlaceId = pl.Id,
                    Name = pl.Name,
                    IsNew = pl.IsNew,
                    Latitude = pl.Latitude,
                    Longtitude = pl.Longitude,
                    TotalView = pl.TotalView,
                    Rating = pl.Rating,
                    PlaceType = pl.PlaceType,
                    Thumbnail = pl.Thumbnail,
                    ApprovalType = pl.Appoved,
                    OwnerProperty = new OwnerProperty()
                    {
                        Avatar = pl.User.Avatar,
                        Email = pl.User.Email ?? string.Empty,
                        FullName = pl.User.FullName,
                        UserId = pl.UserId
                    }
                }).ToList();
                var data = new BasePagedResult<PlaceDetailResponseDto>()
                {
                    CurrentPage = pagedList.CurrentPage,
                    Items = selected,
                    PageSize = pagedList.PageSize,
                    TotalItems = pagedList.TotalCount,
                    TotalPages = pagedList.TotalPages,
                    ObjFilterProperties = param.FilterProperty,
                };
                response.Result.Success = true;
                response.Result.Data = data;
                response.StatusCode = StatusCodes.Status200OK;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
    }
}