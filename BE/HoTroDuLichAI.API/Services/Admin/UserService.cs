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

        

        #region Roles of user
        public async Task<ApiResponse<ResultMessage>> AddUserRolesAsync(AddUserRolesRequestDto requestDto, ModelStateDictionary? modelState = null)
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