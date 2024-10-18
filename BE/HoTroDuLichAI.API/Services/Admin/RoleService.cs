using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public class RoleService : IRoleService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly RoleManager<RoleEntity> _roleManager;
        private readonly ILogger<RoleService> _logger;

        public RoleService(
            HoTroDuLichAIDbContext dbContext,
            RoleManager<RoleEntity> roleManager,
            ILogger<RoleService> logger)
        {
            _dbContext = dbContext;
            _roleManager = roleManager;
            _logger = logger;
        }
        public async Task<ApiResponse<ResultMessage>> CreateRolesAsync(CreateRolesRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<ResultMessage>();
            if (!errors.IsNullOrEmpty())
            {
                return await ResponseHelper.BadRequestErrorAsync(errors: errors, response: response);
            }
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            {
                try
                {
                    List<string> messages = new();
                    var entities = requestDto.RoleTypes.Select(role => new RoleEntity()
                    {
                        Name = role.ToString(),
                    }).ToList();
                    foreach (var entity in entities)
                    {
                        await _roleManager.CreateAsync(role: entity);
                    }
                    await transaction.CommitAsync();
                    response.Result.Success = true;
                    response.Result.Data = new ResultMessage()
                    {
                        Level = CNotificationLevel.Success,
                        Message = $"Tạo role thành công.",
                        NotificationType = CNotificationType.Normal
                    };
                    response.StatusCode = StatusCodes.Status201Created;
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

        public async Task<ApiResponse<ResultMessage>> DeleteRolesAsync(DeleteRolesRequestDto requestDto)
        {
            var response = new ApiResponse<ResultMessage>();
            var errors = new List<ErrorDetail>();
            if (requestDto.RoleIds == null || !requestDto.RoleIds.Any())
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"RoleIds không được để trống.",
                    ErrorScope = CErrorScope.PageSumarry,
                });
                return await ResponseHelper.BadRequestErrorAsync(errors: new List<ErrorDetail>() { }, response: response);
            }

            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                foreach (var roleId in requestDto.RoleIds)
                {
                    var role = await _roleManager.FindByIdAsync(roleId.ToString());
                    if (role != null)
                    {
                        await _roleManager.DeleteAsync(role);
                    }
                }
                await transaction.CommitAsync();
                response.Result.Success = true;
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = "Xóa role thành công.",
                    NotificationType = CNotificationType.Normal
                };
                response.StatusCode = StatusCodes.Status200OK;
                return response;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }

        public async Task<ApiResponse<BasePagedResult<RoleDetailResponseDto>>> GetAllRolesAsync(RoleFilterParams param)
        {
            var response = new ApiResponse<BasePagedResult<RoleDetailResponseDto>>();
            IQueryable<RoleEntity> collection = _dbContext.Roles;
            if (!string.IsNullOrEmpty(param.SearchQuery))
            {
                collection.Where(role => !string.IsNullOrEmpty(role.Name) && role.Name.ToLower() == param.SearchQuery.ToLower());
            }
            var pagedList = await PagedList<RoleEntity>.ToPagedListAsync(
                source: collection,
                pageNumber: param.PageNumber,
                pageSize: param.PageSize);
            var selected = pagedList.Select(item => new RoleDetailResponseDto()
            {
                RoleId = item.Id,
                RoleName = item.Name ?? string.Empty,
                Type = Enum.Parse<CRoleType>(item.Name ?? string.Empty, ignoreCase: true),
                ConcurrencyStamp = item.ConcurrencyStamp ?? string.Empty
            }).ToList();
            var listResult = new PagedList<RoleDetailResponseDto>(
                items: selected,
                count: pagedList.Count,
                pageNumber: pagedList.CurrentPage,
                pageSize: pagedList.PageSize);
            response.Result.Data = new BasePagedResult<RoleDetailResponseDto>()
            {
                CurrentPage = listResult.CurrentPage,
                TotalPages = listResult.TotalPages,
                PageSize = listResult.PageSize,
                TotalItems = listResult.TotalCount,
                SearchQuery = param.SearchQuery,
                // ObjFilterProperties = param.Filters,
                Items = listResult,
            };
            response.Result.Success = true;
            response.StatusCode = StatusCodes.Status200OK;
            return response;
        }

        public async Task<ApiResponse<RoleDetailResponseDto>> GetRoleByIdAsync(Guid roleId)
        {
            var response = new ApiResponse<RoleDetailResponseDto>();
            var errors = new List<ErrorDetail>();
            try
            {
                var role = await _roleManager.FindByIdAsync(roleId.ToString());
                if (role == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }

                var roleDetail = new RoleDetailResponseDto
                {
                    RoleId = roleId,
                    RoleName = role.Name ?? string.Empty,
                    Type = Enum.Parse<CRoleType>(role.Name ?? string.Empty),
                    ConcurrencyStamp = role.ConcurrencyStamp ?? string.Empty
                };

                response.Result.Success = true;
                response.Result.Data = roleDetail;
                response.StatusCode = StatusCodes.Status200OK;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }

        public async Task<ApiResponse<ResultMessage>> UpdateRolesAsync(UpdateRolesRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            var errors = ErrorHelper.GetModelStateError(modelState: modelState);
            var response = new ApiResponse<ResultMessage>();
            if (!errors.IsNullOrEmpty())
            {
                return await ResponseHelper.BadRequestErrorAsync(errors: errors, response: response);
            }

            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                foreach (var property in requestDto.RoleProperties)
                {
                    var role = await _roleManager.FindByIdAsync(property.Id.ToString());
                    if (role != null)
                    {
                        role.Name = property.RoleName;
                        await _roleManager.UpdateAsync(role);
                    }
                }
                await transaction.CommitAsync();
                response.Result.Success = true;
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = "Cập nhật role thành công.",
                    NotificationType = CNotificationType.Normal
                };
                response.StatusCode = StatusCodes.Status200OK;
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
}