using Google.Apis.Auth;
using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace HoTroDuLichAI.API
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<UserEntity> _userManager;
        private readonly RoleManager<RoleEntity> _roleManager;
        private readonly IEmailService _emailService;
        private readonly IJwtService _jwtService;
        private readonly ILogger<AuthService> _logger;
        private readonly HoTroDuLichAIDbContext _dbContext;

        public AuthService(
            HoTroDuLichAIDbContext dbContext,
            UserManager<UserEntity> userManager,
            RoleManager<RoleEntity> roleManager,
            IEmailService emailService,
            IJwtService jwtService,
            ILogger<AuthService> logger)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _roleManager = roleManager;
            _emailService = emailService;
            _jwtService = jwtService;
            _logger = logger;
        }

        #region Login
        public async Task<ApiResponse<LoginResponseDto>> SystemLoginAsync(LoginRequestDto loginDto, ModelStateDictionary? modelState = null)
        {
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<LoginResponseDto>();
            if (errors.IsNullOrEmpty())
            {
                var userExist = await _dbContext.Users.FirstOrDefaultAsync(us => us.Email == loginDto.Email || us.UserName == loginDto.Email);
                if (userExist == null)
                {
                    errors.Add(new ErrorDetail() { Error = $"UserName hoặc Email '{loginDto.Email}' không tồn tại.", Field = $"{nameof(LoginRequestDto.Email)}_Error", ErrorScope = CErrorScope.Field });
                    response.StatusCode = StatusCodes.Status404NotFound;
                    response.Result.Success = false;
                    response.Result.Errors = errors;
                    return response;
                }
                if (!await _userManager.CheckPasswordAsync(user: userExist, password: loginDto.Password))
                {

                    errors.Add(new ErrorDetail() { Error = $"Mật khẩu không đúng.", Field = $"{nameof(LoginRequestDto.Password)}_Error", ErrorScope = CErrorScope.Field });
                    response.StatusCode = StatusCodes.Status404NotFound;
                    response.Result.Success = false;
                    response.Result.Errors = errors;
                    return response;
                }
                if (!userExist.EmailConfirmed)
                {
                    var userToken = await _dbContext.UserTokens.Where(ut => ut.UserId == userExist.Id
                        && ut.Type == CTokenType.EmailConfirmation).OrderByDescending(ut => ut.TokenExpiration).FirstOrDefaultAsync();
                    if (userToken == null || (userToken != null && (userToken.TokenExpiration < DateTimeOffset.UtcNow || userToken.IsTokenInvoked)))
                    {
                        // send email
                        try
                        {
                            var appEndpoint = RuntimeContext.LinkHelper?.AppEndpoint;
                            if (string.IsNullOrEmpty(appEndpoint))
                            {
                                errors.Add(new ErrorDetail() { Error = $"Không tìm thấy Server Endpoint để gửi Email. Bạn có thể thêm Server Endpoint ở phần API LinkHelper", ErrorScope = CErrorScope.PageSumarry });
                                response.StatusCode = StatusCodes.Status404NotFound;
                                response.Result.Success = false;
                                response.Result.Errors = errors;
                                return response;
                            }
                            await SendEmailConfirmRegistrationAsync(userExist: userExist);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex.Message);
                            errors.Add(new ErrorDetail()
                            {
                                Error = "Đã xảy ra lỗi khi gửi email đến tài khoản xác nhận.",
                                ErrorScope = CErrorScope.PageSumarry
                            });
                            response.StatusCode = StatusCodes.Status500InternalServerError;
                            response.Result.Errors = errors;
                            response.Result.Success = false;
                            return response;
                        }
                    }
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Người dùng '{loginDto.Email}' vẫn chưa xác nhận email. Vui lòng kiểm tra email của bạn để xác nhận tài khoản của bạn.",
                        ErrorScope = CErrorScope.FormSummary
                    });
                    response.StatusCode = StatusCodes.Status403Forbidden;
                    response.Result.Errors = errors;
                    return response;
                }
                if (userExist.LockoutEnabled && userExist.LockoutEnd.HasValue
                    && userExist.LockoutEnd.Value <= DateTimeOffset.UtcNow)
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Người dùng '{loginDto.Email}' hiện đang bị khóa. Vui lòng thử lại sau {userExist.LockoutEnd.Value.LocalDateTime.ToString("yyyy-MM-dd HH:mm:ss")}",
                        ErrorScope = CErrorScope.FormSummary
                    });
                }
                if (userExist.TwoFactorEnabled)
                {
                    // send request to verify two factor.
                    try
                    {
                        var token = await _userManager.GenerateTwoFactorTokenAsync(user: userExist, tokenProvider: CTokenProviderType.Email.ToString());
                        var clientInfo = RuntimeContext.AppSettings.ClientApp;
                        var emailReplaceProperty = new TwoFactorAuthenticationEmailTemplateModel()
                        {
                            Address = clientInfo.Address,
                            CompanyName = clientInfo.CompanyName,
                            OwnerName = clientInfo.OwnerName,
                            Email = clientInfo.Email,
                            ReceiverEmail = userExist.Email ?? string.Empty,
                            OwnerPhone = clientInfo.OwnerPhone,
                            Token = token,
                            CustomerName = userExist.FullName ?? string.Empty
                        };
                        await _emailService.SendEmailAsync(email: userExist.Email ?? string.Empty, subject: "2FA Authentication Code",
                            htmlTemplate: string.Empty,
                            fileTemplateName: "TwoFactorAuthenticationCode.html",
                            replaceProperty: emailReplaceProperty,
                            emailProviderType: CEmailProviderType.Gmail);

                        var userTokenEntity = new UserTokenEntity()
                        {
                            Name = CTokenType.TwoFactor.ToDescription(),
                            Token = token,
                            IsTokenInvoked = false,
                            TokenExpiration = DateTimeOffset.UtcNow.AddMinutes(5),
                            Type = CTokenType.TwoFactor,
                            UserId = userExist.Id,
                            TokenProviderName = CTokenProviderType.Email.ToString(),
                            TokenProviderType = CTokenProviderType.Email
                        };
                        await _dbContext.UserTokens.AddAsync(entity: userTokenEntity);
                        await _dbContext.SaveChangesAsync();
                        response.StatusCode = StatusCodes.Status203NonAuthoritative;
                        response.Result.Data = new LoginResponseDto()
                        {
                            TwoFactorEnabled = true,
                            Message = $"Yêu cầu xác thực hai yếu tố. Vui lòng nhập mã đã được gửi đến email '{userExist.Email}'. Mã sẽ hết hạn sau 5 phút."
                        };
                        response.Result.Success = true;
                        return response;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"{ex.Message}");
                        errors.Add(new ErrorDetail()
                        {
                            Error = $"Đã xảy ra lỗi khi tạo mã thông báo để xác thực hai yếu tố và gửi email.",
                            ErrorScope = CErrorScope.FormSummary,
                        });
                        response.StatusCode = StatusCodes.Status503ServiceUnavailable;
                        response.Result.Success = false;
                        response.Result.Errors = errors;
                        return response;
                    }
                }
                // need generate accesstoken and refreshtoken here
                var jwtTokenModel = await _jwtService.GenerateJwtTokenAsync(userEntity: userExist,
                    ipAddress: RuntimeContext.CurrentIpAddress ?? string.Empty);
                response.StatusCode = StatusCodes.Status200OK;
                response.Result.Data = new LoginResponseDto()
                {
                    AccessToken = jwtTokenModel.AccessToken,
                    RefreshToken = jwtTokenModel.RefreshToken,
                    TwoFactorEnabled = false,
                    Message = "Đăng nhập thành công!"
                };
                response.Result.Success = true;
                return response;
            }
            response.StatusCode = StatusCodes.Status400BadRequest;
            response.Result.Success = false;
            response.Result.Errors = errors;
            return response;
        }
        #endregion Login


        #region Login with google
        public async Task<ApiResponse<LoginResponseDto>> LoginWithGoogleAsync(
            LoginWithGoogleRequestDto requestDto, ModelStateDictionary? modelState = null)
        {
            var response = new ApiResponse<LoginResponseDto>();
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            try
            {
                var userInfoFromAccessTokenGoogle = await GetUserInfoFromGoogleTokenAsync(
                    googleToken: requestDto.IdToken);
                // If email is not exists on system
                var userExist = await _userManager.FindByEmailAsync(userInfoFromAccessTokenGoogle.Email);
                if (userExist == null)
                {
                    var imageProperties = new List<ImageProperty>();
                    imageProperties.Add(new ImageProperty()
                    {
                        BlobType = CBlobType.Google,
                        FileExtensionType = CFileExtensionType.JPEG,
                        IsDefault = true,
                        ImageType = CImageType.Avatar,
                        Url = userInfoFromAccessTokenGoogle.Picture,
                    });
                    userExist = new UserEntity()
                    {
                        Email = userInfoFromAccessTokenGoogle.Email,
                        FullName = userInfoFromAccessTokenGoogle.Name,
                        ImageProperty = imageProperties.ToJson(),
                        UserName = userInfoFromAccessTokenGoogle.Email,
                        EmailConfirmed = true
                    };
                    // If create user success
                    using var transaction = await _dbContext.Database.BeginTransactionAsync();
                    var createUserResult = await _userManager.CreateAsync(user: userExist);
                    if (createUserResult.Succeeded)
                    {
                        // assign role
                        var addRoleResult = await _userManager.AddToRoleAsync(user: userExist, role: CRoleType.NormalUser.ToString());
                        if (!addRoleResult.Succeeded)
                        {
                            await transaction.RollbackAsync();
                            errors.Add(new ErrorDetail()
                            {
                                Error = addRoleResult.Errors.Select(err => err.Description).ToList().ToMultilineString(),
                                ErrorScope = CErrorScope.PageSumarry,
                            });
                            response.StatusCode = StatusCodes.Status503ServiceUnavailable;
                            response.Result.Success = false;
                            response.Result.Errors = errors;
                            return response;
                        }
                        // Generate token
                        var jwtTokenModelNew = await _jwtService.GenerateJwtTokenAsync(userEntity: userExist,
                            ipAddress: RuntimeContext.CurrentIpAddress ?? string.Empty);
                        response.StatusCode = StatusCodes.Status200OK;
                        response.Result.Data = new LoginResponseDto()
                        {
                            AccessToken = jwtTokenModelNew.AccessToken,
                            RefreshToken = jwtTokenModelNew.RefreshToken,
                            TwoFactorEnabled = false,
                            Message = "Đăng nhập thành công!"
                        };
                        response.Result.Success = true;
                        await transaction.CommitAsync();
                        return response;
                    }
                    else
                    {
                        _logger.LogError("An internal server error occurred while creating the user");
                        await transaction.RollbackAsync();
                        errors.Add(new ErrorDetail()
                        {
                            Error = createUserResult.Errors.Select(err => err.Description).ToList().ToMultilineString(),
                            ErrorScope = CErrorScope.PageSumarry,
                        });
                        response.StatusCode = StatusCodes.Status503ServiceUnavailable;
                        response.Result.Success = false;
                        response.Result.Errors = errors;
                        return response;
                    }

                }
                if (userExist.ImageProperties.IsNullOrEmpty())
                {
                    var imageProperties = new List<ImageProperty>();
                    imageProperties.Add(new ImageProperty()
                    {
                        BlobType = CBlobType.Google,
                        FileExtensionType = CFileExtensionType.JPEG,
                        IsDefault = true,
                        ImageType = CImageType.Avatar,
                        Url = userInfoFromAccessTokenGoogle.Picture,
                    });
                    userExist.ImageProperty = imageProperties.ToJson();
                    await _userManager.UpdateAsync(user: userExist);
                }
                var jwtTokenModel = await _jwtService.GenerateJwtTokenAsync(userEntity: userExist,
                    ipAddress: RuntimeContext.CurrentIpAddress ?? string.Empty);
                response.StatusCode = StatusCodes.Status200OK;
                response.Result.Data = new LoginResponseDto()
                {
                    AccessToken = jwtTokenModel.AccessToken,
                    RefreshToken = jwtTokenModel.RefreshToken,
                    TwoFactorEnabled = false,
                    Message = "Đăng nhập thành công!"
                };
                response.Result.Success = true;
                return response;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }

        public async Task<UserInfoFromIdTokenGoogle> GetUserInfoFromGoogleTokenAsync(string googleToken)
        {
            var googleSetting = RuntimeContext.AppSettings.GoogleSetting ?? new();
            if (string.IsNullOrEmpty(googleSetting.ClientSecret) || string.IsNullOrEmpty(googleSetting.WebClientId)
                || string.IsNullOrEmpty(googleSetting.TokenInfoUrl) || string.IsNullOrEmpty(googleSetting.UserInfoUrl))
            {
                throw new Exception($"Không tìm thấy thông tin xác thực của Google.");
            }
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { googleSetting.WebClientId },
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(googleToken, settings);
                return payload.Adapt<UserInfoFromIdTokenGoogle>();
            }
            catch (Exception ex)
            {
                // Try to get user info from access token if ID token fails
                try
                {
                    HttpClient client = new HttpClient();
                    HttpResponseMessage response = await client.GetAsync($"{googleSetting.TokenInfoUrl}{googleToken}");

                    if (response.IsSuccessStatusCode)
                    {
                        var content = await response.Content.ReadAsStringAsync();
                        var tokenInfo = content.FromJson<TokenInfoRequestDto>() ?? new();

                        if (tokenInfo.Audience == googleSetting.WebClientId)
                        {
                            HttpResponseMessage userInfoResponse = await client.GetAsync($"{googleSetting.UserInfoUrl}{googleToken}");

                            if (userInfoResponse.IsSuccessStatusCode)
                            {
                                var userInfoContent = await userInfoResponse.Content.ReadAsStringAsync();
                                var userInfo = userInfoContent.FromJson<GoogleUserInfoRequestDto>();
                                var user = new UserInfoFromIdTokenGoogle()
                                {
                                    Email = userInfo?.Email ?? string.Empty,
                                    Name = userInfo?.Name ?? string.Empty,
                                    Picture = userInfo?.Picture ?? string.Empty
                                };
                                return user;
                            }
                        }
                    }

                    _logger.LogError($"Internal Server Error : Failed to verify Google Access token.\nTrace Log : {ex.Message}");
                    throw new Exception("Failed to verify Google Access token", ex);
                }
                // If idtoken and accesstoken was failed
                catch (Exception ex1)
                {
                    _logger.LogError($"Internal Server Error : Failed to get user info from Google Access token.\nTrace Log : {ex.Message}");
                    throw new Exception("Failed to get user info from Google Access token", ex1);
                }
            }
        }
        #endregion Login with google

        #region refresh token
        public async Task<ApiResponse<LoginResponseDto>> RefreshTokenAsync(RefreshTokenRequestDto refreshTokenDto,
            ModelStateDictionary? modelState = null)
        {
            var response = new ApiResponse<LoginResponseDto>();
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            if (!errors.IsNullOrEmpty())
            {
                response.StatusCode = StatusCodes.Status400BadRequest;
                response.Result.Success = false;
                response.Result.Errors = errors;
                return response;
            }
            var userRefreshTokenExist = await _dbContext.UserRefreshTokens.Where(usr =>
                    usr.RefreshToken == refreshTokenDto.RefreshToken
                    && usr.AccessToken == refreshTokenDto.AccessToken)
                .FirstOrDefaultAsync();
            if (userRefreshTokenExist == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Refresh token không hợp lệ hoặc đã hết hạn",
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.StatusCode = StatusCodes.Status401Unauthorized;
                response.Result.Success = false;
                response.Result.Errors = errors;
                return response;
            }
            if (userRefreshTokenExist.IsRevoked || !userRefreshTokenExist.Active)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Refresh token '{refreshTokenDto.RefreshToken}' đã hết hạn hoặc bị thu hồi",
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.StatusCode = StatusCodes.Status419AuthenticationTimeout;
                response.Result.Success = false;
                response.Result.Errors = errors;
                return response;
            }
            var currentUser = await _userManager.FindByIdAsync(userId: userRefreshTokenExist.UserId.ToString());
            if (currentUser == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Bạn không có quyền yêu cầu làm mới mã thông báo.",
                    ErrorScope = CErrorScope.Global
                });
                response.StatusCode = StatusCodes.Status401Unauthorized;
                response.Result.Success = false;
                response.Result.Errors = errors;
                return response;
            }
            // generate new accesstoken
            try
            {
                var accessToken = await _jwtService.GenerateJwtAccessTokenAsync(userEntity: currentUser);
                userRefreshTokenExist.AccessToken = accessToken;
                _dbContext.UserRefreshTokens.Update(entity: userRefreshTokenExist);
                await _dbContext.SaveChangesAsync();
                response.StatusCode = StatusCodes.Status200OK;
                response.Result.Success = true;
                response.Result.Data = new LoginResponseDto()
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshTokenDto.RefreshToken,
                    Message = $"Làm mới mã truy cập mới thành công.",
                    TwoFactorEnabled = false
                };
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex.Message}");
                errors.Add(new ErrorDetail()
                {
                    Error = $"Đã xảy ra lỗi khi tạo mã truy cập cho người dùng : '{currentUser.Email}'",
                    ErrorScope = CErrorScope.Global
                });
                response.Result.Success = false;
                response.StatusCode = StatusCodes.Status500InternalServerError;
                response.Result.Errors = errors;
                return response;
            }
        }
        #endregion refresh token

        #region Confirm two factor authentication
        public async Task<ApiResponse<LoginResponseDto>> ConfirmTwoFactorAuthenticationAsync(
            ConfirmTwoFactorAuthenticationRequestDto twoFactorDto, ModelStateDictionary? modelState = null)
        {
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<LoginResponseDto>();
            if (errors.IsNullOrEmpty())
            {
                var userExist = await _userManager.FindByEmailAsync(email: twoFactorDto.Email);
                if (userExist == null)
                {
                    response.StatusCode = StatusCodes.Status404NotFound;
                    response.Result.Success = false;
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Không thể tìm thấy bất kỳ người dùng nào có email '{twoFactorDto.Email}'",
                        ErrorScope = CErrorScope.PageSumarry
                    });
                    response.Result.Errors = errors;
                    return response;
                }
                var userTokenEntity = await _dbContext.UserTokens.Where(utc => utc.Token == twoFactorDto.Code
                    && utc.UserId == userExist.Id).FirstOrDefaultAsync();
                if (userTokenEntity == null)
                {
                    errors.Add(new ErrorDetail() { Error = "Token không hợp lệ.", ErrorScope = CErrorScope.PageSumarry });
                    response.StatusCode = StatusCodes.Status400BadRequest;
                    response.Result.Success = false;
                    response.Result.Errors = errors;
                    return response;
                }
                else if (userTokenEntity.IsTokenInvoked || userTokenEntity.TokenExpiration < DateTimeOffset.UtcNow)
                {
                    string errorMessage = string.Empty;
                    if (userTokenEntity.IsTokenInvoked)
                    {
                        errorMessage = "Token đã bị thu hồi.";
                    }
                    else
                    {
                        errorMessage = "Token đã hết hạn.";
                    }
                    errors.Add(new ErrorDetail() { Error = errorMessage, ErrorScope = CErrorScope.PageSumarry });
                    response.Result.Success = false;
                    response.Result.Errors = errors;
                    response.StatusCode = StatusCodes.Status406NotAcceptable;
                    return response;
                }
                var confirmTwofactorResult = await _userManager.VerifyTwoFactorTokenAsync(
                    user: userExist,
                    tokenProvider: userTokenEntity.TokenProviderName,
                    token: twoFactorDto.Code);
                if (confirmTwofactorResult)
                {
                    userTokenEntity.IsTokenInvoked = true;
                    _dbContext.UserTokens.Update(entity: userTokenEntity);
                    await _dbContext.SaveChangesAsync();
                    // need generate accesstoken and refresh token here
                    var jwtTokenModel = await _jwtService.GenerateJwtTokenAsync(userEntity: userExist, ipAddress: RuntimeContext.CurrentIpAddress ?? string.Empty);
                    response.StatusCode = StatusCodes.Status200OK;
                    response.Result.Data = new LoginResponseDto()
                    {
                        AccessToken = jwtTokenModel.AccessToken,
                        RefreshToken = jwtTokenModel.RefreshToken,
                        TwoFactorEnabled = false,
                        Message = "Đăng nhập thành công."
                    };
                    response.Result.Success = true;
                    return response;
                }
                else
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = "Token không hợp lệ",
                        ErrorScope = CErrorScope.FormSummary
                    });
                    response.StatusCode = StatusCodes.Status401Unauthorized;
                    response.Result.Success = false;
                    response.Result.Errors = errors;
                    return response;
                }

            }
            response.StatusCode = StatusCodes.Status400BadRequest;
            response.Result.Errors = errors;
            response.Result.Success = false;
            return response;
        }
        #endregion confirm two factor authentication

        #region register
        public async Task<ApiResponse<ResultMessage>> RegisterAsync(RegisterRequestDto registerDto,
            ModelStateDictionary? modelState = null)
        {
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<ResultMessage>();
            if (!errors.IsNullOrEmpty())
            {
                response.StatusCode = StatusCodes.Status400BadRequest;
                response.Result.Success = false;
                response.Result.Errors = errors;
                return response;
            }
            var userExist = await _userManager.FindByEmailAsync(email: registerDto.Email);
            if (userExist != null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Email '{registerDto.Email}' đã được sử dụng",
                    ErrorScope = CErrorScope.Field,
                    Field = $"{nameof(RegisterRequestDto.Email)}_Error"
                });
                response.StatusCode = StatusCodes.Status409Conflict;
                response.Result.Success = false;
                response.Result.Errors = errors;
                return response;
            }
            var roleExist = await _roleManager.FindByNameAsync(roleName: CRoleType.NormalUser.ToString());
            if (roleExist == null)
            {
                // create role :
                await _roleManager.CreateAsync(role: new RoleEntity()
                {
                    Name = CRoleType.NormalUser.ToString()
                });
            }
            // create user
            userExist = new UserEntity()
            {
                Email = registerDto.Email,
                UserName = registerDto.Email,
                FullName = registerDto.FullName
            };
            using (var dbTransaction = await _dbContext.Database.BeginTransactionAsync())
            {
                var createUserResult = await _userManager.CreateAsync(user: userExist, password: registerDto.Password);
                if (!createUserResult.Succeeded)
                {
                    await dbTransaction.RollbackAsync();
                    errors.Add(new ErrorDetail()
                    {
                        Error = string.Join(Environment.NewLine, createUserResult.Errors.Select(err => err.Description).ToList()),
                        ErrorScope = CErrorScope.FormSummary,
                    });
                    response.StatusCode = StatusCodes.Status503ServiceUnavailable;
                    response.Result.Success = false;
                    response.Result.Errors = errors;
                    return response;
                }
                // assign role
                var addRoleResult = await _userManager.AddToRoleAsync(user: userExist, role: CRoleType.NormalUser.ToString());
                if (!addRoleResult.Succeeded)
                {
                    await dbTransaction.RollbackAsync();
                    errors.Add(new ErrorDetail()
                    {
                        Error = string.Join(Environment.NewLine, addRoleResult.Errors.Select(err => err.Description).ToList()),
                        ErrorScope = CErrorScope.FormSummary,
                    });
                    response.StatusCode = StatusCodes.Status503ServiceUnavailable;
                    response.Result.Success = false;
                    response.Result.Errors = errors;
                    return response;
                }
                // send email to user:
                try
                {
                    var appEndpoint = RuntimeContext.LinkHelper?.AppEndpoint;
                    if (string.IsNullOrEmpty(appEndpoint))
                    {
                        errors.Add(new ErrorDetail() { Error = $"Không tìm thấy Server Endpoint để gửi Email. Bạn có thể thêm Server Endpoint ở phần API LinkHelper", ErrorScope = CErrorScope.PageSumarry });
                        response.StatusCode = StatusCodes.Status404NotFound;
                        response.Result.Success = false;
                        response.Result.Errors = errors;
                        return response;
                    }
                    await SendEmailConfirmRegistrationAsync(userExist: userExist);
                    await dbTransaction.CommitAsync();
                    response.StatusCode = StatusCodes.Status202Accepted;
                    response.Result.Success = true;
                    response.Result.Data = new ResultMessage()
                    {
                        Level = CNotificationLevel.Info,
                        Message = $"Đăng ký tài khoản của bạn đã hoàn tất! Vui lòng kiểm tra email của bạn '{userExist.Email}' để xác nhận đăng ký.",
                        NotificationType = CNotificationType.Email
                    };
                    return response;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.Message);
                    errors.Add(new ErrorDetail()
                    {
                        Error = "Đã xảy ra lỗi khi gửi email đến đăng ký xác nhận.",
                        ErrorScope = CErrorScope.PageSumarry
                    });
                    await dbTransaction.RollbackAsync();
                    response.StatusCode = StatusCodes.Status500InternalServerError;
                    response.Result.Errors = errors;
                    response.Result.Success = false;
                    return response;
                }
            }
        }


        public async Task<ResultMessage> ConfirmRegisterAsync(ConfirmEmailDto confirmEmailDto, ModelStateDictionary? modelState)
        {
            var response = new ResultMessage();
            response.NotificationType = CNotificationType.Register;

            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            if (errors.Any())
            {
                response.Level = CNotificationLevel.Error;
                response.Message = errors.Select(e => e.Error).ToList().ToMultilineString();
                return response;
            }

            var userExist = await _userManager.FindByIdAsync(confirmEmailDto.UserId);
            if (userExist == null)
            {
                response.Level = CNotificationLevel.Error;
                response.Message = $"Không tìm thấy người dùng nào cho yêu cầu này.";
                return response;
            }

            var userTokenEntity = await _dbContext.UserTokens.Where(utc =>
                utc.UserId == userExist.Id && utc.Token == confirmEmailDto.Token).FirstOrDefaultAsync();

            if (userTokenEntity != null)
            {
                if (userTokenEntity.IsTokenInvoked)
                {
                    response.Level = CNotificationLevel.Error;
                    response.Message = $"Mã xác thực này đã được sử dụng. Vui lòng yêu cầu mã mới.";
                    return response;
                }
                if (userTokenEntity.TokenExpiration < DateTimeOffset.UtcNow)
                {
                    response.Level = CNotificationLevel.Error;
                    response.Message = $"Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.";
                    return response;
                }
            }

            var result = await _userManager.ConfirmEmailAsync(userExist, confirmEmailDto.Token);
            if (!result.Succeeded)
            {
                response.Message = result.Errors.Select(err => err.Description).ToList().ToMultilineString();
                response.Level = CNotificationLevel.Error;
                return response;
            }

            if (userTokenEntity == null)
            {
                userTokenEntity = new UserTokenEntity
                {
                    IsTokenInvoked = true,
                    Name = CTokenType.EmailConfirmation.ToDescription(),
                    Token = confirmEmailDto.Token,
                    TokenExpiration = DateTimeOffset.UtcNow.AddMinutes(-1),
                    Type = CTokenType.EmailConfirmation,
                    UserId = userExist.Id
                };
                await _dbContext.UserTokens.AddAsync(userTokenEntity);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                userTokenEntity.IsTokenInvoked = true;
                _dbContext.UserTokens.Update(userTokenEntity);
                await _dbContext.SaveChangesAsync();
            }

            response.Level = CNotificationLevel.Success;
            response.Message = "Email của bạn đã được xác nhận thành công và quá trình đăng ký tài khoản đã hoàn tất. Xin chúc mừng!";
            return response;
        }
        #endregion register

        #region Reset password
        public async Task<ApiResponse<ResultMessage>> RequestResetPasswordAsync(
            ResetPasswordRequestDto resetPasswordDto, ModelStateDictionary? modelState = null)
        {
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<ResultMessage>();
            if (!errors.IsNullOrEmpty())
            {
                response.StatusCode = StatusCodes.Status400BadRequest;
                response.Result.Success = false;
                response.Result.Errors = errors;
                return response;
            }
            var userExist = await _userManager.FindByEmailAsync(email: resetPasswordDto.Email);
            if (userExist == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Người dùng '{resetPasswordDto.Email}' không tồn tại.",
                    ErrorScope = CErrorScope.Field,
                    Field = $"{nameof(ResetPasswordRequestDto.Email)}_Error"
                });
                response.StatusCode = StatusCodes.Status404NotFound;
                response.Result.Success = false;
                response.Result.Errors = errors;
                return response;
            }
            using (var dbTransaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    // need check if already has request still not expire.
                    var tokenExpire = await _dbContext.UserTokens.Where(utc =>
                            utc.UserId == userExist.Id
                            && utc.Type == CTokenType.PasswordReset
                            && utc.TokenExpiration > DateTimeOffset.UtcNow)
                        .OrderByDescending(utc => utc.TokenExpiration)
                        .FirstOrDefaultAsync();
                    if (tokenExpire != null)
                    {
                        await dbTransaction.RollbackAsync();
                        errors.Add(new ErrorDetail()
                        {
                            Error = $"Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng kiểm tra email để xác nhận yêu cầu trước đó. Bạn không thể thực hiện yêu cầu mới cho đến khi yêu cầu hiện tại hết hạn",
                            ErrorScope = CErrorScope.PageSumarry
                        });
                        response.StatusCode = StatusCodes.Status409Conflict;
                        response.Result.Success = false;
                        response.Result.Errors = errors;
                        return response;
                    }
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user: userExist);
                    var clientEndpoint = RuntimeContext.LinkHelper?.ClientAppEndpoint;
                    var appEndpoint = RuntimeContext.LinkHelper?.AppEndpoint;
                    if (string.IsNullOrEmpty(clientEndpoint))
                    {
                        await dbTransaction.RollbackAsync();
                        errors.Add(new ErrorDetail()
                        {
                            Error = "Không tìm thấy Client Endpoint để gửi Email.",
                            ErrorScope = CErrorScope.PageSumarry
                        });
                        response.StatusCode = StatusCodes.Status404NotFound;
                        response.Result.Success = false;
                        response.Result.Errors = errors;
                        return response;
                    }
                    if (string.IsNullOrEmpty(appEndpoint))
                    {
                        await dbTransaction.RollbackAsync();
                        errors.Add(new ErrorDetail()
                        {
                            Error = "Không tìm thấy Server Endpoint để gửi Email.",
                            ErrorScope = CErrorScope.PageSumarry
                        });
                        response.StatusCode = StatusCodes.Status404NotFound;
                        response.Result.Success = false;
                        response.Result.Errors = errors;
                        return response;
                    }
                    var confirmationLink = LinkHelper.GenerateEmailConfirmationUrl(endpoint: clientEndpoint,
                            relatedUrl: appEndpoint,
                            userId: userExist.Id.ToString(), token: token).ToString();
                    var appInfo = RuntimeContext.AppSettings.ClientApp;
                    var emailReplaceProperty = new ResetPasswordEmailTemplateModel()
                    {
                        Address = appInfo.Address,
                        CompanyName = appInfo.CompanyName,
                        CustomerName = userExist.FullName,
                        Email = appInfo.Email,
                        ReceiverEmail = userExist.Email ?? string.Empty,
                        OwnerName = appInfo.OwnerName,
                        OwnerPhone = appInfo.OwnerPhone,
                        ConfirmationLink = confirmationLink
                    };
                    await _emailService.SendEmailAsync(email: userExist.Email ?? string.Empty,
                        subject: "YÊU CẦU ĐẶT LẠI MẬT KHẨU",
                        htmlTemplate: string.Empty,
                        fileTemplateName: "ResetPasswordTemplate.html",
                        replaceProperty: emailReplaceProperty,
                        emailProviderType: CEmailProviderType.Gmail);
                    var userTokenEntity = new UserTokenEntity()
                    {
                        Token = token,
                        Type = CTokenType.PasswordReset,
                        TokenExpiration = DateTimeOffset.UtcNow.AddMinutes(5),
                        IsTokenInvoked = false,
                        Name = CTokenType.PasswordReset.ToDescription(),
                        UserId = userExist.Id,
                        TokenProviderName = CTokenProviderType.Email.ToString(),
                        TokenProviderType = CTokenProviderType.Email
                    };
                    await _dbContext.UserTokens.AddAsync(entity: userTokenEntity);
                    await _dbContext.SaveChangesAsync();

                    response.StatusCode = StatusCodes.Status202Accepted;
                    response.Result.Success = true;
                    response.Result.Data = new ResultMessage()
                    {
                        Level = CNotificationLevel.Success,
                        NotificationType = CNotificationType.Email,
                        Message = $"Liên kết đặt lại mật khẩu đã được gửi tới địa chỉ email của bạn. Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn để đặt lại mật khẩu của bạn."
                    };
                    await dbTransaction.CommitAsync();
                    return response;
                }
                catch (Exception ex)
                {
                    await dbTransaction.RollbackAsync();
                    _logger.LogError(ex.Message);
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Đã xảy ra lỗi trong quá trình tạo mã và gửi email xác nhận đặt lại mật khẩu.",
                        ErrorScope = CErrorScope.Global
                    });
                    response.StatusCode = StatusCodes.Status500InternalServerError;
                    response.Result.Success = false;
                    response.Result.Errors = errors;
                    return response;
                }
            }
        }

        public async Task<ApiResponse<ResultMessage>> ConfirmResetPasswordAsync(ConfirmResetPasswordRequestDto confirmDto,
            ModelStateDictionary? modelState = null)
        {
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<ResultMessage>();
            var parseTokenResult = LinkHelper.DecodeTokenFromUrl(tokenFromUrl: confirmDto.Token);
            if (parseTokenResult.IsNullOrEmpty())
            {
                errors.Add(new ErrorDetail()
                {
                    Error = "Token invalid",
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.StatusCode = StatusCodes.Status406NotAcceptable;
                response.Result.Success = false;
                response.Result.Errors = errors;
                return response;
            }
            confirmDto.Token = parseTokenResult ?? string.Empty;
            if (!errors.IsNullOrEmpty())
            {
                response.StatusCode = StatusCodes.Status400BadRequest;
                response.Result.Success = false;
                response.Result.Errors = errors;
                return response;
            }
            var userExist = await _userManager.FindByIdAsync(userId: confirmDto.UserId);
            if (userExist == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = "Không tìm thấy người dùng",
                    ErrorScope = CErrorScope.PageSumarry,
                });
                response.StatusCode = StatusCodes.Status404NotFound;
                response.Result.Errors = errors;
                response.Result.Success = false;
                return response;
            }
            var userToken = await _dbContext.UserTokens.Where(ut =>
                ut.Token == confirmDto.Token && ut.UserId == userExist.Id).FirstOrDefaultAsync();
            if (userToken == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = "Token invalid",
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.StatusCode = StatusCodes.Status406NotAcceptable;
                response.Result.Success = false;
                response.Result.Errors = errors;
                return response;
            }
            else if (userToken.IsTokenInvoked || userToken.TokenExpiration < DateTimeOffset.UtcNow)
            {
                string errorMessage = string.Empty;
                if (userToken.IsTokenInvoked)
                {
                    errorMessage = "Token has been revoked.";
                }
                else
                {
                    errorMessage = "Token has beeen expired";
                }
                errors.Add(new ErrorDetail()
                {
                    Error = errorMessage,
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.StatusCode = StatusCodes.Status406NotAcceptable;
                response.Result.Success = false;
                response.Result.Errors = errors;
                return response;
            }

            var checkTokenResult = await _userManager.ResetPasswordAsync(user: userExist,
                token: confirmDto.Token, newPassword: confirmDto.NewPassword);
            if (!checkTokenResult.Succeeded)
            {
                string errorMessage = string.Empty;
                if (userToken.IsTokenInvoked)
                {
                    errorMessage = "Token has been used.";
                }
                else if (userToken.TokenExpiration < DateTimeOffset.UtcNow)
                {
                    errorMessage = "Token expired";
                }
                else
                {
                    errorMessage = String.Join(Environment.NewLine, checkTokenResult.Errors.Select(err => err.Description));
                }
                errors.Add(new ErrorDetail()
                {
                    Error = errorMessage,
                    ErrorScope = CErrorScope.PageSumarry
                });
                return response;
            }
            userToken.IsTokenInvoked = true;
            _dbContext.UserTokens.Update(entity: userToken);
            await _dbContext.SaveChangesAsync();
            response.Result.Success = true;
            response.Result.Data = new ResultMessage()
            {
                Level = CNotificationLevel.Success,
                NotificationType = CNotificationType.Normal,
                Message = "Reset password reset successfully"
            };
            response.StatusCode = StatusCodes.Status200OK;
            return response;
        }
        #endregion Reset password

        #region Logout
        public async Task<ApiResponse<ResultMessage>> LogOutAsync(bool areAllDevices = false)
        {
            var currentUserId = RuntimeContext.CurrentUserId;
            var currentAccessToken = RuntimeContext.CurrentAccessToken;
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ResultMessage>();
            if (!currentUserId.HasValue || currentUserId == Guid.Empty || currentAccessToken == null)
            {
                errors.Add(new ErrorDetail() { Error = "Authentication failed!", ErrorScope = CErrorScope.PageSumarry });
                response.StatusCode = StatusCodes.Status401Unauthorized;
                response.Result.Errors = errors;
                response.Result.Success = false;
                return response;
            }
            var userRefreshTokenEntity = await _dbContext.UserRefreshTokens.Where(urt => urt.UserId == currentUserId.Value
                && urt.AccessToken == currentAccessToken).FirstOrDefaultAsync();
            if (userRefreshTokenEntity == null)
            {
                response.StatusCode = StatusCodes.Status200OK;
                response.Result.Success = true;
                response.Result.Data = new ResultMessage()
                {
                    Message = "Đăng xuất thành công.",
                    Level = CNotificationLevel.Info,
                    NotificationType = CNotificationType.Normal
                };
                return response;
            }
            var revokedUserRefreshTokens = areAllDevices ? await _dbContext.UserRefreshTokens.Where(urt => urt.UserId == currentUserId.Value
                && !urt.IsRevoked && urt.ExpireTime >= DateTimeOffset.UtcNow).ToListAsync() : new List<UserRefreshTokenEntity>() { userRefreshTokenEntity };
            var now = DateTimeOffset.UtcNow;
            revokedUserRefreshTokens.ForEach(item =>
            {
                item.IsRevoked = true;
                item.ExpireTime = now;
                item.LastRevoked = now;
            });
            using (var dbTransaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    _dbContext.UserRefreshTokens.UpdateRange(entities: revokedUserRefreshTokens);
                    await _dbContext.SaveChangesAsync();
                    await dbTransaction.CommitAsync();
                    response.Result.Success = true;
                    response.Result.Data = new ResultMessage()
                    {
                        Message = "Logout successfully",
                        Level = CNotificationLevel.Info,
                        NotificationType = CNotificationType.Normal
                    };
                    response.StatusCode = StatusCodes.Status200OK;
                    return response;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.Message);
                    await dbTransaction.RollbackAsync();
                    errors.Add(new ErrorDetail() { Error = "An error occured while revoked token.", ErrorScope = CErrorScope.PageSumarry });
                    response.Result.Errors = errors;
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status500InternalServerError;
                    return response;
                }
            }
        }
        #endregion Logout

        #region Send Email
        private async Task SendEmailConfirmRegistrationAsync(UserEntity userExist)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user: userExist);
            var confirmationLink = LinkHelper.GenerateEmailConfirmationUrl(endpoint: RuntimeContext.LinkHelper?.AppEndpoint ?? string.Empty,
                relatedUrl: EmailEndpoint.REGISTRAION_CONFIRM_ENDPOINT,
                userId: userExist.Id.ToString(), token: token).ToString();
            var clientInfo = RuntimeContext.AppSettings.ClientApp;
            var emailReplaceProperty = new ConfirmEmailTemplateModel
            {
                ConfirmationLink = confirmationLink,
                CustomerName = userExist.FullName,
                ReceiverEmail = userExist.Email ?? string.Empty,
                CompanyName = clientInfo.CompanyName,
                Address = clientInfo.Address,
                OwnerName = clientInfo.OwnerName,
                OwnerPhone = clientInfo.OwnerPhone
            };
            await _emailService.SendEmailAsync(userExist.Email ?? string.Empty,
                "Confirm your email to complete your registration",
                string.Empty, "ConfirmEmailTemplate.html",
                emailReplaceProperty,
                CEmailProviderType.Gmail);

            // save userToken
            var userTokenEntity = new UserTokenEntity()
            {
                IsTokenInvoked = false,
                Name = CTokenType.EmailConfirmation.ToDescription(),
                Type = CTokenType.EmailConfirmation,
                TokenExpiration = DateTimeOffset.UtcNow.AddMinutes(5),
                UserId = userExist.Id,
                Token = token,
                TokenProviderName = CTokenProviderType.Email.ToString(),
                TokenProviderType = CTokenProviderType.Email
            };
            await _dbContext.UserTokens.AddAsync(entity: userTokenEntity);
        }
        #endregion Send Email
    }
}