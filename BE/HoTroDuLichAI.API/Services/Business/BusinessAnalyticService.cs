using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI.API
{
    public class BusinessAnalyticService : IBusinessAnalyicService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly UserManager<UserEntity> _userManager;
        private readonly IImageKitIOService _imagekitIOService;
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly ILogger<BusinessAnalyticService> _logger;

        public BusinessAnalyticService(
            HoTroDuLichAIDbContext dbContext,
            IHubContext<NotificationHub> notificationHubContext,
            IImageKitIOService imagekitIOService,
            ILogger<BusinessAnalyticService> logger,
            UserManager<UserEntity> userManager)
        {
            _dbContext = dbContext;
            _imagekitIOService = imagekitIOService;
            _notificationHubContext = notificationHubContext;
            _logger = logger;
            _userManager = userManager;
        }

        #region Create Business Analytic
        public async Task<ApiResponse<BusinessAnylyticResponseDto>> CreateBusinessAnalyticAsync(CreateBusinessAnalyticRequestDto requestDto, ModelStateDictionary? modelState = null)
        {
            if (requestDto == null)
            {
                return new ApiResponse<BusinessAnylyticResponseDto>()
                {
                    Result = new ResponseResult<BusinessAnylyticResponseDto>()
                    {
                        Errors = new List<ErrorDetail>() { new ErrorDetail() { Error = $"Dữ liệu gửi về không hợp lệ. Vui lòng kiểm tra lại.", ErrorScope = CErrorScope.FormSummary } },
                        Success = false
                    },
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<BusinessAnylyticResponseDto>();
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
                var businessExist = await _dbContext.BusinessAnalytics.Where(b => b.BusinessId == requestDto.BusinessId).FirstOrDefaultAsync();
                bool hasAdminRole = (await _userManager.GetRolesAsync(user: currentUser)).Contains(CRoleType.Admin.ToString());


                var businessAnalyticEntity = new BusinessAnalyticEntity()
                {
                    BusinessId = requestDto.BusinessId,
                    TotalView = requestDto.TotalView,
                    TotalContact = requestDto.TotalContact,
                    LastViewedDate = requestDto.LastViewedDate,
                };
                _dbContext.BusinessAnalytics.Add(entity: businessAnalyticEntity);
                var adminUsers = await _userManager.GetUsersInRoleAsync(roleName: CRoleType.Admin.ToString());
                if (!hasAdminRole && !adminUsers.IsNullOrEmpty())
                {
                    _logger.LogWarning($"Người dùng không có quyền thực hiện thao tác này.");
                    return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                }
                await _dbContext.SaveChangesAsync();
                var data = businessAnalyticEntity.Adapt<BusinessAnylyticResponseDto>();
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

        #endregion Create business Analytic

        #region Update business Analytic
        public async Task<ApiResponse<ResultMessage>> UpdateBusinessAnalysicAsync (UpdateBusinessAnalyticRequestDto requestDto, ModelStateDictionary? modelState = null)
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
                var businessAnalyticEntity = await _dbContext.BusinessAnalytics.FindAsync(requestDto.Id);
                if (businessAnalyticEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }

                businessAnalyticEntity.TotalView = requestDto.TotalView;
                businessAnalyticEntity.TotalContact = requestDto.TotalContact;
                _dbContext.BusinessAnalytics.Update(businessAnalyticEntity);
                await _dbContext.SaveChangesAsync();
                response.Result.Success = true;
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Cập nhật chi tiết doanh nghiệp thành công.",
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
        #endregion Update business Analytic

        #region Delete business Analytic
        public async Task<ApiResponse<ResultMessage>> DeleteBusinessAnalysicAsync(Guid analyticId)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ResultMessage>();
            try
            {
                var businessAnalyticEntity = await _dbContext.BusinessAnalytics.FindAsync(analyticId);
                if (businessAnalyticEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                _dbContext.BusinessAnalytics.Remove(entity: businessAnalyticEntity);
                await _dbContext.SaveChangesAsync();
                response.Result.Success = true;
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Xóa chi tiết doanh nghiệp thành công.",
                    NotificationType = CNotificationType.Business,
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
        #endregion Delete business Analytic

        #region Get business By Id Analytic
        public async Task<ApiResponse<BusinessAnylyticResponseDto>> GetBusinessAnalysicDetailByIdAsync(Guid businessId)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<BusinessAnylyticResponseDto>();
            try
            {

                var businessAnalyticEntity = await _dbContext.BusinessAnalytics.Where(b => b.BusinessId == businessId)
                                                                        .Select(b => new
                                                                        {
                                                                            Id = b.Id,
                                                                            TotalView = b.TotalView,
                                                                            TotalContact = b.TotalContact,
                                                                            LastViewedDate = b.LastViewedDate,
                                                                            BusinessId = b.BusinessId,
                                                                        }).FirstOrDefaultAsync();


                var data = (businessAnalyticEntity != null) ? businessAnalyticEntity.Adapt<BusinessAnylyticResponseDto>() : new BusinessAnylyticResponseDto()
                {
                    TotalContact = 0,
                    TotalView = 0,
                    LastViewedDate = DateTimeOffset.UtcNow,
                    BusinessId = businessId,
                };
                response.Result.Success = true;
                response.Result.Data = data;
                response.StatusCode = StatusCodes.Status200OK;
                _ = await UpdateBusinessAnalysicAsync(new UpdateBusinessAnalyticRequestDto()
                {
                    TotalContact = businessAnalyticEntity?.TotalContact ?? 0,
                    TotalView = businessAnalyticEntity?.TotalView + 1 ?? 1,
                    LastViewedDate = DateTimeOffset.UtcNow,
                    BusinessId = businessAnalyticEntity?.BusinessId ?? Guid.Empty,
                });
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
        #endregion Get business By Id Analytic
    }
}