using HoTroDuLichAI.API;
using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI
{
    public class ItineraryService : IItineraryService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly UserManager<UserEntity> _userManager;
        private readonly IPlaceService _placeService;
        private readonly IReviewPlaceService _reviewPlaceSevice;
        private readonly ILogger<ItineraryService> _logger;

        public ItineraryService(HoTroDuLichAIDbContext dbContext,
            UserManager<UserEntity> userManager,
            IPlaceService placeService,
            IReviewPlaceService reviewPlaceSevice,
            ILogger<ItineraryService> logger)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _placeService = placeService;
            _reviewPlaceSevice = reviewPlaceSevice;
            _logger = logger;
        }
        public async Task<ApiResponse<BasePagedResult<ItineraryDto>>> GetAllItinerariesAsync(ItineraryPagingAndFilterParam param, ModelStateDictionary? modelState = null)
        {
            ApiResponse<BasePagedResult<ItineraryDto>>? response = new ApiResponse<BasePagedResult<ItineraryDto>>();
            List<ErrorDetail>? errors = ErrorHelper.GetModelStateError(modelState: modelState);
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
                IQueryable<ItineraryEntity> collection = _dbContext.Itineraries.Include(it => it.User)
                    .Include(it => it.ItineraryDetails);
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
                    collection = collection.Where(e => e.UserId == currentUser.Id);
                }

                if (!string.IsNullOrEmpty(param.SearchQuery))
                {
                    collection = collection.Where(it =>
                        it.Name.ToLower().Contains(param.SearchQuery.Trim().ToLower()));
                }
                if (param.SortProperty != null)
                {
                    var sorter = param.SortProperty;
                    if (!string.IsNullOrEmpty(sorter.KeyName))
                    {
                        if (sorter.KeyName.Equals(nameof(ItineraryDto.Name), StringComparison.OrdinalIgnoreCase))
                        {
                            collection = sorter.IsASC ? collection.OrderBy(it => it.Name) : collection.OrderByDescending(it => it.Name);
                        }
                        if (sorter.KeyName.Equals(value: nameof(ItineraryEntity.UpdatedDate), comparisonType: StringComparison.OrdinalIgnoreCase))
                        {
                            collection = sorter.IsASC ? collection.OrderBy(it => it.UpdatedDate) : collection.OrderByDescending(it => it.UpdatedDate);
                        }
                    }
                }

                var pagedList = await PagedList<ItineraryEntity>.ToPagedListAsync(source: collection, pageNumber: param.PageNumber, pageSize: param.PageSize);
                var selected = pagedList.Select(it => new ItineraryDto
                {
                    Id = it.Id,
                    Name = it.Name,
                    CreatedDate = it.CreatedDate,
                    UpdatedDate = it.UpdatedDate,
                    User = currentUser!,
                }).ToList();
                var data = new BasePagedResult<ItineraryDto>()
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

        public async Task<ApiResponse<BasePagedResult<ItineraryDetailDto>>> GetAllItineraryDetailsAync(ItineraryPagingAndFilterParam param, Guid ItinerartId, ModelStateDictionary? modelState = null)
        {
            ApiResponse<BasePagedResult<ItineraryDetailDto>>? response = new ApiResponse<BasePagedResult<ItineraryDetailDto>>();
            List<ErrorDetail>? errors = ErrorHelper.GetModelStateError(modelState: modelState);
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
                IQueryable<ItineraryDetailEntity> collection = _dbContext.ItineraryDetails.Include(it => it.Place);
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
                    var itinerary = await _dbContext.Itineraries.Include(it => it.User).Where(it => it.UserId == currentUser.Id && it.Id == ItinerartId).FirstOrDefaultAsync();
                    if (itinerary == null)
                    {
                        errors.Add(new ErrorDetail()
                        {
                            Error = $"Dữ liệu không tồn tại.",
                            ErrorScope = CErrorScope.PageSumarry
                        });
                        response.Result.Errors.AddRange(errors);
                        response.Result.Success = false;
                        response.StatusCode = StatusCodes.Status404NotFound;
                        return response;
                    }
                    var itineraryDetails = await GetItineraryDetailAsync(ItinerartId);
                    var itineraryDetailIds = itineraryDetails.Select(s => s.Id).ToList();
                    collection = collection.Where(e => itineraryDetailIds.Contains(e.Id));
                }

                if (!string.IsNullOrEmpty(param.SearchQuery))
                {
                    collection = collection.Where(it =>
                        it.Place.Name.ToLower().Contains(param.SearchQuery.Trim().ToLower()));
                }
                if (param.SortProperty != null)
                {
                    var sorter = param.SortProperty;
                    if (!string.IsNullOrEmpty(sorter.KeyName))
                    {
                        if (sorter.KeyName.Equals(nameof(ItineraryDetailEntity.Index), StringComparison.OrdinalIgnoreCase))
                        {
                            collection = sorter.IsASC ? collection.OrderBy(it => it.Index) : collection.OrderByDescending(it => it.Index);
                        }
                        if (sorter.KeyName.Equals(nameof(ItineraryDetailEntity.Time), StringComparison.OrdinalIgnoreCase))
                        {
                            collection = sorter.IsASC ? collection.OrderBy(it => it.Time) : collection.OrderByDescending(it => it.Time);
                        }
                        if (sorter.KeyName.Equals(nameof(ItineraryDetailEntity.CreatedDate), StringComparison.OrdinalIgnoreCase))
                        {
                            collection = sorter.IsASC ? collection.OrderBy(it => it.CreatedDate) : collection.OrderByDescending(it => it.CreatedDate);
                        }
                    }
                }
                var reviewDic = await _dbContext.ReviewPlaces.GroupBy(s => s.PlaceId).ToDictionaryAsync(g => g.Key, g => g.Select(s=>s.Adapt<ReviewPlaceDto>()).ToList());
                var pagedList = await PagedList<ItineraryDetailEntity>.ToPagedListAsync(source: collection, pageNumber: param.PageNumber, pageSize: param.PageSize);
                List<ItineraryDetailDto>? selected = pagedList.Select(it => new ItineraryDetailDto
                {
                    Id = it.Id,
                    Index = it.Index,
                    CreatedDate = it.CreatedDate,
                    Time = it.Time,
                    ItineraryId = it.ItineraryId,
                    PlaceId = it.PlaceId,
                    reviewPlace = reviewDic.ContainsKey(it.PlaceId) ? reviewDic[it.PlaceId] : new List<ReviewPlaceDto>()

                }).ToList();
                var data = new BasePagedResult<ItineraryDetailDto>()
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


        public async Task<ApiResponse<ItineraryDto>> GetItineraryByIdAsync(Guid id)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ItineraryDto>();
            try
            {
                var itineraryEntity = await _dbContext.Itineraries
                    .Include(it => it.User)
                    .Include(it => it.ItineraryDetails)
                    .Where(it => it.Id == id)
                    .Select(it => new
                    {
                        Id = id,
                        Name = it.Name,
                        CreatedDate = it.CreatedDate,
                        UpdatedDate = it.UpdatedDate,
                        ItineraryDetails = it.ItineraryDetails,
                    }).FirstOrDefaultAsync();
                if (itineraryEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                var data = itineraryEntity.Adapt<ItineraryDto>();
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
        public async Task<ApiResponse<ItineraryDetailDto>> GetItineraryDetailsByIdAsync(Guid id)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ItineraryDetailDto>();
            try
            {
                var itineraryDetailEntity = await _dbContext.ItineraryDetails
                    .Include(it => it.Place)
                    .Where(it => it.Id == id)
                    .Select(it => new
                    {
                        Id = it.Id,
                        Index = it.Index,
                        Time = it.Time,
                        CreatedDate = it.CreatedDate,
                        Itinerary = it.Itinerary,
                        Place = it.Place,

                    }).FirstOrDefaultAsync();
                if (itineraryDetailEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                var data = itineraryDetailEntity.Adapt<ItineraryDetailDto>();
                var imageDic = new Dictionary<Guid, List<ImageProperty>>();
                imageDic = await _dbContext.Places.ToDictionaryAsync(p => p.Id, p => p.ImageProperties);
                data.Place.ImageProperties = imageDic[data.PlaceId];
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

        private async Task<List<ItineraryDetailDto>> GetItineraryDetailAsync(Guid itineraryId)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ItineraryDetailDto>();
            try
            {
                var itineraryDetailEntities = await _dbContext.ItineraryDetails
                    .Include(it => it.Place)
                    .Where(it => it.ItineraryId == itineraryId)
                    .Select(it => new ItineraryDetailDto()
                    {
                        Id = it.Id,
                        Index = it.Index,
                        Time = it.Time,
                        CreatedDate = it.CreatedDate,
                        ItineraryId = it.ItineraryId,
                        PlaceId = it.PlaceId,
                    }).ToListAsync();
                if (itineraryDetailEntities.IsNullOrEmpty())
                {
                    _logger.LogWarning("No details item exist.");
                    return new List<ItineraryDetailDto>();
                }
                var data = itineraryDetailEntities.Adapt<List<ItineraryDetailDto>>();
                var imageDic = new Dictionary<Guid, List<ImageProperty>>();
                imageDic = await _dbContext.Places.ToDictionaryAsync(p => p.Id, p => p.ImageProperties);
                foreach (var d in data)
                {
                    d.Place.ImageProperties = imageDic[d.PlaceId];
                }
                return data;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return new();
            }
        }
    }
}