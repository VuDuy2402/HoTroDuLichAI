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

        #region  report
        public async Task<ApiResponse<BusinessViewContactReportResponseDto>> GetMyViewContactReportAsync(ReportRequestDto requestDto)
        {
            var requestError = ErrorHelper.GetReportError<BusinessViewContactReportResponseDto>(requestDto: requestDto);
            if (requestError != null)
            {
                return requestError;
            }
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<BusinessViewContactReportResponseDto>();
            try
            {
                var currentUser = RuntimeContext.CurrentUser;
                if (currentUser == null)
                {
                    return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                }
                var bussinessExist = await _dbContext.Businesses.Where(b => b.UserId == currentUser.Id).FirstOrDefaultAsync();
                if (bussinessExist == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                var itineraryDetails = await _dbContext.ItineraryDetails
                    .Include(id => id.Business)
                    .Where(id => id.BusinessId == bussinessExist.Id).ToListAsync();
                decimal totalAmount = 0;
                foreach (var item in itineraryDetails)
                {
                    totalAmount += item.Business.ServiceProperties.Where(sp => item.BusinessServiceListIds.Contains(sp.ServiceId)).Sum(sp => sp.Amount);
                }
                var report = await _dbContext.BusinessAnalytics.Include(by => by.Business)
                    .Where(by => by.Business.UserId == currentUser.Id).FirstOrDefaultAsync();
                if (report == null)
                {
                    var businessAnaly = new BusinessAnalyticEntity()
                    {
                        BusinessId = bussinessExist.Id,
                        TotalContact = 0,
                        TotalView = 0,
                        LastViewedDate = DateTimeOffset.UtcNow
                    };
                    _dbContext.BusinessAnalytics.Add(entity: businessAnaly);
                    await _dbContext.SaveChangesAsync();
                    var data = new BusinessViewContactReportResponseDto()
                    {
                        BusinessId = bussinessExist.Id,
                        BusinessName = bussinessExist.BusinessName,
                        TotalContact = businessAnaly.TotalContact,
                        TotalView = businessAnaly.TotalView,
                        TotalAmount = totalAmount
                    };
                    response.Result.Data = data;
                }
                else
                {
                    response.Result.Data = new BusinessViewContactReportResponseDto()
                    {
                        BusinessId = bussinessExist.Id,
                        BusinessName = bussinessExist.BusinessName,
                        TotalContact = report.TotalContact,
                        TotalView = report.TotalView,
                        TotalAmount = totalAmount
                    };
                }
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status200OK;
                return response;
            }
            catch(Exception ex)
            {
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }


        public async Task<ApiResponse<List<BusinessServiceUsedReportResponseDto>>> GetMyServiceUsedReportAsync(ReportRequestDto requestDto)
        {
            var requestError = ErrorHelper.GetReportError<List<BusinessServiceUsedReportResponseDto>>(requestDto: requestDto);
            if (requestError != null)
            {
                return requestError;
            }
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<List<BusinessServiceUsedReportResponseDto>>();
            try
            {
                var currentUser = RuntimeContext.CurrentUser;
                if (currentUser == null)
                {
                    return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                }
                var bussinessExist = await _dbContext.Businesses.Where(b => b.UserId == currentUser.Id).FirstOrDefaultAsync();
                if (bussinessExist == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                // lấy ra tất cả những service đã được sử dụng trong các chi tiết hành trình
                var itineraryDetails = await _dbContext.ItineraryDetails
                    .Include(it => it.Itinerary)
                    .Include(it => it.Business)
                    .Where(id => id.BusinessId == bussinessExist.Id && id.CreatedDate > requestDto.FromDate && id.CreatedDate < requestDto.ToDate)
                    .Select(item => new
                    {
                        BusinessServiceIds = item.BusinessServiceIds,
                        CreatedDate = item.CreatedDate
                    })
                    .OrderByDescending(item => item.CreatedDate)
                    .ToListAsync();
                var businessServiceInfos = itineraryDetails.Select(item => new
                {
                    ServiceIds = item.BusinessServiceIds.FromJson<List<Guid>>(),
                });
                // get những dịch được sử dụng trong thời gian trên
                var serviceIdCounts = businessServiceInfos
                    .SelectMany(serviceInfo => serviceInfo.ServiceIds)
                    .GroupBy(serviceId => serviceId)
                    .Select(group => new 
                    {
                        ServiceId = group.Key,
                        UseCount = group.Count()
                    })
                    .ToList();

                // sau khi get ra được những dịch vụ và số lần sử dụng của các dịch vụ đó tiếp theo là select những field cần trả về
                var services = bussinessExist.Service.FromJson<List<BusinessServiceProperty>>();
                var data = services.Select(service =>
                {
                    var reportService = serviceIdCounts.Where(si => si.ServiceId == service.ServiceId).FirstOrDefault();
                    return new BusinessServiceUsedReportResponseDto()
                    {
                        ServiceId = service.ServiceId,
                        ServiceName = service.Name,
                        TotalAmount = reportService == null ? 0 : (reportService.UseCount * service.Amount),
                        TotalUse = reportService == null ? 0 : reportService.UseCount
                    };
                }).ToList();
                response.Result.Data = data;
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status200OK;
                return response;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
        

        public async Task<ApiResponse<BusinessContactProperty>> GetBusinessContactPersonAsync()
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<BusinessContactProperty>();
            try
            {
                var currentUser = RuntimeContext.CurrentUser;
                if (currentUser == null)
                {
                    return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                }
                var businessContact = await _dbContext.Businesses.Where(b => b.UserId == currentUser.Id).FirstOrDefaultAsync();
                if (businessContact == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                var contact = businessContact.BusinessContactProperty;
                if (string.IsNullOrEmpty(contact.Email) || string.IsNullOrEmpty(contact.Name))
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                response.Result.Data = contact;
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status200OK;
                return response;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
        #endregion report

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
                    collection = collection.Where(b => (
                        b.BusinessName + " " +
                        b.Address + " " +
                        b.Service + " " +
                        b.BusinessContactPerson
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
                var selected = pagedList.Select(b => new BusinessDetailResponseDto
                {
                    BusinessName = b.BusinessName,
                    Address = b.Address,
                    Appoved = b.Appoved,
                    IsNew = b.IsNew,
                    BusinessContactProperty = b.BusinessContactPerson.FromJson<BusinessContactProperty>(),
                    OwnerProperty = new OwnerProperty()
                    {
                        Avatar = b.User.Avatar,
                        Email = b.User.Email ?? string.Empty,
                        FullName = b.User.FullName,
                        UserId = b.UserId
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

                var BusinessAnalyticEntities = await _dbContext.BusinessAnalytics.Where(b => b.BusinessId == businessId)
                                                                        .Select(b => new
                                                                        {
                                                                            Id = b.Id,
                                                                            TotalView = b.TotalView,
                                                                            TotalContact = b.TotalContact,
                                                                            LastViewedDate = b.LastViewedDate,
                                                                            BusinessId = b.BusinessId,
                                                                        }).ToListAsync();

                var businessEntity = await _dbContext.Businesses
                    .Include(b=>b.User)
                    .Include(b => b.ItineraryDetails)
                    .Where(b => b.Id == businessId)
                    .Select(b => new
                    {
                        Id = b.Id,
                        Address = b.Address,
                        BusinessName = b.BusinessName,
                        Service = b.Service,
                        Appoved = b.Appoved,
                        IsNew = b.IsNew,
                        OwnerProperty = new OwnerProperty()
                        {
                            Avatar = b.User.Avatar,
                            Email = b.User.Email ?? string.Empty,
                            FullName = b.User.FullName,
                            UserId = b.UserId
                        },
                        TotalUseItinerary = b.ItineraryDetails.Count,
                        TotalView = BusinessAnalyticEntities.Sum(b => b.TotalView),
                        TotalContact = BusinessAnalyticEntities.Sum(b => b.TotalContact),
                        LastViewedDate = BusinessAnalyticEntities.OrderByDescending(b => b.LastViewedDate).First(),
                    }).FirstOrDefaultAsync();
                if (businessEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                var data = businessEntity.Adapt<BusinessMoreInfoResponseDto>();
                data.BusinessServiceProperty = businessEntity.Service.FromJson<BusinessServiceProperty>();
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
                var imageProperty = new ImageProperty();
                var imageResponse = await _imagekitIOService.GetFileDetailsAsync(fileId: requestDto.FileId);
                if (imageResponse.StatusCode == StatusCodes.Status200OK)
                {
                    if (imageResponse.Result.Data != null && imageResponse.Result.Data is ImageFileInfo imageInfo
                        && imageInfo != null)
                    {
                        imageProperty = (ConvertToImageProperty(imageFileInfo: imageInfo, imageType: CImageType.Gallery, isDefault: true));
                    }
                }
                var businessSeviceProperty = new BusinessServiceProperty()
                {
                    ServiceId = requestDto.BusinessServiceProperty.ServiceId,
                    Name = requestDto.BusinessServiceProperty.Name,
                    Status = requestDto.BusinessServiceProperty.Status,
                    Type = requestDto.BusinessServiceProperty.Type,
                    Amount = requestDto.BusinessServiceProperty.Amount,
                    Quantity = requestDto.BusinessServiceProperty.Quantity,
                    Thumbnail = imageProperty.Url ?? string.Empty,

                };
                var businessContactPerson = new BusinessContactProperty()
                {
                    Name = requestDto.BusinessContactPerson.Name,
                    Email = requestDto.BusinessContactPerson.Email,
                    PhoneNumber = requestDto.BusinessContactPerson.PhoneNumber,
                    ImageProperty = imageProperty,
                };
                var businessEntity = new BusinessEntity()
                {
                    BusinessName = requestDto.BusinessName,
                    Address = requestDto.Address,
                    Service = businessSeviceProperty.ToJson(),
                    IsNew = hasAdminRole ? requestDto.IsNew : true,
                    BusinessContactPerson = businessContactPerson.ToJson(),
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

        #region Update business
        public async Task<ApiResponse<ResultMessage>> UpdateBusinessAsync(UpdateBusinessRequestDto requestDto, ModelStateDictionary? modelState = null)
        {
            if (requestDto == null)
            {
                return new ApiResponse<ResultMessage>()
                {
                    Result = new ResponseResult<ResultMessage>()
                    {
                        Errors = new List<ErrorDetail>() { new ErrorDetail() { Error = $"Dữ liệu gửi về không hợp lệ. Vui lòng kiểm tra lại.", ErrorScope = CErrorScope.FormSummary } },
                        Success = false
                    },
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<ResultMessage>();
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
                var businessEntity = await _dbContext.Businesses.FindAsync(requestDto.BusinessId);
                if (businessEntity == null)
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Doanh nghiệp không tồn tại.",
                        ErrorScope = CErrorScope.FormSummary
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status404NotFound;
                    return response;
                }
                if (businessEntity.UserId != currentUser.Id && !await _userManager.IsInRoleAsync(currentUser, CRoleType.Admin.ToString()))
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Bạn không có quyền sửa doanh nghiệp này.",
                        ErrorScope = CErrorScope.FormSummary
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status403Forbidden;
                    return response;
                }
                businessEntity.BusinessName = requestDto.BusinessName;
                businessEntity.Address = requestDto.Address;
                var businessService = new BusinessServiceProperty()
                {
                    ServiceId = requestDto.BusinessServiceProperty.ServiceId,
                    Name = requestDto.BusinessServiceProperty.Name,
                    Status = requestDto.BusinessServiceProperty.Status,
                    Type = requestDto.BusinessServiceProperty.Type,
                    Amount = requestDto.BusinessServiceProperty.Amount,
                    Quantity = requestDto.BusinessServiceProperty.Quantity,
                    Thumbnail = requestDto.BusinessServiceProperty.Thumbnail,
                };
                businessEntity.Service = businessService.ToJson();
                var imageProperty = new ImageProperty();
                var imageResponse = await _imagekitIOService.GetFileDetailsAsync(fileId: requestDto.FileId);
                if (imageResponse.StatusCode == StatusCodes.Status200OK)
                {
                    if (imageResponse.Result.Data != null && imageResponse.Result.Data is ImageFileInfo imageInfo
                        && imageInfo != null)
                    {
                        imageProperty = (ConvertToImageProperty(imageFileInfo: imageInfo, imageType: CImageType.Gallery, isDefault: true));
                    }
                }
                var businessContactPerson = new BusinessContactProperty()
                {
                    Name = requestDto.BusinessContactProperty.Name,
                    Email = requestDto.BusinessContactProperty.Email,
                    PhoneNumber = requestDto.BusinessContactProperty.PhoneNumber,
                    ImageProperty = imageProperty,
                };
                businessEntity.BusinessContactPerson = businessContactPerson.ToJson();
                _dbContext.Businesses.Update(businessEntity);

                var adminUsers = await _userManager.GetUsersInRoleAsync(CRoleType.Admin.ToString());
                if (adminUsers.Any())
                {
                    var notifications = new List<NotificationEntity>();
                    foreach (var user in adminUsers)
                    {
                        var notificationEntity = new NotificationEntity()
                        {
                            IsRead = false,
                            Title = "Cập nhật doanh nghiệp.",
                            Content = $"{requestDto.BusinessName} - {requestDto.Address}",
                            Type = CNotificationType.Business,
                            UserId = user.Id
                        };
                        await _notificationHubContext.Clients.User(user.Id.ToString())
                            .SendAsync("ReceiveNotification", $"Doanh nghiệp đã được cập nhật: {requestDto.BusinessName}.");
                        notifications.Add(notificationEntity);
                    }
                    _dbContext.Notifications.AddRange(notifications);
                }
                await _dbContext.SaveChangesAsync();
                response.Result.Success = true;
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Cập nhật doanh nghiệp thành công.",
                    NotificationType = CNotificationType.Business
                };
                response.StatusCode = StatusCodes.Status202Accepted;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
        #endregion Update business
        public async Task<ApiResponse<ResultMessage>> DeleteBusinessAsync(Guid businessId)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ResultMessage>();
            try
            {
                var businessEntity = await _dbContext.Businesses.FindAsync(businessId);
                if (businessEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                _dbContext.Businesses.Remove(entity: businessEntity);
                await _dbContext.SaveChangesAsync();
                response.Result.Success = true;
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Xóa doanh nghiệp thành công.",
                    NotificationType = CNotificationType.Business
                };
                response.StatusCode = StatusCodes.Status202Accepted;
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