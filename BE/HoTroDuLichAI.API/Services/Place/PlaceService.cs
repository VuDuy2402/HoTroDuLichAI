using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI.API
{
    public class PlaceService : IPlaceService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly UserManager<UserEntity> _userManager;
        private readonly IImageKitIOService _imagekitIOService;
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly ILogger<PlaceService> _logger;

        public PlaceService(
            HoTroDuLichAIDbContext dbContext,
            IHubContext<NotificationHub> notificationHubContext,
            IImageKitIOService imagekitIOService,
            ILogger<PlaceService> logger,
            UserManager<UserEntity> userManager)
        {
            _dbContext = dbContext;
            _imagekitIOService = imagekitIOService;
            _notificationHubContext = notificationHubContext;
            _logger = logger;
            _userManager = userManager;
        }

        #region remove place images

        public async Task<ApiResponse<ResultMessage>> DeletePlaceImagesAsync(DeletePlaceImagesRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ResultMessage>();
            if (requestDto == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Dữ liệu gửi về không hợp lệ, vui lòng kiểm tra lại.",
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                response.StatusCode = StatusCodes.Status400BadRequest;
                return response;
            }
            errors = ErrorHelper.GetModelStateError(modelState: modelState);
            if (!errors.IsNullOrEmpty())
            {
                return await ResponseHelper.BadRequestErrorAsync(errors: errors, response: response);
            }
            var placeExist = await _dbContext.Places.FindAsync(requestDto.PlaceId);
            if (placeExist == null)
            {
                return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
            }
            var images = placeExist.ImageProperties.Where(img => !requestDto.FileIds.Contains(img.BlobId));
            placeExist.ImageGallery = images.ToJson();
            _dbContext.Places.Update(entity: placeExist);
            try
            {
                await _imagekitIOService.BulkDeleteFilesAsync(requestDto: new ImageKitDeleteRequestDto()
                {
                    FileIds = requestDto.FileIds
                });
                await _dbContext.SaveChangesAsync();
                response.Result.Success = true;
                response.Result.Data = new ResultMessage()
                {
                    Message = $"Xóa hình ảnh của địa điểm thành công.",
                    Level = CNotificationLevel.Success
                };
                response.StatusCode = StatusCodes.Status202Accepted;
                return response;
            }
            catch (Exception ex)
            {
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
        #endregion remove place images

        #region get place with paging
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
                IQueryable<PlaceEntity> collection = _dbContext.Places
                    .Include(pl => pl.User)
                    .Include(pl => pl.ReviewPlaces);
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
                if (param.IsNew)
                {
                    collection = collection.Where(c => c.IsNew && c.Appoved == CApprovalType.Accepted);
                }
                if (param.IsRequestNewPlace)
                {
                    collection = collection.Where(pl => pl.Appoved != CApprovalType.Accepted && pl.IsNew)
                        .OrderByDescending(pl => pl.Appoved)
                        .ThenByDescending(pl => pl.CreatedDate);
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
                    if (filter.ApprovalType.HasValue && param.IsAdmin)
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
                if (!param.IsMy && !param.IsAdmin && !param.IsRequestNewPlace)
                {
                    // collection = collection.Where(c => c.Appoved == CApprovalType.Accepted)
                    //     .OrderByDescending(pl => ((pl.TotalView * 0.3) +
                    //         (pl.Rating * 0.5) +
                    //         (pl.ReviewPlaces.Count * 0.2) +
                    //         (new Random().NextDouble() * 0.1)));
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
                    },
                    CreatedDate = pl.CreatedDate
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
        #endregion get place with paging

        #region Get place by Id
        public async Task<ApiResponse<PlaceMoreInfoResponseDto>> GetPlaceDetailByIdAsync(Guid placeId)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<PlaceMoreInfoResponseDto>();
            try
            {
                var placeEntity = await _dbContext.Places
                    .Include(pl => pl.User)
                    .Include(pl => pl.ReviewPlaces)
                    .Include(pl => pl.ItineraryDetails)
                    .Where(pl => pl.Id == placeId)
                    .Select(pl => new
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
                        Address = pl.Address,
                        Description = pl.Description,
                        OwnerProperty = new OwnerProperty()
                        {
                            Avatar = pl.User.Avatar,
                            Email = pl.User.Email ?? string.Empty,
                            FullName = pl.User.FullName,
                            UserId = pl.UserId
                        },
                        ImageGallery = pl.ImageGallery,
                        TotalReview = pl.ReviewPlaces.Count,
                        TotalUseItinerary = pl.ItineraryDetails.Count
                    }).FirstOrDefaultAsync();
                if (placeEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                var data = placeEntity.Adapt<PlaceMoreInfoResponseDto>();
                data.ImageDetailProperties = placeEntity.ImageGallery.FromJson<List<ImageProperty>>()
                    .Select(img => new ImageDetailProperty()
                    {
                        FileId = img.BlobId,
                        FileName = img.FileName,
                        IsDefault = img.IsDefault,
                        Type = img.ImageType,
                        Url = img.Url
                    }).ToList();
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
        #endregion Get place by Id

        #region Create place
        public async Task<ApiResponse<PlaceDetailResponseDto>> CreatePlaceAsync(CreatePlaceRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            if (requestDto == null)
            {
                return new ApiResponse<PlaceDetailResponseDto>()
                {
                    Result = new ResponseResult<PlaceDetailResponseDto>()
                    {
                        Errors = new List<ErrorDetail>() { new ErrorDetail() { Error = $"Dữ liệu gửi về không hợp lệ. Vui lòng kiểm tra lại.", ErrorScope = CErrorScope.FormSummary } },
                        Success = false
                    },
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<PlaceDetailResponseDto>();
            if (!errors.IsNullOrEmpty())
            {
                return await ResponseHelper.BadRequestErrorAsync(errors: errors, response: response);
            }
            if (requestDto.PlaceType == CPlaceType.None)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Bạn phải chọn loại địa điểm.",
                    ErrorScope = CErrorScope.Field,
                    Field = $"{nameof(requestDto.PlaceType)}_Error"
                });
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                response.StatusCode = StatusCodes.Status400BadRequest;
                return response;
            }
            try
            {
                var currentUser = RuntimeContext.CurrentUser;
                if (currentUser == null)
                {
                    return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                }
                var placeExist = await _dbContext.Places.Where(pl => pl.Name.ToLower() == requestDto.Name.ToLower()
                    || (pl.Longitude == requestDto.Longitude && pl.Latitude == requestDto.Latitude)).FirstOrDefaultAsync();
                if (placeExist != null)
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Địa điểm đã tồn tại.",
                        ErrorScope = CErrorScope.FormSummary
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status409Conflict;
                    return response;
                }
                bool hasAdminRole = (await _userManager.GetRolesAsync(user: currentUser)).Contains(CRoleType.Admin.ToString());
                var imageProperties = new List<ImageProperty>();
                int index = 0;
                foreach (var id in requestDto.FileIds)
                {
                    var imageResponse = await _imagekitIOService.GetFileDetailsAsync(fileId: id);
                    if (imageResponse.StatusCode == StatusCodes.Status200OK)
                    {
                        if (imageResponse.Result.Data != null && imageResponse.Result.Data is ImageFileInfo imageInfo
                            && imageInfo != null)
                        {
                            imageProperties.Add(ConvertToImageProperty(imageFileInfo: imageInfo, imageType: CImageType.Gallery, isDefault: index++ == 0));
                        }
                    }
                }

                var placeEntity = new PlaceEntity()
                {
                    Appoved = hasAdminRole ? CApprovalType.Accepted : CApprovalType.PendingAprroval,
                    Address = requestDto.Address,
                    IsNew = hasAdminRole ? requestDto.IsNew : true,
                    Latitude = requestDto.Latitude,
                    Longitude = requestDto.Longitude,
                    Description = requestDto.Description,
                    Name = requestDto.Name,
                    PlaceType = requestDto.PlaceType,
                    UserId = currentUser.Id,
                    Thumbnail = imageProperties.Where(img => img.IsDefault).Select(img => img.Url).FirstOrDefault() ?? string.Empty,
                    ImageGallery = imageProperties.ToJson()
                };
                _dbContext.Places.Add(entity: placeEntity);
                var adminUsers = await _userManager.GetUsersInRoleAsync(roleName: CRoleType.Admin.ToString());
                if (!hasAdminRole)
                {
                    // if normal user need send notification to admin handle request add new Place.
                    if (!adminUsers.IsNullOrEmpty())
                    {
                        var notifications = new List<NotificationEntity>();
                        foreach (var user in adminUsers)
                        {
                            var notificationEntity = new NotificationEntity()
                            {
                                IsRead = false,
                                Title = "Yêu cầu xác nhận địa điểm mới.",
                                Content = $"{requestDto.Name} - {requestDto.Address}",
                                Type = CNotificationType.Place,
                                UserId = user.Id
                            };
                            await _notificationHubContext.Clients.User(user.Id.ToString())
                                .SendAsync("ReceiveNotification", $"Có yêu cầu phê duyệt địa điểm mới: {requestDto.Name}.");
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
                    // send notification for all user about new palce.
                    List<Guid> adminUserIds = adminUsers.Select(a => a.Id).ToList();
                    var normalUser = await _dbContext.Users.Where(us => !adminUserIds.Contains(us.Id)).ToListAsync();
                    var notifications = new List<NotificationEntity>();
                    foreach (var user in normalUser)
                    {
                        var notificationEntity = new NotificationEntity()
                        {
                            IsRead = false,
                            Title = "Thông báo có địa điểm mới.",
                            Content = $"{requestDto.Name} - {requestDto.Address}",
                            Type = CNotificationType.Place,
                            UserId = user.Id
                        };
                        await _notificationHubContext.Clients.User(user.Id.ToString())
                            .SendAsync("ReceiveNotification", $"Có địa điểm mới: {requestDto.Name}.");
                        notifications.Add(notificationEntity);
                    }
                    _dbContext.Notifications.AddRange(entities: notifications);
                }
                await _dbContext.SaveChangesAsync();
                var data = placeEntity.Adapt<PlaceMoreInfoResponseDto>();
                data.ImageDetailProperties = imageProperties.Select(img => new ImageDetailProperty()
                {
                    FileId = img.BlobId,
                    FileName = img.FileName,
                    IsDefault = img.IsDefault,
                    Type = img.ImageType,
                    Url = img.Url
                }).ToList();
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

        #endregion Create place


        #region Update place
        public async Task<ApiResponse<ResultMessage>> UpdatePlaceAsync(UpdatePlaceRequestDto requestDto,
            ModelStateDictionary? modelState = null)
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

                var placeEntity = await _dbContext.Places.FindAsync(requestDto.PlaceId);
                if (placeEntity == null)
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Địa điểm không tồn tại.",
                        ErrorScope = CErrorScope.FormSummary
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status404NotFound;
                    return response;
                }

                if (placeEntity.UserId != currentUser.Id && !await _userManager.IsInRoleAsync(currentUser, CRoleType.Admin.ToString()))
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Bạn không có quyền sửa địa điểm này.",
                        ErrorScope = CErrorScope.FormSummary
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status403Forbidden;
                    return response;
                }

                var placeExist = await _dbContext.Places.Where(pl => (pl.Name.ToLower() == requestDto.Name.ToLower()
                    || (pl.Longitude == requestDto.Longitude && pl.Latitude == requestDto.Latitude))
                    && pl.Id != requestDto.PlaceId).FirstOrDefaultAsync();

                if (placeExist != null)
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Địa điểm đã tồn tại với tên hoặc vị trí này.",
                        ErrorScope = CErrorScope.FormSummary
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status409Conflict;
                    return response;
                }

                placeEntity.Name = requestDto.Name;
                placeEntity.Address = requestDto.Address;
                placeEntity.IsNew = requestDto.IsNew;
                placeEntity.Latitude = requestDto.Latitude;
                placeEntity.Longitude = requestDto.Longitude;
                placeEntity.Description = requestDto.Description;
                placeEntity.PlaceType = requestDto.PlaceType;

                var imageProperties = new List<ImageProperty>();
                foreach (var imgFile in requestDto.ImageFiles)
                {
                    var imageResponse = await _imagekitIOService.GetFileDetailsAsync(fileId: imgFile.FileId);
                    if (imageResponse.StatusCode == StatusCodes.Status200OK)
                    {
                        if (imageResponse.Result.Data != null && imageResponse.Result.Data is ImageFileInfo imageInfo && imageInfo != null)
                        {
                            var property = ConvertToImageProperty(imageFileInfo: imageInfo, imageType: CImageType.Gallery, isDefault: imgFile.IsDefault);
                            if (imgFile.IsDefault)
                            {
                                placeEntity.Thumbnail = property.Url;
                            }
                            imageProperties.Add(property);
                        }
                    }
                }
                placeEntity.ImageGallery = imageProperties.IsNullOrEmpty() ? placeEntity.ImageGallery : imageProperties.ToJson();
                _dbContext.Places.Update(placeEntity);

                var adminUsers = await _userManager.GetUsersInRoleAsync(CRoleType.Admin.ToString());
                if (adminUsers.Any())
                {
                    var notifications = new List<NotificationEntity>();
                    foreach (var user in adminUsers)
                    {
                        var notificationEntity = new NotificationEntity()
                        {
                            IsRead = false,
                            Title = "Cập nhật địa điểm.",
                            Content = $"{requestDto.Name} - {requestDto.Address}",
                            Type = CNotificationType.Place,
                            UserId = user.Id
                        };
                        await _notificationHubContext.Clients.User(user.Id.ToString())
                            .SendAsync("ReceiveNotification", $"Địa điểm đã được cập nhật: {requestDto.Name}.");
                        notifications.Add(notificationEntity);
                    }
                    _dbContext.Notifications.AddRange(notifications);
                }

                await _dbContext.SaveChangesAsync();

                // var data = placeEntity.Adapt<PlaceMoreInfoResponseDto>();
                // data.ImageDetailProperties = imageProperties.Select(img => new ImageDetailProperty()
                // {
                //     FileId = img.BlobId,
                //     FileName = img.FileName,
                //     IsDefault = img.IsDefault,
                //     Type = img.ImageType,
                //     Url = img.Url
                // }).ToList();

                response.Result.Success = true;
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Cập nhật địa điểm thành công.",
                    NotificationType = CNotificationType.Place
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
        #endregion Update place

        #region Delete place
        public async Task<ApiResponse<ResultMessage>> DeletePlaceAsync(Guid placeId)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ResultMessage>();
            try
            {
                var placeEntity = await _dbContext.Places.FindAsync(placeId);
                if (placeEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                _dbContext.Places.Remove(entity: placeEntity);
                await _dbContext.SaveChangesAsync();
                response.Result.Success = true;
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Xóa địa điểm thành công.",
                    NotificationType = CNotificationType.Place
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
        #endregion Delete place


        #region Approval new place request
        public async Task<ApiResponse<ResultMessage>> ApprovalRequestCreatePlaceAsync(
            ApproveCreatePlaceRequestDto requestDto)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ResultMessage>();
            if (requestDto == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Dữ liệu gửi về không đúng định dạng. Vui lòng kiểm tra lại.",
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                response.StatusCode = StatusCodes.Status400BadRequest;
                return response;
            }
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var placeEntity = await _dbContext.Places.FindAsync(requestDto.PlaceId);
                    if (placeEntity == null)
                    {
                        await transaction.RollbackAsync();
                        return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                    }
                    if (!placeEntity.IsNew)
                    {
                        await transaction.RollbackAsync();
                        errors.Add(new ErrorDetail()
                        {
                            Error = "Yêu cầu không hợp lệ. Địa không phải là địa điểm mới.",
                            ErrorScope = CErrorScope.PageSumarry
                        });
                        response.Result.Errors.AddRange(errors);
                        response.Result.Success = false;
                        response.StatusCode = StatusCodes.Status406NotAcceptable;
                        return response;
                    }
                    if (placeEntity.Appoved != CApprovalType.PendingAprroval)
                    {
                        await transaction.RollbackAsync();
                        errors.Add(new ErrorDetail()
                        {
                            Error = $"Yêu cầu không hợp lệ. Trạng thái yêu cầu không còn ở '{CApprovalType.PendingAprroval.ToDescription()}'",
                            ErrorScope = CErrorScope.PageSumarry
                        });
                        response.Result.Errors.AddRange(errors);
                        response.Result.Success = false;
                        response.StatusCode = StatusCodes.Status410Gone;
                        return response;
                    }
                    placeEntity.Appoved = requestDto.Type;
                    _dbContext.Places.Update(entity: placeEntity);
                    await _dbContext.SaveChangesAsync();
                    var currentUser = RuntimeContext.CurrentUser;
                    var notificationEntity = new NotificationEntity()
                    {
                        Content = $"Admin {currentUser?.FullName} {requestDto.Type.ToDescription()} yêu cầu đăng điểm mới '{placeEntity.Name}'",
                        IsRead = false,
                        Title = $"Yêu cầu đăng địa điểm mới : '{placeEntity.Name}' của bạn {requestDto.Type.ToDescription()}",
                        Type = CNotificationType.Place,
                        UserId = placeEntity.UserId
                    };
                    await _notificationHubContext.Clients.User(placeEntity.UserId.ToString())
                        .SendAsync("ReceiveNotification", $"Có thông báo mới.");
                    _dbContext.Notifications.Add(entity: notificationEntity);
                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                    response.Result.Success = true;
                    response.Result.Data = new ResultMessage()
                    {
                        Level = CNotificationLevel.Info,
                        Message = $"Xác nhận yêu cầu đăng địa điểm mới {requestDto.Type.ToDescription()}",
                        NotificationType = CNotificationType.Place
                    };
                    response.StatusCode = StatusCodes.Status202Accepted;
                    return response;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex.Message);
                    return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
                }
            }
        }
        #endregion Approval new place request


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