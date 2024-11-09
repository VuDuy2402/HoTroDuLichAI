using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI.API
{
    public class UserService : IUserService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly UserManager<UserEntity> _userManager;
        private readonly RoleManager<RoleEntity> _roleManager;
        private readonly ILogger<UserService> _logger;
        public UserService(
            HoTroDuLichAIDbContext dbContext,
            UserManager<UserEntity> userManager,
            RoleManager<RoleEntity> roleManager,
            ILogger<UserService> logger)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
        }

        #region Manage user
        #region Get with paging
        public async Task<ApiResponse<BasePagedResult<UserDetailResponseDto>>> GetWithPagingAsync(UserFilterParams param,
            ModelStateDictionary? modelState = null)
        {
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<BasePagedResult<UserDetailResponseDto>>();
            if (!errors.IsNullOrEmpty())
            {
                return await ResponseHelper.BadRequestErrorAsync(errors: errors, response: response);
            }
            try
            {
                IQueryable<UserEntity> collection = _dbContext.Users;
                if (!string.IsNullOrEmpty(param.Query))
                {
                    collection = collection.Where(us => (us.FullName + " " + us.Email + " " + us.DateOfBirth).ToLower().Contains(param.Query.ToLower()));
                }
                var pagedList = await PagedList<UserEntity>.ToPagedListAsync(source: collection,
                    pageNumber: param.PageNumber,
                    pageSize: param.PageSize);
                var selected = pagedList.Select(us => new
                {
                    UserId = us.Id,
                    Email = us.Email ?? string.Empty,
                    FullName = us.FullName,
                    DateOfBirth = us.DateOfBirth,
                    Address = us.Address,
                    CreatedDate = us.CreatedDate,
                    Picture = us.ImageProperty,
                    EmailConfirm = us.EmailConfirmed,
                    TwoFactorEnable = us.TwoFactorEnabled,
                    RoleProperties = _dbContext.UserRoles
                        .Where(ur => ur.UserId == us.Id)
                        .Join(_dbContext.Roles,
                            ur => ur.RoleId,
                            r => r.Id,
                            (ur, r) => new RoleDetailProperty
                            {
                                RoleId = r.Id,
                                RoleName = r.Name ?? string.Empty,
                                RoleType = Enum.Parse<CRoleType>(r.Name ?? string.Empty, true)
                            })
                        .ToList()
                }).ToList();
                var userDetails = selected.Select(item => new UserDetailResponseDto()
                {
                    UserId = item.UserId,
                    Address = item.Address,
                    CreatedDate = item.CreatedDate,
                    DateOfBirth = item.DateOfBirth,
                    Email = item.Email,
                    FullName = item.FullName,
                    ConfirmEmail = item.EmailConfirm,
                    TwoFactorEnable = item.TwoFactorEnable,
                    Picture = (item.Picture.FromJson<List<ImageProperty>>() ?? new())
                        .Where(img => img.ImageType == CImageType.Avatar && img.IsDefault)
                        .Select(img => img.Url)
                        .FirstOrDefault() ?? string.Empty,
                    RoleDetailProperties = item.RoleProperties
                }).ToList();
                var data = new BasePagedResult<UserDetailResponseDto>()
                {
                    CurrentPage = pagedList.CurrentPage,
                    Items = userDetails,
                    PageSize = pagedList.PageSize,
                    TotalItems = pagedList.TotalCount,
                    TotalPages = pagedList.TotalPages,
                    ObjFilterProperties = param.UserFilterProperties,
                };
                response.Result.Data = data;
                response.StatusCode = StatusCodes.Status200OK;
                response.Result.Success = true;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
        #endregion get with paging

        #region get by id
        public async Task<ApiResponse<UserDetailResponseDto>> GetByIdAsync(Guid userId)
        {
            var response = new ApiResponse<UserDetailResponseDto>();
            var errors = new List<ErrorDetail>();

            var users = await _dbContext.Users
                .Where(u => u.Id == userId)
                .ToListAsync();
            var data = users.Select(u => new UserDetailResponseDto
            {
                UserId = u.Id,
                Email = u.Email ?? string.Empty,
                FullName = u.FullName,
                DateOfBirth = u.DateOfBirth,
                Address = u.Address,
                CreatedDate = u.CreatedDate,
                ConfirmEmail = u.EmailConfirmed,
                TwoFactorEnable = u.TwoFactorEnabled,
                Picture = (u.ImageProperty.FromJson<List<ImageProperty>>() ?? new())
                        .Where(img => img.ImageType == CImageType.Avatar && img.IsDefault)
                        .Select(img => img.Url)
                        .FirstOrDefault() ?? string.Empty,
                RoleDetailProperties = _dbContext.UserRoles
                        .Where(ur => ur.UserId == u.Id)
                        .Join(_dbContext.Roles,
                              ur => ur.RoleId,
                              r => r.Id,
                              (ur, r) => new RoleDetailProperty
                              {
                                  RoleId = r.Id,
                                  RoleName = r.Name ?? string.Empty,
                                  RoleType = Enum.Parse<CRoleType>(r.Name ?? string.Empty, true)
                              })
                        .ToList()
            })
                .FirstOrDefault();

            if (data == null)
            {
                return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
            }
            response.Result.Data = data;
            response.StatusCode = StatusCodes.Status200OK;
            response.Result.Success = true;
            return response;
        }
        #endregion get by id

        #region delete user
        public async Task<ApiResponse<ResultMessage>> DeleteAsync(Guid userId)
        {
            var response = new ApiResponse<ResultMessage>();
            var errors = new List<ErrorDetail>();

            try
            {
                var user = await _dbContext.Users.FindAsync(userId);
                if (user == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }

                _dbContext.Users.Remove(user);
                await _dbContext.SaveChangesAsync();

                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Xóa người dùng thành công!.",
                    NotificationType = CNotificationType.Normal
                };
                response.StatusCode = StatusCodes.Status200OK;
                response.Result.Success = true;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex,
                    customMessage: "Không thể xóa người dùng này.");
            }
        }
        #endregion delete user

        #region create user
        public async Task<ApiResponse<ResultMessage>> CreateUserAsync(CreateUserRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            var response = new ApiResponse<ResultMessage>();
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            if (!errors.IsNullOrEmpty())
            {
                return await ResponseHelper.BadRequestErrorAsync(errors: errors, response: response);
            }
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var user = await _userManager.FindByEmailAsync(requestDto.Email);
                if (user != null)
                {
                    await transaction.RollbackAsync();
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Địa chỉ email = {requestDto.Email} đã được sử dụng",
                        ErrorScope = CErrorScope.Field,
                        Field = $"{nameof(requestDto.Email)}_Error"
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = true;
                    response.StatusCode = StatusCodes.Status409Conflict;
                    return response;
                }
                user = new UserEntity()
                {
                    FullName = requestDto.FullName,
                    Address = requestDto.Address,
                    DateOfBirth = requestDto.DateOfBirth,
                    Email = requestDto.Email,
                    UserName = requestDto.Email,
                    EmailConfirmed = requestDto.ConfirmEmail,
                    TwoFactorEnabled = requestDto.TwoFactorEnable,
                };
                var createResult = await _userManager.CreateAsync(user: user, password: requestDto.Password);
                if (!createResult.Succeeded)
                {
                    await transaction.RollbackAsync();
                    errors.Add(new ErrorDetail()
                    {
                        Error = createResult.Errors.Select(err => err.Description).ToList().ToMultilineString(),
                        ErrorScope = CErrorScope.FormSummary,
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status500InternalServerError;
                    return response;
                }
                var createRoleResult = await _userManager.AddToRolesAsync(user: user, roles: await _dbContext.Roles.Where(r =>
                        requestDto.RoleIds.Contains(r.Id)).Select(r => r.Name ?? string.Empty)
                    .ToListAsync() ?? new List<string>() { CRoleType.NormalUser.ToString() });
                if (!createRoleResult.Succeeded)
                {
                    await transaction.RollbackAsync();
                    errors.Add(new ErrorDetail()
                    {
                        Error = createRoleResult.Errors.Select(err => err.Description).ToList().ToMultilineString(),
                        ErrorScope = CErrorScope.FormSummary,
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status500InternalServerError;
                    return response;
                }

                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Tạo người dùng thành công",
                    NotificationType = CNotificationType.Normal
                };
                response.StatusCode = StatusCodes.Status200OK;
                response.Result.Success = true;
                await transaction.CommitAsync();
                return response;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
        #endregion create user

        #region update user
        public async Task<ApiResponse<UserDetailResponseDto>> UpdateAsync(UpdateUserRequestDto updateUserDto,
            ModelStateDictionary? modelState = null)
        {
            var response = new ApiResponse<UserDetailResponseDto>();
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);

            var user = await _dbContext.Users.FindAsync(updateUserDto.UserId);
            if (user == null)
            {
                return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
            }

            user.FullName = updateUserDto.FullName;
            user.EmailConfirmed = updateUserDto.ConfirmEmail;
            user.TwoFactorEnabled = updateUserDto.TwoFactorEnable;
            user.DateOfBirth = updateUserDto.DateOfBirth;
            user.Address = updateUserDto.Address;

            if (!string.IsNullOrEmpty(updateUserDto.NewPassword))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passwordChangeResult = await _userManager.ResetPasswordAsync(user, token, updateUserDto.NewPassword);
                if (!passwordChangeResult.Succeeded)
                {
                    response.Result.Errors.AddRange(passwordChangeResult.Errors.Select(e => new ErrorDetail()
                    {
                        Error = e.Description,
                        ErrorScope = CErrorScope.PageSumarry
                    }).ToList());
                    response.StatusCode = StatusCodes.Status400BadRequest;
                    response.Result.Success = false;
                    return response;
                }
                var userToken = new UserTokenEntity()
                {
                    Name = CTokenType.PasswordReset.ToString(),
                    Type = CTokenType.PasswordReset,
                    TokenProviderName = CTokenProviderType.Authenticator.ToString(),
                    TokenProviderType = CTokenProviderType.Authenticator,
                    Token = token,
                    TokenExpiration = DateTimeOffset.UtcNow.AddMinutes(5),
                    UserId = user.Id
                };
                _dbContext.UserTokens.Add(entity: userToken);
                await _dbContext.SaveChangesAsync();
            }
            if (updateUserDto.RoleIds != null)
            {
                var currentRoleIds = _dbContext.UserRoles
                    .Where(ur => ur.UserId == user.Id)
                    .Select(ur => ur.RoleId)
                    .ToList();

                var rolesToAdd = updateUserDto.RoleIds.Except(currentRoleIds).ToList();
                var rolesToRemove = currentRoleIds.Except(updateUserDto.RoleIds).ToList();

                foreach (var roleId in rolesToRemove)
                {
                    var userRole = await _dbContext.UserRoles
                        .FirstOrDefaultAsync(ur => ur.UserId == user.Id && ur.RoleId == roleId);
                    if (userRole != null)
                    {
                        _dbContext.UserRoles.Remove(userRole);
                    }
                }

                foreach (var roleId in rolesToAdd)
                {
                    var userRole = new IdentityUserRole<Guid>
                    {
                        UserId = user.Id,
                        RoleId = roleId
                    };
                    _dbContext.UserRoles.Add(userRole);
                }

                await _dbContext.SaveChangesAsync();
                // need remove all session login
                var userRefreshToken = await _dbContext.UserRefreshTokens.Where(usr => usr.UserId == updateUserDto.UserId).ToListAsync();
                userRefreshToken.ForEach(item =>
                {

                    item.IsRevoked = true;
                    item.LastRevoked = DateTimeOffset.UtcNow.AddMonths(-5);
                    item.ExpireTime = DateTimeOffset.UtcNow.AddHours(-1);
                });
                _dbContext.UserRefreshTokens.UpdateRange(entities: userRefreshToken);
                await _dbContext.SaveChangesAsync();
            }

            _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();

            var updatedUser = new UserDetailResponseDto
            {
                UserId = user.Id,
                Email = user.Email ?? string.Empty,
                FullName = user.FullName,
                DateOfBirth = user.DateOfBirth,
                Address = user.Address,
                ConfirmEmail = user.EmailConfirmed,
                TwoFactorEnable = user.TwoFactorEnabled,
                CreatedDate = user.CreatedDate,
                Picture = (user.ImageProperty.FromJson<List<ImageProperty>>() ?? new())
                    .Where(img => img.ImageType == CImageType.Avatar && img.IsDefault)
                    .Select(img => img.Url)
                    .FirstOrDefault() ?? string.Empty,
                RoleDetailProperties = _dbContext.UserRoles
                    .Where(ur => ur.UserId == user.Id)
                    .Join(_dbContext.Roles,
                        ur => ur.RoleId,
                        r => r.Id,
                        (ur, r) => new RoleDetailProperty
                        {
                            RoleId = r.Id,
                            RoleName = r.Name ?? string.Empty,
                            RoleType = Enum.Parse<CRoleType>(r.Name ?? string.Empty, true)
                        })
                    .ToList()
            };

            response.Result.Data = updatedUser;
            response.StatusCode = StatusCodes.Status200OK;
            response.Result.Success = true;
            return response;
        }

        #endregion update user
        #endregion Manage user

        public async Task<ApiResponse<List<UserChatBaseInfo>>> GetUserAdminInfosAsync()
        {
            var response = new ApiResponse<List<UserChatBaseInfo>>();
            var errors = new List<ErrorDetail>();
            try
            {
                var currentUser = RuntimeContext.CurrentUser;
                if (currentUser == null)
                {
                    return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                }
                bool hasAdminRole = (await _userManager.GetRolesAsync(user: currentUser)).Contains(CRoleType.Admin.ToString());
                var users = await _userManager.GetUsersInRoleAsync(!hasAdminRole ? CRoleType.Admin.ToString() : CRoleType.NormalUser.ToString());

                if (hasAdminRole)
                {
                    users = users.Where(user =>
                    {
                        var roles = _userManager.GetRolesAsync(user).Result;
                        return roles.Count == 1 && roles.Contains(CRoleType.NormalUser.ToString());
                    }).ToList();
                }


                var result = users.Select(adus => new UserChatBaseInfo()
                {
                    UserId = adus.Id,
                    Email = adus.Email ?? string.Empty,
                    FullName = adus.FullName,
                    Picture = adus.ImageProperties.Where(img => img.ImageType == CImageType.Avatar
                        && img.IsDefault).Select(adus => adus.Url).FirstOrDefault() ?? string.Empty
                }).ToList();
                response.Result.Data = result;
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

        #region Roles of user
        public async Task<ApiResponse<ResultMessage>> AddUserRolesAsync(AddUserRolesRequestDto requestDto, ModelStateDictionary? modelState = null)
        {
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<ResultMessage>();
            if (requestDto == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Dữ liệu gửi về không đúng định dạng. Vui lòng kiểm trả lại.",
                    ErrorScope = CErrorScope.FormSummary
                });
                response.Result.Errors.AddRange(errors);
                response.StatusCode = StatusCodes.Status400BadRequest;
                response.Result.Success = false;
                return response;
            }
            if (!errors.IsNullOrEmpty())
            {
                response.Result.Success = false;
                response.Result.Errors.AddRange(errors);
                response.StatusCode = StatusCodes.Status400BadRequest;
                return response;
            }

            var userExist = await _userManager.FindByIdAsync(requestDto.UserId.ToString());
            if (userExist == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Không tìm thấy người dùng hợp lệ.",
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                response.StatusCode = StatusCodes.Status404NotFound;
                return response;
            }

            var roles = await _roleManager.Roles.Select(s => s.Name).ToListAsync();
            var addRoles = requestDto.RoleTypes.Select(s => s.ToString()).ToList();

            var currentUserRoles = await _userManager.GetRolesAsync(userExist);
            var existingRoles = new List<string>();
            var addedRoles = new List<string>();

            // Kiểm tra và thêm vai trò
            foreach (var roleName in addRoles)
            {
                if (currentUserRoles.Contains(roleName))
                {
                    existingRoles.Add(roleName);
                }
                else
                {
                    if (!roles.Contains(roleName))
                    {
                        _logger.LogWarning($"Role {roleName} chưa tồn tại trên hệ thống. Tiến hành tạo role mới...");
                        await _roleManager.CreateAsync(new RoleEntity() { Name = roleName });
                    }
                    var result = await _userManager.AddToRoleAsync(userExist, roleName);
                    if (result.Succeeded)
                    {
                        addedRoles.Add(roleName);
                    }
                    else
                    {
                        errors.Add(new ErrorDetail()
                        {
                            Error = string.Join(",", result.Errors.Select(s => s.Description).ToList()),
                            ErrorScope = CErrorScope.FormSummary
                        });
                    }
                }
            }

            if (errors.Count > 0)
            {
                response.StatusCode = StatusCodes.Status500InternalServerError;
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                return response;
            }

            var messageParts = new List<string>();
            if (existingRoles.Count > 0)
            {
                messageParts.Add($"Vai trò đã tồn tại: {string.Join(", ", existingRoles)}.");
            }
            if (addedRoles.Count > 0)
            {
                messageParts.Add($"Vai trò đã được thêm: {string.Join(", ", addedRoles)}.");
            }

            response.StatusCode = StatusCodes.Status201Created;
            response.Result.Data = new ResultMessage()
            {
                Level = CNotificationLevel.Success,
                Message = string.Join(" ", messageParts),
                NotificationType = CNotificationType.Normal
            };
            response.Result.Success = true;
            return response;
        }

        public async Task<ApiResponse<ResultMessage>> UpdateUserRolesAsync(UpdateUserRolesRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<ResultMessage>();
            if (!errors.IsNullOrEmpty())
            {
                response.Result.Success = false;
                response.Result.Errors.AddRange(errors);
                response.StatusCode = StatusCodes.Status400BadRequest;
                return response;
            }

            var userExist = await _userManager.FindByIdAsync(requestDto.UserId.ToString());
            if (userExist == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Không tìm thấy người dùng hợp lệ.",
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                response.StatusCode = StatusCodes.Status404NotFound;
                return response;
            }

            var roles = await _roleManager.Roles.Select(s => s.Name).ToListAsync();
            var newRoles = requestDto.RoleTypes.Select(s => s.ToString()).ToList();

            var currentUserRoles = await _userManager.GetRolesAsync(userExist);
            var rolesToAdd = newRoles.Except(currentUserRoles).ToList();
            var rolesToRemove = currentUserRoles.Except(newRoles).ToList();

            var existingRoles = new List<string>();
            var addedRoles = new List<string>();
            var removedRoles = new List<string>();

            // Thêm vai trò mới
            foreach (var roleName in rolesToAdd)
            {
                if (!roles.Contains(roleName))
                {
                    _logger.LogWarning($"Role {roleName} chưa tồn tại trên hệ thống. Tiến hành tạo role mới...");
                    await _roleManager.CreateAsync(new RoleEntity() { Name = roleName });
                }

                var result = await _userManager.AddToRoleAsync(userExist, roleName);
                if (result.Succeeded)
                {
                    addedRoles.Add(roleName);
                }
                else
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = string.Join(",", result.Errors.Select(s => s.Description).ToList()),
                        ErrorScope = CErrorScope.FormSummary
                    });
                }
            }

            // Xóa vai trò không còn
            foreach (var roleName in rolesToRemove)
            {
                var result = await _userManager.RemoveFromRoleAsync(userExist, roleName);
                if (result.Succeeded)
                {
                    removedRoles.Add(roleName);
                }
                else
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = string.Join(",", result.Errors.Select(s => s.Description).ToList()),
                        ErrorScope = CErrorScope.FormSummary
                    });
                }
            }

            if (errors.Count > 0)
            {
                response.StatusCode = StatusCodes.Status500InternalServerError;
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                return response;
            }

            var messageParts = new List<string>();
            if (existingRoles.Count > 0)
            {
                messageParts.Add($"Vai trò đã tồn tại: {string.Join(", ", existingRoles)}.");
            }
            if (addedRoles.Count > 0)
            {
                messageParts.Add($"Vai trò đã được thêm: {string.Join(", ", addedRoles)}.");
            }
            if (removedRoles.Count > 0)
            {
                messageParts.Add($"Vai trò đã được xóa: {string.Join(", ", removedRoles)}.");
            }

            response.StatusCode = StatusCodes.Status200OK;
            response.Result.Data = new ResultMessage()
            {
                Level = CNotificationLevel.Success,
                Message = string.Join(" ", messageParts),
                NotificationType = CNotificationType.Normal
            };
            response.Result.Success = true;
            return response;
        }

        public async Task<ApiResponse<ResultMessage>> RemoveUserRolesAsync(RemoveUserRolesRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<ResultMessage>();
            if (!errors.IsNullOrEmpty())
            {
                response.Result.Success = false;
                response.Result.Errors.AddRange(errors);
                response.StatusCode = StatusCodes.Status400BadRequest;
                return response;
            }

            var userExist = await _userManager.FindByIdAsync(requestDto.UserId.ToString());
            if (userExist == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Không tìm thấy người dùng hợp lệ.",
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                response.StatusCode = StatusCodes.Status404NotFound;
                return response;
            }

            var currentUserRoles = await _userManager.GetRolesAsync(userExist);
            var rolesToRemove = requestDto.RoleTypes.Select(s => s.ToString()).ToList();
            var removedRoles = new List<string>();

            foreach (var roleName in rolesToRemove)
            {
                if (!currentUserRoles.Contains(roleName))
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Vai trò {roleName} không tồn tại trong danh sách vai trò của người dùng.",
                        ErrorScope = CErrorScope.FormSummary
                    });
                    continue;
                }

                var result = await _userManager.RemoveFromRoleAsync(userExist, roleName);
                if (result.Succeeded)
                {
                    removedRoles.Add(roleName);
                }
                else
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = string.Join(",", result.Errors.Select(s => s.Description).ToList()),
                        ErrorScope = CErrorScope.FormSummary
                    });
                }
            }

            if (errors.Count > 0)
            {
                response.StatusCode = StatusCodes.Status500InternalServerError;
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                return response;
            }

            response.StatusCode = StatusCodes.Status200OK;
            response.Result.Data = new ResultMessage()
            {
                Level = CNotificationLevel.Success,
                Message = $"Vai trò đã được xóa: {string.Join(", ", removedRoles)}.",
                NotificationType = CNotificationType.Normal
            };
            response.Result.Success = true;
            return response;
        }
        #endregion


    }
}