using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI.API
{
    public class ArticleService : IArticleService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly UserManager<UserEntity> _userManager;
        private readonly IImageKitIOService _imagekitIOService;
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly ILogger<ArticleService> _logger;

        public ArticleService(
            HoTroDuLichAIDbContext dbContext,
            UserManager<UserEntity> userManager,
            IImageKitIOService imagekitIOService,
            IHubContext<NotificationHub> notificationHubContext,
            ILogger<ArticleService> logger
        )
        {
            _dbContext = dbContext;
            _imagekitIOService = imagekitIOService;
            _notificationHubContext = notificationHubContext;
            _userManager = userManager;
            _logger = logger;
        }

        #region Create article
        public async Task<ApiResponse<ResultMessage>> CreateArticleAsync(CreateArticleRequestDto requestDto, ModelStateDictionary? modelState = null)
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
            if (requestDto.Type == CArticleType.None)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = "Bạn phải chọn loại bài đăng",
                    ErrorScope = CErrorScope.Field,
                    Field = $"{nameof(requestDto.Type)}_Error"
                });
            }
            try
            {
                var currentUser = RuntimeContext.CurrentUser;
                if (currentUser == null)
                {
                    return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                }
                var articleExist = await _dbContext.Articles.Where(at => at.Title.ToLower() == requestDto.Title.ToLower()).FirstOrDefaultAsync();
                if (articleExist != null)
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Bài đăng đã tồn tại.",
                        ErrorScope = CErrorScope.FormSummary
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status409Conflict;
                    return response;
                }
                bool hasAdminRole = (await _userManager.GetRolesAsync(user: currentUser)).Contains(CRoleType.Admin.ToString());
                var imageProperties = new List<ImageProperty>();
                var imageResponse = await _imagekitIOService.GetFileDetailsAsync(fileId: requestDto.ThumbnailFileId);
                if (imageResponse.StatusCode == StatusCodes.Status200OK)
                {
                    if (imageResponse.Result.Data != null && imageResponse.Result.Data is ImageFileInfo imageInfo
                        && imageInfo != null)
                    {
                        var imageProperty = ConvertToImageProperty(imageFileInfo: imageInfo, imageType: CImageType.Thumbnail, isDefault: true);
                        imageProperties.Add(imageProperty);
                    }
                }
                articleExist = new ArticleEntity()
                {
                    Approved = hasAdminRole ? CApprovalType.Accepted : CApprovalType.PendingAprroval,
                    Title = requestDto.Title,
                    Content = requestDto.Content,
                    Author = requestDto.Author,
                    Type = requestDto.Type,
                    Thumbnail = imageProperties.Where(img => img.IsDefault && img.ImageType == CImageType.Thumbnail)
                        .Select(img => img.Url).FirstOrDefault() ?? string.Empty,
                    ImageProperty = imageProperties.ToJson(),
                    UserId = currentUser.Id,
                };
                _dbContext.Articles.Add(articleExist);
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
                                Title = "Yêu cầu xác nhận bài đăng mới.",
                                Content = $"{requestDto.Title} - {requestDto.Author}",
                                Type = CNotificationType.Article,
                                UserId = user.Id
                            };
                            await _notificationHubContext.Clients.User(user.Id.ToString())
                                .SendAsync("ReceiveNotification", $"Có yêu cầu phê duyệt bài đăng mới: {requestDto.Title}.");
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
                    // send notification for all user about new article.
                    List<Guid> adminUserIds = adminUsers.Select(a => a.Id).ToList();
                    var normalUser = await _dbContext.Users.Where(us => !adminUserIds.Contains(us.Id)).ToListAsync();
                    var notifications = new List<NotificationEntity>();
                    foreach (var user in normalUser)
                    {
                        var notificationEntity = new NotificationEntity()
                        {
                            IsRead = false,
                            Title = "Thông báo có bài đăng mới.",
                            Content = $"{requestDto.Title} - {requestDto.Author}",
                            Type = CNotificationType.Article,
                            UserId = user.Id
                        };
                        await _notificationHubContext.Clients.User(user.Id.ToString())
                            .SendAsync("ReceiveNotification", $"Có bài đăng mới: {requestDto.Title}.");
                        notifications.Add(notificationEntity);
                    }
                    _dbContext.Notifications.AddRange(entities: notifications);
                }
                await _dbContext.SaveChangesAsync();
                response.Result.Success = true;
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = "Yêu cầu tạo bài viết thành công.",
                    NotificationType = CNotificationType.Article
                };
                response.StatusCode = StatusCodes.Status201Created;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
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
        #endregion Create article

        #region Delete Article
        public async Task<ApiResponse<ResultMessage>> DeleteArticleAsync(Guid articleId)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ResultMessage>();
            try
            {
                var articleEntity = await _dbContext.Articles.FindAsync(articleId);
                if (articleEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                _dbContext.Articles.Remove(entity: articleEntity);
                await _dbContext.SaveChangesAsync();
                response.Result.Success = true;
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Xóa bài đăng thành công.",
                    NotificationType = CNotificationType.Article
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
        #endregion Delete Article

        #region Get Article By Id
        public async Task<ApiResponse<ArticleDetailResponseDto>> GetArticleDetailByIdAsync(Guid articleId)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ArticleDetailResponseDto>();
            try
            {
                var articleEntity = await _dbContext.Articles
                    .Where(at => at.Id == articleId)
                    .Select(at => new ArticleDetailResponseDto
                    {
                        ArticleId = at.Id,
                        Title = at.Title,
                        Author = at.Author,
                        Content = at.Content,
                        Thumbnail = at.Thumbnail,
                        ApprovalType = at.Approved,
                        OwnerProperty = new OwnerProperty()
                        {
                            Avatar = at.User.Avatar,
                            Email = at.User.Email ?? string.Empty,
                            FullName = at.User.FullName,
                            UserId = at.UserId
                        }
                    }).FirstOrDefaultAsync();
                if (articleEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                var data = articleEntity.Adapt<ArticleDetailResponseDto>();
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
        #endregion Get Article By Id

        #region get article with paging
        public async Task<ApiResponse<BasePagedResult<ArticleInfoResponseDto>>> GetWithPagingAsync(ArticlePagingAndFilterParams param,
            ModelStateDictionary? modelState = null)
        {
            var response = new ApiResponse<BasePagedResult<ArticleInfoResponseDto>>();
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
                if (param.IsMy)
                {
                    var currentUser = RuntimeContext.CurrentUser;
                    if (currentUser == null)
                    {
                        return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                    }
                    collection = collection.Where(c => c.UserId == currentUser.Id);
                }
                if (param.IsPublic)
                {
                    var currentUser = RuntimeContext.CurrentUser;
                    if (currentUser == null)
                    {
                        return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                    }
                    collection = collection.Where(c => c.Approved == CApprovalType.Accepted)
                        .OrderByDescending(c => c.CreatedDate);
                }
                if (param.FilterProperty != null)
                {
                    var filter = param.FilterProperty;
                    if (filter.ApprovalType.HasValue)
                    {
                        collection = collection.Where(c => c.Approved == filter.ApprovalType.Value);
                    }
                    if (filter.ArticleType.HasValue)
                    {
                        collection = collection.Where(c => c.Type == filter.ArticleType.Value);
                    }
                    if (filter.FromDate.HasValue)
                    {
                        collection = collection.Where(c => c.CreatedDate >= filter.FromDate.Value);
                    }
                    if (filter.ToDate.HasValue)
                    {
                        collection = collection.Where(c => c.CreatedDate <= filter.ToDate.Value);
                    }
                }
                if (param.SorterProperty != null && !string.IsNullOrEmpty(param.SorterProperty.KeyName))
                {
                    var sorter = param.SorterProperty;
                    if (sorter.KeyName.Equals(nameof(ArticleEntity.Author), StringComparison.OrdinalIgnoreCase))
                    {
                        collection = sorter.IsASC ? collection.OrderBy(pl => pl.Author) : collection.OrderByDescending(pl => pl.Author);
                    }
                    if (sorter.KeyName.Equals(nameof(ArticleEntity.Title), StringComparison.OrdinalIgnoreCase))
                    {
                        collection = sorter.IsASC ? collection.OrderBy(pl => pl.Title) : collection.OrderByDescending(pl => pl.Title);
                    }
                    if (sorter.KeyName.Equals(nameof(ArticleEntity.Approved), StringComparison.OrdinalIgnoreCase))
                    {
                        collection = sorter.IsASC ? collection.OrderBy(pl => pl.Approved) : collection.OrderByDescending(pl => pl.Approved);
                    }
                    if (sorter.KeyName.Equals(nameof(ArticleEntity.Type), StringComparison.OrdinalIgnoreCase))
                    {
                        collection = sorter.IsASC ? collection.OrderBy(pl => pl.Type) : collection.OrderByDescending(pl => pl.Type);
                    }
                    if (sorter.KeyName.Equals(nameof(ArticleEntity.CreatedDate), StringComparison.OrdinalIgnoreCase))
                    {
                        collection = sorter.IsASC ? collection.OrderBy(pl => pl.CreatedDate) : collection.OrderByDescending(pl => pl.CreatedDate);
                    }
                }
                var pagedList = await PagedList<ArticleEntity>.ToPagedListAsync(
                    source: collection, pageNumber: param.PageNumber, pageSize: param.PageSize);
                var selected = pagedList.Select(pl => new ArticleInfoResponseDto
                {
                    ArticleId = pl.Id,
                    Title = pl.Title,
                    Author = pl.Author,
                    ArticleType = pl.Type,
                    ApprovalType = pl.Approved,
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
                var data = new BasePagedResult<ArticleInfoResponseDto>()
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
        #endregion get article with paging

        #region Update Article
        public async Task<ApiResponse<ResultMessage>> UpdateArticleAsync(UpdateArticleRequestDto requestDto, ModelStateDictionary? modelState = null)
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

                var articleEntity = await _dbContext.Articles.FindAsync(requestDto.ArticleId);
                if (articleEntity == null)
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Bài đăng không tồn tại.",
                        ErrorScope = CErrorScope.FormSummary
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status404NotFound;
                    return response;
                }
                if (articleEntity.UserId != currentUser.Id && !await _userManager.IsInRoleAsync(currentUser, CRoleType.Admin.ToString()))
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Bạn không có quyền sửa bài đăng này.",
                        ErrorScope = CErrorScope.FormSummary
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status403Forbidden;
                    return response;
                }
                var articleExist = await _dbContext.Articles.Where(at => (at.Title.ToLower() == requestDto.Title.ToLower()
                    && at.Id != requestDto.ArticleId)).FirstOrDefaultAsync();

                if (articleExist != null)
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Bài đăng đã tồn tại với tiêu đề này.",
                        ErrorScope = CErrorScope.FormSummary
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status409Conflict;
                    return response;
                }
                articleEntity.Title = requestDto.Title;
                articleEntity.Content = requestDto.Content;
                articleEntity.Type = requestDto.Type;
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
                                articleEntity.Thumbnail = property.Url;
                            }
                            imageProperties.Add(property);
                        }
                    }
                }
                articleEntity.ImageProperty = imageProperties.IsNullOrEmpty() ? articleEntity.ImageProperty : imageProperties.ToJson();
                _dbContext.Articles.Update(articleEntity);

                var adminUsers = await _userManager.GetUsersInRoleAsync(CRoleType.Admin.ToString());
                if (adminUsers.Any())
                {
                    var notifications = new List<NotificationEntity>();
                    foreach (var user in adminUsers)
                    {
                        var notificationEntity = new NotificationEntity()
                        {
                            IsRead = false,
                            Title = "Cập nhật bài đăng.",
                            Content = $"{requestDto.Title} - {requestDto.OwnerProperty.FullName}",
                            Type = CNotificationType.Article,
                            UserId = user.Id
                        };
                        await _notificationHubContext.Clients.User(user.Id.ToString())
                            .SendAsync("ReceiveNotification", $"Bài đăng đã được cập nhật: {requestDto.Title}.");
                        notifications.Add(notificationEntity);
                    }
                    _dbContext.Notifications.AddRange(notifications);
                }
                await _dbContext.SaveChangesAsync();
                response.Result.Success = true;
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Cập nhật bài đăng thành công.",
                    NotificationType = CNotificationType.Article
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
        #endregion Update Article

        #region Approval new article request
        public async Task<ApiResponse<ResultMessage>> ApprovalRequestCreateArticleAsync(
            ApproveCreateArticleRequestDto requestDto)
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
                    var articleEntity = await _dbContext.Articles.FindAsync(requestDto.ArticleId);
                    if (articleEntity == null)
                    {
                        await transaction.RollbackAsync();
                        return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                    }
                    if (articleEntity.Approved != CApprovalType.Accepted)
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
                    articleEntity.Approved = requestDto.Type;
                    _dbContext.Articles.Update(entity: articleEntity);
                    await _dbContext.SaveChangesAsync();
                    var currentUser = RuntimeContext.CurrentUser;
                    var notificationEntity = new NotificationEntity()
                    {
                        Content = $"Admin {currentUser?.FullName} {requestDto.Type.ToDescription()} yêu cầu đăng điểm mới '{articleEntity.Title}'",
                        IsRead = false,
                        Title = $"Yêu cầu đăng địa điểm mới : '{articleEntity.Title}' của bạn {requestDto.Type.ToDescription()}",
                        Type = CNotificationType.Article,
                        UserId = articleEntity.UserId
                    };
                    await _notificationHubContext.Clients.User(articleEntity.UserId.ToString())
                        .SendAsync("ReceiveNotification", $"Có thông báo mới.");
                    _dbContext.Notifications.Add(entity: notificationEntity);
                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                    response.Result.Success = true;
                    response.Result.Data = new ResultMessage()
                    {
                        Level = CNotificationLevel.Info,
                        Message = $"Xác nhận yêu cầu đăng bài viết mới {requestDto.Type.ToDescription()}",
                        NotificationType = CNotificationType.Article,
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
        #endregion Approval new article request
    }
}