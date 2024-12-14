using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI.API
{
    public class MyService : IMyService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly UserManager<UserEntity> _userManager;
        private readonly IImageKitIOService _imageKitIOService;
        private readonly IBusinessService _businessService;
        private readonly ILogger<MyService> _logger;

        public MyService(HoTroDuLichAIDbContext dbContex,
            UserManager<UserEntity> userManager,
            ILogger<MyService> logger,
            IImageKitIOService imageKitIOService,
            IBusinessService businessService)
        {
            _dbContext = dbContex;
            _userManager = userManager;
            _imageKitIOService = imageKitIOService;
            _logger = logger;
            _businessService = businessService;
        }

        #region Get myprofile
        public async Task<ApiResponse<MyProfileDetailResponseDto>> GetMyProfileAsync()
        {
            var response = new ApiResponse<MyProfileDetailResponseDto>();
            var errors = new List<ErrorDetail>();
            try
            {
                var currentUser = RuntimeContext.CurrentUser;
                if (currentUser == null)
                {
                    return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                }
                response.Result.Data = ConvertUserEntityToMyProfileDetailDto(currentUser: currentUser);
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status200OK;
                return await Task.FromResult(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
        #endregion

        #region Get my base profile
        public async Task<ApiResponse<MyBaseProfileResponseDto>> GetMyBaseProfileAsync()
        {
            var response = new ApiResponse<MyBaseProfileResponseDto>();
            List<ErrorDetail> errors = new();
            var currentUser = RuntimeContext.CurrentUser;
            if (currentUser == null)
            {
                return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
            }
            try
            {
                response.Result.Success = true;
                var defaultAvatar = currentUser.ImageProperties
                    .Where(img => img.ImageType == CImageType.Avatar && img.IsDefault)
                    .Select(img => img.Url)
                    .FirstOrDefault();

                var avatar = defaultAvatar ?? currentUser.ImageProperties
                    .Where(img => img.ImageType == CImageType.Avatar)
                    .Select(img => img.Url)
                    .FirstOrDefault() ?? string.Empty;

                response.Result.Data = new MyBaseProfileResponseDto()
                {
                    UserId = currentUser.Id,
                    Email = currentUser.Email ?? string.Empty,
                    FullName = currentUser.FullName,
                    Picture = avatar
                };
                response.StatusCode = StatusCodes.Status200OK;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
        #endregion

        #region update my profile
        public async Task<ApiResponse<MyProfileDetailResponseDto>> UpdateMyProfileAsync(UpdateMyProfileRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            var response = new ApiResponse<MyProfileDetailResponseDto>();
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var currentUser = RuntimeContext.CurrentUser;
            try
            {
                if (!errors.IsNullOrEmpty())
                {
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status400BadRequest;
                    return response;
                }
                if (currentUser == null)
                {
                    return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                }
                bool hasAdminRole = (await _userManager.GetRolesAsync(user: currentUser)).Contains(CRoleType.Admin.ToString());
                if (currentUser.Id != requestDto.UserId && !hasAdminRole)
                {
                    response.Result.Success = false;
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Bạn không có quyền thay đổi thông tin của người dùng khác.",
                        ErrorScope = CErrorScope.PageSumarry
                    });
                    response.StatusCode = StatusCodes.Status403Forbidden;
                    response.Result.Errors.AddRange(errors);
                    return response;
                }
                if (currentUser.Email != requestDto.Email)
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Không thể thay đổi Email",
                        ErrorScope = CErrorScope.Field,
                        Field = $"{nameof(requestDto.Email)}_Error"
                    });
                }
                // if (await _dbContext.Users.FirstOrDefaultAsync(us => us.Id != currentUser.Id
                //     && us.PIN == requestDto.PIN) != null)
                // {
                //     errors.Add(new ErrorDetail()
                //     {
                //         Error = $"PIN đã được sử dụng.",
                //         ErrorScope = CErrorScope.Field,
                //         Field = $"{nameof(requestDto.PIN)}_Error"
                //     });
                // }
                if (!errors.IsNullOrEmpty())
                {
                    response.Result.Errors.AddRange(errors);
                    response.StatusCode = StatusCodes.Status406NotAcceptable;
                    response.Result.Success = false;
                    return response;
                }
                // map dto
                var userUpdated = await _userManager.FindByIdAsync(userId: requestDto.UserId.ToString());
                if (userUpdated == null)
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Không tìm thấy người dùng hợp lệ.",
                        ErrorScope = CErrorScope.PageSumarry
                    });
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status404NotFound;
                    response.Result.Errors.AddRange(errors);
                    return response;
                }
                userUpdated.FullName = requestDto.FullName;
                userUpdated.PhoneNumber = requestDto.PhoneNumber;
                // userUpdated.PIN = requestDto.PIN;
                userUpdated.DateOfBirth = requestDto.DateOfBirth;
                userUpdated.ModifiedBy = currentUser.Id.ToString();
                userUpdated.ModifiedDate = DateTimeOffset.UtcNow;
                userUpdated.Address = requestDto.Address;
                await _userManager.UpdateAsync(user: userUpdated);
                response.StatusCode = StatusCodes.Status202Accepted;
                response.Result.Success = true;
                response.Result.Data = ConvertUserEntityToMyProfileDetailDto(currentUser: userUpdated);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync<MyProfileDetailResponseDto>(errors: errors, response: response, ex: ex);
            }
        }
        #endregion update my profile

        #region my business
        public async Task<ApiResponse<BusinessMoreInfoResponseDto>> GetMyBusinessAsync()
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<BusinessMoreInfoResponseDto>();
            try
            {
                var currentUser = RuntimeContext.CurrentUser;
                if (currentUser == null)
                {
                    return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                }
                var businessEntity = await _dbContext.Businesses.Where(b => b.UserId == currentUser.Id).FirstOrDefaultAsync();
                if (businessEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                var result = await _businessService.GetBusinessDetailByIdAsync(businessId: businessEntity.Id);
                return result;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
        #endregion my business

        #region  update my image
        public async Task<ApiResponse<MyProfileDetailResponseDto>> UpdateMyImagesAsync(UpdateMyImageRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            var response = new ApiResponse<MyProfileDetailResponseDto>();
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var currentUser = RuntimeContext.CurrentUser;
            if (!errors.IsNullOrEmpty())
            {
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                response.StatusCode = StatusCodes.Status400BadRequest;
                return response;
            }
            if (currentUser == null)
            {
                return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
            }
            if (requestDto.UploadProvider == CBlobType.ImageKit)
            {
                var imageExistResponse = await _imageKitIOService.GetFileDetailsAsync(fileId: requestDto.FileId);
                var imageProperties = new List<ImageProperty>();
                if (imageExistResponse.StatusCode == StatusCodes.Status200OK)
                {
                    if (imageExistResponse.Result.Data is ImageFileInfo imageFileInfo)
                    {
                        var dataImage = ConvertToImageProperty(imageFileInfo: imageFileInfo,
                            dto: requestDto, isDefault: true);
                        dataImage.IsDefault = true;
                        if (currentUser.ImageProperties.IsNullOrEmpty())
                        {
                            imageProperties.Add(dataImage);
                        }
                        else
                        {
                            if (currentUser.ImageProperties.Where(s => s.BlobId == dataImage.BlobId).FirstOrDefault() == null)
                            {
                                imageProperties.AddRange(currentUser.ImageProperties);
                                imageProperties.ForEach(img =>
                                {
                                    if (img.ImageType == CImageType.Avatar)
                                    {
                                        img.IsDefault = false;
                                    }
                                });
                                imageProperties.Add(dataImage);
                            }
                        }
                        try
                        {
                            if (currentUser.ImageProperties.Where(s => s.BlobId == dataImage.BlobId).FirstOrDefault() == null)
                            {
                                currentUser.ImageProperty = imageProperties.ToJson();
                                await _userManager.UpdateAsync(user: currentUser);
                            }
                            response.StatusCode = StatusCodes.Status202Accepted;
                            response.Result.Success = true;
                            response.Result.Data = ConvertUserEntityToMyProfileDetailDto(currentUser: currentUser);
                            return response;
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex.Message);
                            return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
                        }
                    }
                    else
                    {
                        errors.Add(new ErrorDetail()
                        {
                            Error = $"Đã xảy ra lỗi trong quá trình lấy thông tin file.",
                            ErrorScope = CErrorScope.PageSumarry
                        });
                        response.Result.Success = false;
                        response.Result.Errors.AddRange(errors);
                        return response;
                    }
                }
                else
                {
                    response.StatusCode = imageExistResponse.StatusCode;
                    response.Result.Success = imageExistResponse.Result.Success;
                    response.Result.Errors.AddRange(imageExistResponse.Result.Errors);
                    return response;
                }
            }
            else
            {
                errors.Add(new ErrorDetail()
                {
                    Error = "Hiện tại hệ thống chưa hổ trợ dịch vụ upload file này.",
                    ErrorScope = CErrorScope.PageSumarry,
                });
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                response.StatusCode = StatusCodes.Status406NotAcceptable;
                return response;
            }
        }
        #endregion

        private ImageProperty ConvertToImageProperty(ImageFileInfo imageFileInfo,
            UpdateMyImageRequestDto dto, bool isDefault = false)
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
                BlobType = dto.UploadProvider,
                ImageType = dto.ImageType,
                FileExtensionType = CFileExtensionType.JPEG
            };
        }

        private MyProfileDetailResponseDto ConvertUserEntityToMyProfileDetailDto(UserEntity currentUser)
        {
            return new MyProfileDetailResponseDto()
            {
                UserId = currentUser.Id,
                FullName = currentUser.FullName,
                Email = currentUser.Email ?? string.Empty,
                // PIN = currentUser.PIN,
                // AddressProperties = currentUser.AddressProperties,
                Address = currentUser.Address,
                PhoneNumber = currentUser.PhoneNumber ?? string.Empty,
                DateOfBirth = currentUser.DateOfBirth,
                ImageProperties = currentUser.ImageProperties.Select(img => new ImageBaseInfo()
                {
                    FileId = img.BlobId,
                    FileUrl = img.Url,
                    ProviderType = img.BlobType,
                    Type = img.ImageType,
                    IsDefault = img.IsDefault
                }).ToList(),
                CreatedDate = currentUser.CreatedDate,
                ModifiedDate = currentUser.ModifiedDate
            };
        }
    }
}