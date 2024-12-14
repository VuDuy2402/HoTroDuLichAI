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
        private readonly IEmailService _emailService;
        private readonly ILogger<BusinessService> _logger;

        public BusinessService(
            HoTroDuLichAIDbContext dbContext,
            IHubContext<NotificationHub> notificationHubContext,
            IImageKitIOService imagekitIOService,
            ILogger<BusinessService> logger,
            IEmailService emailService,
            UserManager<UserEntity> userManager)
        {
            _dbContext = dbContext;
            _imagekitIOService = imagekitIOService;
            _notificationHubContext = notificationHubContext;
            _logger = logger;
            _userManager = userManager;
            _emailService = emailService;
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
            catch (Exception ex)
            {
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }


        #region  business services
        public async Task<ApiResponse<List<BusinessServiceProperty>>> GetAllBusinessServicesAsync(Guid businessId)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<List<BusinessServiceProperty>>();
            try
            {
                var currentUser = RuntimeContext.CurrentUser;
                if (currentUser == null)
                {
                    return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                }
                var businessEntity = await _dbContext.Businesses.Where(b => b.Id == businessId && b.UserId == currentUser.Id).FirstOrDefaultAsync();
                if (businessEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                response.Result.Data = businessEntity.ServiceProperties;
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status200OK;
                return response;
            }
            catch (Exception ex)
            {
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }

        public async Task<ApiResponse<BusinessServiceProperty>> GetBusinessServiceByBusinessIdAndServiceIdAsync(GetOrDeleteBusinessServiceRequestDto requestDto)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<BusinessServiceProperty>();
            try
            {
                var currentUser = RuntimeContext.CurrentUser;
                if (currentUser == null)
                {
                    return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                }
                var businessEntity = await _dbContext.Businesses.Where(b => b.Id == requestDto.BusinessId
                    // && b.UserId == currentUser.Id
                    ).FirstOrDefaultAsync();
                if (businessEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                var data = businessEntity.ServiceProperties.Where(s => s.ServiceId == requestDto.ServiceId).FirstOrDefault();
                if (data == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                response.Result.Data = data;
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status200OK;
                return response;
            }
            catch (Exception ex)
            {
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }

        public async Task<ApiResponse<ResultMessage>> CreateBusinessServiceAsync(CreateBusinessServiceRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ResultMessage>();
            if (requestDto == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Dữ liệu gửi về không đúng định dạng. Vui lòng kiểm tra lại.",
                    ErrorScope = CErrorScope.FormSummary
                });
                response.Result.Errors.AddRange(errors);
                response.StatusCode = StatusCodes.Status400BadRequest;
                response.Result.Success = false;
                return response;
            }
            errors = ErrorHelper.GetModelStateError(modelState: modelState);
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
                var businessEntity = await _dbContext.Businesses.Where(b => b.Id == requestDto.BusinessId && b.UserId == currentUser.Id).FirstOrDefaultAsync();
                if (businessEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                var services = businessEntity.ServiceProperties;
                services.Add( new BusinessServiceProperty()
                {
                    Amount = requestDto.Amount,
                    Name = requestDto.Name,
                    Quantity = requestDto.Quantity,
                    Status = requestDto.Status,
                    Thumbnail = requestDto.Thumbnail,
                    Type = requestDto.Type
                });
                businessEntity.Service = services.ToJson();
                _dbContext.Businesses.Update(entity: businessEntity);
                await _dbContext.SaveChangesAsync();
                response.StatusCode = StatusCodes.Status201Created;
                response.Result.Success = true;
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Thêm dịch vụ cho doanh nghiệp thành công",
                    NotificationType = CNotificationType.Business
                };
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }

        public async Task<ApiResponse<ResultMessage>> UpdateBusinessServiceByIdAsync(UpdateBusinessServiceRequestDto serviceProperty,
            ModelStateDictionary? modelState = null)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ResultMessage>();
            if (serviceProperty == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Dữ liệu gửi về không đúng định dạng. Vui lòng kiểm tra lại.",
                    ErrorScope = CErrorScope.FormSummary
                });
                response.Result.Errors.AddRange(errors);
                response.StatusCode = StatusCodes.Status400BadRequest;
                response.Result.Success = false;
                return response;
            }
            errors = ErrorHelper.GetModelStateError(modelState: modelState);
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
                var businessEntity = await _dbContext.Businesses.Where(b => b.Id == serviceProperty.BusinessId && b.UserId == currentUser.Id).FirstOrDefaultAsync();
                if (businessEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                if (!businessEntity.ServiceProperties.Where(s => s.ServiceId == serviceProperty.ServiceProperty.ServiceId).Any())
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                var services = businessEntity.ServiceProperties;
                foreach (var service in services)
                {
                    if (service.ServiceId == serviceProperty.ServiceProperty.ServiceId)
                    {
                        service.Amount = serviceProperty.ServiceProperty.Amount;
                        service.Name = serviceProperty.ServiceProperty.Name;
                        service.Quantity = serviceProperty.ServiceProperty.Quantity;
                        service.Status = serviceProperty.ServiceProperty.Status;
                        service.Thumbnail = serviceProperty.ServiceProperty.Thumbnail;
                        service.Type = serviceProperty.ServiceProperty.Type;
                        break;
                    }
                }
                businessEntity.Service = services.ToJson();
                _dbContext.Businesses.Update(entity: businessEntity);
                await _dbContext.SaveChangesAsync();
                response.StatusCode = StatusCodes.Status202Accepted;
                response.Result.Success = true;
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Cập nhật dịch vụ cho doanh nghiệp thành công",
                    NotificationType = CNotificationType.Business
                };
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }

        public async Task<ApiResponse<ResultMessage>> DeleteBusinessServiceByIdAsync(GetOrDeleteBusinessServiceRequestDto requestDto)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ResultMessage>();
            try
            {
                var currentUser = RuntimeContext.CurrentUser;
                if (currentUser == null)
                {
                    return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                }
                var businessEntity = await _dbContext.Businesses.Where(b => b.Id == requestDto.BusinessId
                    && b.UserId == currentUser.Id
                    ).FirstOrDefaultAsync();
                if (businessEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                var data = businessEntity.ServiceProperties.Where(s => s.ServiceId == requestDto.ServiceId).FirstOrDefault();
                if (data == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                var services = businessEntity.ServiceProperties;
                services.Remove(data);
                businessEntity.Service = services.ToJson();
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Xóa dịch vụ doanh nghiệp thành công",
                    NotificationType = CNotificationType.Business
                };
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status202Accepted;
                return response;
            }
            catch (Exception ex)
            {
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
        #endregion  business services


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
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }

        public async Task<ApiResponse<BusinessContactPersonInfoResponseDto>> GetBusinessContactPersonAsync()
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<BusinessContactPersonInfoResponseDto>();
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
                response.Result.Data = new BusinessContactPersonInfoResponseDto()
                {
                    Avatar = contact.ImageProperty.Url,
                    Email = contact.Email,
                    Name = contact.Name,
                    PhoneNumber = contact.PhoneNumber
                };
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status200OK;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
        #endregion report

        #region become to a business
        public async Task<ApiResponse<ResultMessage>> RequestToRegisterBusinessAsyn(RequestToCreateBusinessRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ResultMessage>();
            if (requestDto == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Dữ liệu gửi về không hợp lệ. Vui lòng kiểm tra lại.",
                    ErrorScope = CErrorScope.FormSummary
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
            if (requestDto.Longitude == 0 && requestDto.Latitude == 0)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Kinh độ không được để trống.",
                    ErrorScope = CErrorScope.Field,
                    Field = $"{nameof(requestDto.Longitude)}_Error"
                });
                errors.Add(new ErrorDetail()
                {
                    Error = $"Vĩ độ không được để trống.",
                    ErrorScope = CErrorScope.Field,
                    Field = $"{nameof(requestDto.Latitude)}_Error"
                });
            }
            if (!requestDto.ProvinceId.HasValue || (requestDto.ProvinceId.HasValue && requestDto.ProvinceId.Value == Guid.Empty))
            {
                errors.Add(new ErrorDetail()
                {
                    Error = "Tỉnh không được để trống.",
                    ErrorScope = CErrorScope.Field,
                    Field = $"{nameof(requestDto.ProvinceId)}_Error"
                });
            }
            if (requestDto.BusinessType == CBusinessServiceType.None)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = "Loại doanh nghiệp không được để trống.",
                    ErrorScope = CErrorScope.Field,
                    Field = $"{nameof(requestDto.BusinessType)}_Error"
                });
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
                var imageResponse = await _imagekitIOService.GetFileDetailsAsync(fileId: requestDto.ContactPersonInfo.FileId);
                var imageProperty = new ImageProperty();
                if (imageResponse.StatusCode == StatusCodes.Status200OK && imageResponse.Result.Data is ImageFileInfo imageInfo)
                {
                    imageProperty = ConvertToImageProperty(imageFileInfo: imageInfo, imageType: CImageType.Avatar, isDefault: true);
                }
                var businessEntity = await _dbContext.Businesses.Where(b => b.UserId == currentUser.Id
                    || (b.Longitude != 0 && b.Latitude != 0 && b.Longitude == requestDto.Longitude
                        && b.Latitude == requestDto.Latitude)).FirstOrDefaultAsync();
                if (businessEntity != null)
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Mỗi người dùng chỉ có thể đăng ký duy nhất 1 doanh nghiệp và không được trùng về địa điểm của các doanh nghiệp khác trên hệ thống.",
                        ErrorScope = CErrorScope.PageSumarry
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status409Conflict;
                    return response;
                }
                var businessContactProperty = new BusinessContactProperty()
                {
                    Email = requestDto.ContactPersonInfo.Email,
                    ImageProperty = imageProperty,
                    Name = requestDto.ContactPersonInfo.Name,
                    PhoneNumber = requestDto.ContactPersonInfo.PhoneNumber
                };
                businessEntity = new BusinessEntity()
                {
                    Address = requestDto.Address,
                    Appoved = CApprovalType.PendingAprroval,
                    BusinessName = requestDto.BusinessName,
                    BusinessServiceType = requestDto.BusinessType,
                    Latitude = requestDto.Latitude,
                    Longitude = requestDto.Longitude,
                    ProvinceId = requestDto.ProvinceId.HasValue ? requestDto.ProvinceId.Value : Guid.Empty,
                    UserId = currentUser.Id,
                    BusinessContactPerson = businessContactProperty.ToJson()
                };
                _dbContext.Businesses.Add(entity: businessEntity);
                await _dbContext.SaveChangesAsync();
                // notifcation to admin
                var adminUsers = await _userManager.GetUsersInRoleAsync(roleName: CRoleType.Admin.ToString());
                if (!adminUsers.IsNullOrEmpty())
                {
                    List<NotificationEntity> notifications = new List<NotificationEntity>();
                    foreach (var adminUser in adminUsers)
                    {
                        var notificationEntity = new NotificationEntity()
                        {
                            IsRead = false,
                            Title = "Yêu cầu xác nhận Doanh nghiệp mới.",
                            Content = $"{requestDto.BusinessName} - {requestDto.Address}",
                            Type = CNotificationType.Business,
                            UserId = adminUser.Id
                        };
                        notifications.Add(notificationEntity);
                        await _notificationHubContext.Clients.User(adminUser.Id.ToString())
                            .SendAsync("ReceiveNotification", $"Có doanh nghiệp mới: {requestDto.BusinessName}.");
                        notifications.Add(notificationEntity);
                    }
                    _dbContext.Notifications.AddRange(entities: notifications);
                    await _dbContext.SaveChangesAsync();
                }
                // email to admin
                await _emailService.SendEmailAsync(email: RuntimeContext.AppSettings.AdminSetting.Email,
                    subject: $"YÊU CẦU ĐĂNG KÝ DOANH NGHIỆP",
                    htmlTemplate: string.Empty,
                    fileTemplateName: "RequestToBecomeBusinessEmailTemplate.html",
                    replaceProperty: new RequestToBecomeBusinessEmailTemplateModel()
                    {
                        Address = businessEntity.Address,
                        BusinessName = businessEntity.BusinessName,
                        BusinessType = businessEntity.BusinessServiceType.ToDescription(),
                        Latitude = businessEntity.Latitude,
                        Longitude = businessEntity.Longitude,
                        ContactPersonAvatar = businessContactProperty.ImageProperty?.Url ?? string.Empty,
                        ContactPersonEmail = businessContactProperty.Email,
                        ContactPersonName = businessContactProperty.Name,
                        ContactPersonPhoneNumber = businessContactProperty.PhoneNumber,
                        ProvinceName = (await _dbContext.Provinces.FindAsync(requestDto.ProvinceId))?.Name ?? string.Empty,
                        RedirectUrl = $"{RuntimeContext.AppSettings.ClientApp.ClientEndpoint}/quantri/xacnhan/doanhnghiep/{businessEntity.Id}"
                    },
                    emailProviderType: CEmailProviderType.Gmail);

                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Yêu cầu đăng ký doanh nghiệp của bạn đã được gửi đi thành công. Vui lòng kiểm tra email bạn đã đăng ký trong vòng 2 ngày tới để biết được kết quả.",
                    NotificationType = CNotificationType.Business
                };
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status201Created;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }

        public async Task<ApiResponse<ResultMessage>> ApprovalNewBusinessRequestAsync(ApproveNewBusinessRequestDto requestDto,
            ModelStateDictionary? modelState = null)
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
                response.Result.Success = false;
                response.Result.Errors.AddRange(errors);
                response.StatusCode = StatusCodes.Status400BadRequest;
                return response;
            }
            errors = ErrorHelper.GetModelStateError(modelState: modelState);
            if (!errors.IsNullOrEmpty())
            {
                return await ResponseHelper.BadRequestErrorAsync(errors: errors, response: response);
            }
            if (requestDto.ApprovalType == CApprovalType.Rejected && string.IsNullOrEmpty(requestDto.Reason))
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Bạn cần thêm lý do từ chối yêu cầu.",
                    ErrorScope = CErrorScope.Field,
                    Field = $"{nameof(requestDto.Reason)}_Error"
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
                    var businessEntity = await _dbContext.Businesses.FindAsync(requestDto.BusinessId);
                    if (businessEntity == null)
                    {
                        errors.Add(new ErrorDetail()
                        {
                            Error = $"Không tìm thấy doanh nghiệp.",
                            ErrorScope = CErrorScope.PageSumarry
                        });
                        response.Result.Errors.AddRange(errors);
                        response.Result.Success = false;
                        response.StatusCode = StatusCodes.Status404NotFound;
                        return response;
                    }
                    var userEntity = await _userManager.FindByIdAsync(businessEntity.UserId.ToString());
                    if (userEntity == null)
                    {
                        errors.Add(new ErrorDetail()
                        {
                            Error = $"Không tìm thấy thông tin người dùng cho doanh nghiệp",
                            ErrorScope = CErrorScope.PageSumarry
                        });
                        response.Result.Success = false;
                        response.Result.Errors.AddRange(errors);
                        response.StatusCode = StatusCodes.Status404NotFound;
                        return response;
                    }
                    if (businessEntity.Appoved != CApprovalType.PendingAprroval)
                    {
                        errors.Add(new ErrorDetail()
                        {
                            Error = $"Doanh nghiệp đã được xác nhận trước đó.",
                            ErrorScope = CErrorScope.PageSumarry
                        });
                        response.Result.Success = false;
                        response.Result.Errors.AddRange(errors);
                        response.StatusCode = StatusCodes.Status409Conflict;
                        return response;
                    }
                    // update request
                    businessEntity.Appoved = requestDto.ApprovalType;
                    _dbContext.Businesses.Update(entity: businessEntity);
                    string content = string.Empty;
                    if (requestDto.ApprovalType == CApprovalType.Accepted)
                    {
                        var businessAnalyticEntity = await _dbContext.BusinessAnalytics.Where(b => b.BusinessId == businessEntity.Id).FirstOrDefaultAsync();
                        // need create business analytic entity
                        if (businessAnalyticEntity == null)
                        {
                            businessAnalyticEntity = new BusinessAnalyticEntity()
                            {
                                BusinessId = businessEntity.Id,
                                TotalContact = 0,
                                TotalView = 0,
                            };
                            _dbContext.BusinessAnalytics.Add(entity: businessAnalyticEntity);
                        }
                        // add business role and remove all login session
                        var userRoles = await _userManager.GetRolesAsync(user: userEntity);
                        if (!userRoles.Contains(CRoleType.Business.ToString()))
                        {
                            await _userManager.AddToRoleAsync(user: userEntity, role: CRoleType.Business.ToString());
                            var userRefreshTokens = await _dbContext.UserRefreshTokens.Where(ur => ur.UserId == userEntity.Id).ToListAsync();
                            userRefreshTokens.ForEach(ur =>
                            {
                                ur.ExpireTime = DateTimeOffset.UtcNow.AddHours(-1);
                                ur.IsRevoked = true;
                                ur.LastRevoked = DateTimeOffset.UtcNow.AddHours(-1);
                            });
                            _dbContext.UserRefreshTokens.UpdateRange(entities: userRefreshTokens);
                            await _dbContext.SaveChangesAsync();
                        }
                        content = $"Yêu cầu đăng ký doanh nghiệp của bạn đã được chấp nhập. Vui lòng truy cập Doanh Nghiệp Portal để hoàn tất các thông tin cần thiết.";
                    }
                    else if (requestDto.ApprovalType == CApprovalType.Rejected)
                    {
                        content = $"Yêu cầu đăng ký doanh nghiệp của bạn đã bị từ chối vì : {requestDto.Reason}";
                    }
                    await _notificationHubContext.Clients.User(businessEntity.UserId.ToString())
                        .SendAsync("ReceiveNotification", $"Thông báo xác nhận yêu cầu đăng ký doanh nghiệp");
                    var notificationEntity = new NotificationEntity()
                    {
                        Content = content,
                        Title = $"Thông báo kết quả đăng ký doanh nghiệp",
                        Type = CNotificationType.Business,
                        UserId = businessEntity.UserId
                    };
                    _dbContext.Notifications.Add(entity: notificationEntity);
                    await _dbContext.SaveChangesAsync();
                    // send email to user
                    await _emailService.SendEmailAsync(email: businessEntity.BusinessContactProperty.Email,
                        subject: "THÔNG BÁO KẾT QUẢ ĐĂNG KÝ DOANH NGHIỆP",
                        htmlTemplate: string.Empty,
                        fileTemplateName: "ApproveNewBusinessRequestEmailTemplate.html",
                        replaceProperty: new ApproveNewBusinessRequestEmailTemplateModel()
                        {
                            Address = businessEntity.Address,
                            BusinessName = businessEntity.BusinessName,
                            BusinessType = businessEntity.BusinessServiceType.ToDescription(),
                            Name = businessEntity.BusinessContactProperty.Name,
                            ProvinceName = (await _dbContext.Provinces.FindAsync(businessEntity.ProvinceId))?.Name ?? string.Empty,
                            Reason = content,
                            Status = requestDto.ApprovalType.ToString(),
                            ImageUrl = string.Empty
                        });
                    await transaction.CommitAsync();
                    response.Result.Data = new ResultMessage()
                    {
                        Level = CNotificationLevel.Success,
                        Message = $"Đã hoàn tất xác nhận yêu cầu đăng ký cho doanh nghiệp",
                        NotificationType = CNotificationType.Business
                    };
                    response.Result.Success = true;
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
        #endregion become to a business



        #region get business with paging
        public async Task<ApiResponse<BasePagedResult<BusinessMoreInfoResponseDto>>> GetWithPagingAsync(BusinessPagingAndFilterParams param, ModelStateDictionary? modelState = null)
        {
            ApiResponse<BasePagedResult<BusinessMoreInfoResponseDto>>? response = new ApiResponse<BasePagedResult<BusinessMoreInfoResponseDto>>();
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
                var currentUser = RuntimeContext.CurrentUser;
                if (currentUser == null)
                {
                    return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                }
                var roles = await _userManager.GetRolesAsync(user: currentUser);
                IQueryable<BusinessEntity> collection = _dbContext.Businesses
                    .Include(b => b.User)
                    .Include(b => b.Province).OrderByDescending(b => b.CreatedDate);
                if (param.IsAdmin)
                {
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
                else if (param.IsMy)
                {
                    collection = collection.Where(c => c.UserId == currentUser.Id);
                }
                else if (param.IsRequest)
                {
                    collection = collection.Where(c => c.Appoved != CApprovalType.Accepted).OrderByDescending(s => s.Appoved);
                }
                else
                {
                    collection = collection.Where(c => c.Appoved == CApprovalType.Accepted);
                }

                if (!string.IsNullOrEmpty(param.SearchQuery))
                {
                    collection = collection.Where(b => (
                        b.BusinessName + " " +
                        b.Address
                    ).ToLower().Contains(param.SearchQuery.ToLower()));
                }

                if (param.FilterProperty != null)
                {
                    var filter = param.FilterProperty;
                    if (filter.ApprovalType.HasValue)
                    {
                        collection = collection.Where(c => c.Appoved == filter.ApprovalType.Value);
                    }
                    if (filter.BusinessServiceType.HasValue)
                    {
                        collection = collection.Where(c => c.BusinessServiceType == filter.BusinessServiceType.Value);
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

                if (param.SortProperty != null)
                {
                    var sorter = param.SortProperty;
                    if (!string.IsNullOrEmpty(sorter.KeyName))
                    {
                        if (sorter.KeyName.Equals(nameof(BusinessEntity.BusinessName), StringComparison.OrdinalIgnoreCase))
                        {
                            collection = sorter.IsASC ? collection.OrderBy(pl => pl.BusinessName) : collection.OrderByDescending(pl => pl.BusinessName);
                        }
                        else if (sorter.KeyName.Equals(nameof(BusinessEntity.CreatedDate), StringComparison.OrdinalIgnoreCase))
                        {
                            collection = sorter.IsASC ? collection.OrderBy(pl => pl.CreatedDate) : collection.OrderByDescending(pl => pl.CreatedDate);
                        }
                        else if (sorter.KeyName.Equals(nameof(BusinessEntity.Appoved), StringComparison.OrdinalIgnoreCase))
                        {
                            collection = sorter.IsASC ? collection.OrderBy(pl => pl.Appoved) : collection.OrderByDescending(pl => pl.Appoved);
                        }
                        else if (sorter.KeyName.Equals(nameof(BusinessEntity.BusinessServiceType), StringComparison.OrdinalIgnoreCase))
                        {
                            collection = sorter.IsASC ? collection.OrderBy(pl => pl.BusinessServiceType) : collection.OrderByDescending(pl => pl.BusinessServiceType);
                        }
                        else
                        {
                            _logger.LogWarning($"{sorter.KeyName} not support sort.");
                        }
                    }
                }
                var pagedList = await PagedList<BusinessEntity>.ToPagedListAsync(
                    source: collection, pageNumber: param.PageNumber, pageSize: param.PageSize);
                var selected = pagedList.Select(b => new BusinessMoreInfoResponseDto
                {
                    Id = b.Id,
                    BusinessName = b.BusinessName,
                    Address = b.Address,
                    Appoved = b.Appoved,
                    BusinessServiceType = b.BusinessServiceType,
                    Latitude = b.Latitude,
                    Longitude = b.Longitude,
                    ProvinceId = b.ProvinceId,
                    ProvinceName = b.Province.Name,
                    CreatedDate = b.CreatedDate,
                    BusinessContactProperty = new BusinessContactPersonInfoResponseDto()
                    {
                        Avatar = b.BusinessContactProperty.ImageProperty.Url,
                        Email = b.BusinessContactProperty.Email,
                        Name = b.BusinessContactProperty.Name,
                        PhoneNumber = b.BusinessContactProperty.PhoneNumber
                    },
                    OwnerProperty = new OwnerProperty()
                    {
                        Avatar = b.User.Avatar,
                        Email = b.User.Email ?? string.Empty,
                        FullName = b.User.FullName,
                        UserId = b.UserId
                    }
                }).ToList();
                var data = new BasePagedResult<BusinessMoreInfoResponseDto>()
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
                var businessEntity = await _dbContext.Businesses.Include(u => u.User)
                    .Where(b => b.Id == businessId).FirstOrDefaultAsync();
                if (businessEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                var data = new BusinessMoreInfoResponseDto()
                {
                    Address = businessEntity.Address,
                    Appoved = businessEntity.Appoved,
                    BusinessServiceType = businessEntity.BusinessServiceType,
                    BusinessName = businessEntity.BusinessName,
                    Latitude = businessEntity.Latitude,
                    Longitude = businessEntity.Longitude,
                    OwnerProperty = new OwnerProperty()
                    {
                        Avatar = businessEntity.User.Avatar,
                        Email = businessEntity.User.Email ?? string.Empty,
                        FullName = businessEntity.User.FullName,
                        UserId = businessEntity.UserId
                    },
                    BusinessContactProperty = new BusinessContactPersonInfoResponseDto()
                    {
                        Avatar = businessEntity.BusinessContactProperty.ImageProperty.Url,
                        Email = businessEntity.BusinessContactProperty.Email,
                        Name = businessEntity.BusinessContactProperty.Name,
                        PhoneNumber = businessEntity.BusinessContactProperty.PhoneNumber
                    },
                    ProvinceId = businessEntity.ProvinceId,
                    ProvinceName = (await _dbContext.Provinces.FindAsync(businessEntity.ProvinceId))?.Name ?? string.Empty,
                    Id = businessEntity.Id,
                    BusinessServiceProperties = businessEntity.ServiceProperties,
                    CreatedDate = businessEntity.CreatedDate
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
                    // IsNew = hasAdminRole ? requestDto.IsNew : true,
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

        #region Get Business for Update
        public async Task<ApiResponse<UpdateBusinessRequestDto>> GetBusinessDetailForUpdateByIdAsync(Guid businessId)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<UpdateBusinessRequestDto>();
            try
            {
                var businessEntity = await _dbContext.Businesses.FindAsync(businessId);
                if (businessEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                response.Result.Data = businessEntity.Adapt<UpdateBusinessRequestDto>();
                response.Result.Data.BusinessContactProperty = new BusinessContact()
                {
                    Avatar = businessEntity.BusinessContactProperty.ImageProperty.Url,
                    Email = businessEntity.BusinessContactProperty.Email,
                    Name = businessEntity.BusinessContactProperty.Name,
                    PhoneNumber = businessEntity.BusinessContactProperty.PhoneNumber,
                    Id = businessEntity.BusinessContactProperty.Id,
                    FileId = businessEntity.BusinessContactProperty.ImageProperty.BlobId
                };
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status200OK;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }

        }
        #endregion Get Business for Update

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
                var businessExist = await _dbContext.Businesses.Where(b => b.BusinessName == requestDto.BusinessName && b.Id != requestDto.BusinessId).FirstOrDefaultAsync();
                if (businessExist != null)
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Tên doanh nghiệp {requestDto.BusinessName} đã được sử dụng trên hệ thống.",
                        ErrorScope = CErrorScope.Field,
                        Field = $"{nameof(BusinessEntity.BusinessName)}"
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status409Conflict;
                    return response;
                }
                businessExist = await _dbContext.Businesses.FindAsync(requestDto.BusinessId);
                if (businessExist == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                if (requestDto.IsBusiness && businessExist.UserId != currentUser.Id)
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Bạn không có quyền thay đổi thông tin của doanh nghiệp khác.",
                        ErrorScope = CErrorScope.PageSumarry,
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status403Forbidden;
                    return response;
                }
                businessExist.BusinessName = requestDto.BusinessName;
                businessExist.Address = requestDto.Address;
                if (!requestDto.IsBusiness)
                {
                    businessExist.Appoved = requestDto.Appoved;
                }
                businessExist.BusinessServiceType = requestDto.BusinessServiceType;
                businessExist.Longitude = requestDto.Longitude;
                businessExist.Latitude = requestDto.Latitude;
                businessExist.ProvinceId = requestDto.ProvinceId;
                businessExist.BusinessContactProperty.Email = requestDto.BusinessContactProperty.Email;
                businessExist.BusinessContactProperty.Name = requestDto.BusinessContactProperty.Name;
                businessExist.BusinessContactProperty.PhoneNumber = requestDto.BusinessContactProperty.PhoneNumber;
                if (businessExist.BusinessContactProperty.ImageProperty.BlobId != requestDto.BusinessContactProperty.FileId)
                {
                    var fileResponse = await _imagekitIOService.GetFileDetailsAsync(fileId: requestDto.FileId);
                    if (fileResponse.StatusCode == StatusCodes.Status200OK
                        && fileResponse.Result.Data is ImageFileInfo imageInfo)
                    {
                        var imageProperty = ConvertToImageProperty(imageFileInfo: imageInfo, imageType: CImageType.Thumbnail, isDefault: true);
                        businessExist.BusinessContactProperty.ImageProperty = imageProperty;
                    }
                }
                businessExist.BusinessContactPerson = businessExist.BusinessContactProperty.ToJson();
                businessExist.Service = requestDto.ServiceProperties.ToJson();
                _dbContext.Businesses.Update(entity: businessExist);
                await _dbContext.SaveChangesAsync();
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status202Accepted;
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Cập nhật thông tin thành công.",
                    NotificationType = CNotificationType.Business
                };
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