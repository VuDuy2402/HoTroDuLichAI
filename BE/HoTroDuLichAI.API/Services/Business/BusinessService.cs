using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI.API
{
    public class BusinessService : IBusinessService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly UserManager<UserEntity> _userManager;
        private readonly IImageKitIOService _imagekitIOService;
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly ILogger<BusinessService> _logger;

        public BusinessService(
            HoTroDuLichAIDbContext dbContext,
            IHubContext<NotificationHub> notificationHubContext,
            IImageKitIOService imagekitIOService,
            ILogger<BusinessService> logger,
            UserManager<UserEntity> userManager)
        {
            _dbContext = dbContext;
            _imagekitIOService = imagekitIOService;
            _notificationHubContext = notificationHubContext;
            _logger = logger;
            _userManager = userManager;
        }

        #region get business with paging
        public async Task<ApiResponse<BasePagedResult<BusinessDetailResponseDto>>> GetWithPagingAsync(BusinessPagingAndFilterParams param, ModelStateDictionary? modelState = null)
        {
            ApiResponse<BasePagedResult<BusinessDetailResponseDto>>? response = new ApiResponse<BasePagedResult<BusinessDetailResponseDto>>();
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
                IQueryable<BusinessEntity> collection = _dbContext.Businesses
                                                        .Include(b => b.BusinessContactPerson)
                                                        .Include(b => b.User);
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
                        pl.BusinessName + " " +
                        pl.Address + " " +
                        pl.Service + " " +
                        pl.BusinessContactPerson
                    ).ToLower().Contains(param.SearchQuery.ToLower()));
                }
                if (param.SortProperty != null)
                {
                    var sorter = param.SortProperty;
                    if (!string.IsNullOrEmpty(sorter.KeyName))
                    {
                        if (sorter.KeyName.Equals(nameof(BusinessEntity.BusinessName), StringComparison.OrdinalIgnoreCase))
                        {
                            collection = sorter.IsASC ? collection.OrderBy(pl => pl.BusinessName) : collection.OrderByDescending(pl => pl.BusinessName);
                        }
                    }
                }
                var pagedList = await PagedList<BusinessEntity>.ToPagedListAsync(
                    source: collection, pageNumber: param.PageNumber, pageSize: param.PageSize);
                var selected = pagedList.Select(pl => new BusinessDetailResponseDto
                {
                    BusinessName = pl.BusinessName,
                    Address = pl.Address,
                    Service = pl.Service,
                    BusinessServiceType = pl.BusinessServiceType,
                    Appoved = pl.Appoved,
                    IsNew = pl.IsNew,
                    BusinessContactPerson = pl.BusinessContactPerson,
                    BusinessContactProperty = new BusinessContactPropertyDto()
                    {
                        Name = pl.BusinessContactProperty.Name,
                        Email = pl.BusinessContactProperty.Email,
                        PhoneNumber = pl.BusinessContactProperty.PhoneNumber,
                        ImageProperty = new ImagePropertyDto()
                        {
                            FileId = pl.BusinessContactProperty.ImageProperty.Id,
                            IsDefault = pl.BusinessContactProperty.ImageProperty.IsDefault,
                        }
                    },
                    OwnerProperty = new OwnerProperty()
                    {
                        Avatar = pl.User.Avatar,
                        Email = pl.User.Email ?? string.Empty,
                        FullName = pl.User.FullName,
                        UserId = pl.UserId
                    }
                }).ToList();
                var data = new BasePagedResult<BusinessDetailResponseDto>()
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

        #endregion get business with paging

        #region get business by Id
        public async Task<ApiResponse<BusinessMoreInfoResponseDto>> GetBusinessDetailByIdAsync(Guid businessId)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<BusinessMoreInfoResponseDto>();
            try
            {

                var BusinessAnalyticEntities= await _dbContext.BusinessAnalytics.Where(b => b.BusinessId == businessId)
                                                                        .Select(b => new
                                                                        {
                                                                            Id = b.Id,
                                                                            TotalView = b.TotalView,
                                                                            TotalContact = b.TotalContact,
                                                                            LastViewedDate = b.LastViewedDate,
                                                                            BusinessId = b.BusinessId,
                                                                        }).ToListAsync();

                var businessEntity = await _dbContext.Businesses
                    .Include(pl => pl.User)
                    .Include(pl => pl.BusinessContactProperty)
                    .Include(pl => pl.ItineraryDetails)
                    .Where(pl => pl.Id == businessId)
                    .Select(pl => new
                    {
                        Id = pl.Id,
                        Address = pl.Address,
                        BusinessName = pl.BusinessName,
                        Service = pl.Service,
                        BusinessServiceType = pl.BusinessServiceType,
                        Appoved = pl.Appoved,
                        IsNew = pl.IsNew,
                        OwnerProperty = new OwnerProperty()
                        {
                            Avatar = pl.User.Avatar,
                            Email = pl.User.Email ?? string.Empty,
                            FullName = pl.User.FullName,
                            UserId = pl.UserId
                        },
                        TotalUseItinerary = pl.ItineraryDetails.Count,
                        TotalView = BusinessAnalyticEntities.Sum(pl => pl.TotalView),
                        TotalContact = BusinessAnalyticEntities.Sum(pl => pl.TotalContact),
                        LastViewedDate = BusinessAnalyticEntities.OrderByDescending(s => s.LastViewedDate).First(),       
                    }).FirstOrDefaultAsync();
                if (businessEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                var data = businessEntity.Adapt<BusinessMoreInfoResponseDto>();
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

        #endregion get business by Id

        #region Create business
        public async Task<ApiResponse<BusinessDetailResponseDto>> CreateBusinessAsync(CreateBusinessRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            if (requestDto == null)
            {
                return new ApiResponse<BusinessDetailResponseDto>()
                {
                    Result = new ResponseResult<BusinessDetailResponseDto>()
                    {
                        Errors = new List<ErrorDetail>() { new ErrorDetail() { Error = $"Dữ liệu gửi về không hợp lệ. Vui lòng kiểm tra lại.", ErrorScope = CErrorScope.FormSummary } },
                        Success = false
                    },
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<BusinessDetailResponseDto>();
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
                var businessExist = await _dbContext.Businesses.Where(pl => pl.BusinessName.ToLower() == requestDto.BusinessName.ToLower()
                    ).FirstOrDefaultAsync();
                if (businessExist != null)
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Doanh nghiệp đã tồn tại.",
                        ErrorScope = CErrorScope.FormSummary
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status409Conflict;
                    return response;
                }
                bool hasAdminRole = (await _userManager.GetRolesAsync(user: currentUser)).Contains(CRoleType.Admin.ToString());

                var businessEntity = new BusinessEntity()
                {
                    Address = requestDto.Address,
                    BusinessName = requestDto.BusinessName,
                    Service = requestDto.Service,
                    BusinessServiceType = requestDto.businessServiceType,
                    IsNew = hasAdminRole ? requestDto.IsNew : true,
                    BusinessContactPerson = requestDto.BusinessContactPerson,
                    UserId = currentUser.Id,
                };
                _dbContext.Businesses.Add(entity: businessEntity);
                var adminUsers = await _userManager.GetUsersInRoleAsync(roleName: CRoleType.Admin.ToString());
                if (!hasAdminRole)
                {
                    // if normal user need send notification to admin handle request add new business.
                    if (!adminUsers.IsNullOrEmpty())
                    {
                        var notifications = new List<NotificationEntity>();
                        foreach (var user in adminUsers)
                        {
                            var notificationEntity = new NotificationEntity()
                            {
                                IsRead = false,
                                Title = "Yêu cầu xác nhận Doanh nghiệp mới.",
                                Content = $"{requestDto.BusinessName} - {requestDto.Address}",
                                Type = CNotificationType.Business,
                                UserId = user.Id
                            };
                            await _notificationHubContext.Clients.User(user.Id.ToString())
                                .SendAsync("ReceiveNotification", $"Có yêu cầu phê duyệt doanh nghiệp mới: {requestDto.BusinessName}.");
                            notifications.Add(notificationEntity);
                        }
                        _dbContext.Notifications.AddRange(entities: notifications);
                    }
                    else
                    {
                        _logger.LogWarning($"Không tìm thấy người dùng nào có vai trò Admin để gửi thông báo.");
                    }
                }
                else
                {
                    // send notification for all user about new business.
                    List<Guid> adminUserIds = adminUsers.Select(a => a.Id).ToList();
                    var normalUser = await _dbContext.Users.Where(us => !adminUserIds.Contains(us.Id)).ToListAsync();
                    var notifications = new List<NotificationEntity>();
                    foreach (var user in normalUser)
                    {
                        var notificationEntity = new NotificationEntity()
                        {
                            IsRead = false,
                            Title = "Thông báo có doanh nghiệp mới.",
                            Content = $"{requestDto.BusinessName} - {requestDto.Address}",
                            Type = CNotificationType.Business,
                            UserId = user.Id
                        };
                        await _notificationHubContext.Clients.User(user.Id.ToString())
                            .SendAsync("ReceiveNotification", $"Có doanh nghiệp mới: {requestDto.BusinessName}.");
                        notifications.Add(notificationEntity);
                    }
                    _dbContext.Notifications.AddRange(entities: notifications);
                }
                await _dbContext.SaveChangesAsync();
                var data = businessEntity.Adapt<BusinessMoreInfoResponseDto>();
                response.Result.Success = true;
                response.Result.Data = data;
                response.StatusCode = StatusCodes.Status201Created;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }

        #endregion Create business
        private ImageProperty ConvertToImageProperty(ImageFileInfo imageFileInfo,
                    CImageType imageType, bool isDefault = false)
        {
            return new ImageProperty
            {
                BlobId = imageFileInfo.FileId,
                FileName = imageFileInfo.Name,
                Url = imageFileInfo.Url,
                Width = imageFileInfo.Width,
                Height = imageFileInfo.Height,
                FolderName = string.Empty,
                IsDefault = isDefault,
                BlobType = CBlobType.ImageKit,
                ImageType = imageType,
                FileExtensionType = CFileExtensionType.JPEG
            };
        }
    }
}