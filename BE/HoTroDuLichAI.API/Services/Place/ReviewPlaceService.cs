
using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI.API
{
    public class ReviewPlaceSerice : IReviewPlaceService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly UserManager<UserEntity> _userManager;
        private readonly ILogger<PlaceService> _logger;

        public ReviewPlaceSerice
        (
            HoTroDuLichAIDbContext dbContext,
            UserManager<UserEntity> userManager,
            ILogger<PlaceService> logger
        )
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _logger = logger;

        }
        #region review place paging
        public async Task<ApiResponse<BasePagedResult<ReviewPlaceDetailResponseDto>>> GetWithPagingAsync(
            ReviewPlacePagingAndFilterParam param, Guid? placeId = null, ModelStateDictionary? modelState = null
        )
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<BasePagedResult<ReviewPlaceDetailResponseDto>>();
            if (param == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Dữ liệu gửi về không hợp lệ. Vui lòng kiểm tra lại.",
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

            try
            {
                var currentUser = RuntimeContext.CurrentUser;
                IQueryable<ReviewPlaceEntity> collection = _dbContext.ReviewPlaces.Include(rp => rp.User).OrderByDescending(c => c.CreatedDate);
                if (param.IsMy)
                {
                    if (currentUser == null)
                    {
                        return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
                    }
                    collection = collection.Where(rp => rp.UserId == currentUser.Id);
                }
                if (param.IsPlace)
                {
                    if (placeId.HasValue)
                    {
                        collection = collection.Where(rp => rp.PlaceId == placeId.Value);
                    }
                }
                if (!string.IsNullOrEmpty(param.SearchQuery))
                {
                    collection = collection.Where(rp => (rp.Comment + " " +
                        rp.CreatedDate + " " +
                        rp.Rating).ToLower().Contains(param.SearchQuery.ToLower()));
                }
                if (param.Filter != null)
                {
                    if (param.Filter.FromRating.HasValue)
                    {
                        collection = collection.Where(rp => rp.Rating > param.Filter.FromRating.Value);
                    }
                    if (param.Filter.ToRating.HasValue)
                    {
                        collection = collection.Where(rp => rp.Rating < param.Filter.ToRating.Value);
                    }
                    if (param.Filter.FromDate.HasValue)
                    {
                        collection = collection.Where(rp => rp.CreatedDate > param.Filter.FromDate.Value);
                    }
                    if (param.Filter.ToDate.HasValue)
                    {
                        collection = collection.Where(rp => rp.CreatedDate < param.Filter.ToDate.Value);
                    }
                }
                if (param.SortProperty != null)
                {
                    if (param.SortProperty.KeyName.Equals(nameof(ReviewPlaceEntity.CreatedDate), StringComparison.OrdinalIgnoreCase))
                    {
                        collection = param.SortProperty.IsASC ? collection.OrderBy(rp => rp.CreatedDate) : collection.OrderByDescending(rp => rp.CreatedDate);
                    }
                    else if (param.SortProperty.KeyName.Equals(nameof(ReviewPlaceEntity.Rating), StringComparison.OrdinalIgnoreCase))
                    {
                        collection = param.SortProperty.IsASC ? collection.OrderBy(rp => rp.Rating) : collection.OrderByDescending(rp => rp.Rating);
                    }
                }
                var pagedList = await PagedList<ReviewPlaceDetailResponseDto>.ToPagedListAsync(
                    source: collection.Select(item => new ReviewPlaceDetailResponseDto
                    {
                        ReviewPlaceId = item.Id,
                        PlaceId = item.PlaceId,
                        Comment = item.Comment,
                        CreatedDate = item.CreatedDate,
                        Rating = item.Rating,
                        IsOwner = currentUser != null && currentUser.Id == item.UserId,
                        OwnerProperty = new OwnerProperty()
                        {
                            Avatar = item.User.Avatar,
                            Email = item.User.Email ?? string.Empty,
                            FullName = item.User.FullName,
                            UserId = item.UserId
                        }
                    }),
                    pageNumber: param.PageNumber,
                    pageSize: param.PageSize);

                var data = new BasePagedResult<ReviewPlaceDetailResponseDto>()
                {
                    CurrentPage = pagedList.CurrentPage,
                    Items = pagedList,
                    PageSize = pagedList.PageSize,
                    TotalItems = pagedList.TotalCount,
                    TotalPages = pagedList.TotalPages,
                    ObjFilterProperties = param.Filter,
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
        #endregion review place paging

        #region get review place by id
        public async Task<ApiResponse<ReviewPlaceDetailResponseDto>> GetReviewPlaceByIdAsync(Guid reviewPlaceId)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ReviewPlaceDetailResponseDto>();
            try
            {
                var reviewPlaceEntity = await _dbContext.ReviewPlaces.Include(rp => rp.User).Where(rp => rp.Id == reviewPlaceId).FirstOrDefaultAsync();
                if (reviewPlaceEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                var data = new ReviewPlaceDetailResponseDto
                {
                    ReviewPlaceId = reviewPlaceEntity.Id,
                    PlaceId = reviewPlaceEntity.PlaceId,
                    Comment = reviewPlaceEntity.Comment,
                    CreatedDate = reviewPlaceEntity.CreatedDate,
                    Rating = reviewPlaceEntity.Rating,
                    OwnerProperty = new OwnerProperty()
                    {
                        Avatar = reviewPlaceEntity.User.Avatar,
                        Email = reviewPlaceEntity.User.Email ?? string.Empty,
                        FullName = reviewPlaceEntity.User.FullName,
                        UserId = reviewPlaceEntity.UserId
                    }
                };
                response.Result.Data = data;
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status200OK;
                return response;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
        #endregion get review place by id

        #region create review place
        public async Task<ApiResponse<ResultMessage>> CreateReviewPlaceAsync(CreateReviewPlaceRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ResultMessage>();
            if (requestDto == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Dữ liệu gửi về không hợp lệ. Vui lòng kiểm tra lại.",
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
            var placeEntity = await _dbContext.Places.FindAsync(requestDto.PlaceId);
            if (placeEntity == null)
            {
                return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
            }
            var currentUser = RuntimeContext.CurrentUser;
            if (currentUser == null)
            {
                return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
            }
            try
            {
                var reviewPlaceEntity = requestDto.Adapt<ReviewPlaceEntity>();
                reviewPlaceEntity.UserId = currentUser.Id;
                _dbContext.ReviewPlaces.Add(entity: reviewPlaceEntity);
                await _dbContext.SaveChangesAsync();
                var placeRating = await _dbContext.ReviewPlaces.Where(c => c.PlaceId == requestDto.PlaceId)
                    .AverageAsync(c => c.Rating);
                placeEntity.Rating = placeRating;
                _dbContext.Places.Update(entity: placeEntity);
                await _dbContext.SaveChangesAsync();
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Đánh giá địa điểm thành công",
                    NotificationType = CNotificationType.Place
                };
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status201Created;
                return response;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
        #endregion create review place

        #region Update review place
        public async Task<ApiResponse<ResultMessage>> UpdateReviewPlaceAsync(UpdateReviewPlaceRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<ResultMessage>();
            if (requestDto == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Dữ liệu gửi về không hợp lệ. Vui lòng kiểm tra lại.",
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
            var currentUser = RuntimeContext.CurrentUser;
            if (currentUser == null)
            {
                return await ResponseHelper.UnauthenticationResponseAsync(errors: errors, response: response);
            }
            try
            {
                var reviewPlaceEntity = await _dbContext.ReviewPlaces.FindAsync(requestDto.ReviewPlaceId);
                if (reviewPlaceEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                bool hasAdminRole = (await _userManager.GetRolesAsync(user: currentUser)).Contains(CRoleType.Admin.ToString());
                bool isOwnerReview = reviewPlaceEntity.UserId == currentUser.Id;
                if (!(isOwnerReview || hasAdminRole))
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Bạn không có quyền để thực hiện việc thay đổi bình luận này",
                        ErrorScope = CErrorScope.PageSumarry
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status403Forbidden;
                    return response;
                }
                reviewPlaceEntity.Comment = requestDto.Comment;
                reviewPlaceEntity.Rating = requestDto.Rating;
                _dbContext.ReviewPlaces.Update(entity: reviewPlaceEntity);
                await _dbContext.SaveChangesAsync();
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Cập nhật đánh giá địa điểm thành công.",
                    NotificationType = CNotificationType.Place
                };
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status202Accepted;
                return response;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
        #endregion Update review place

        #region Delete review place
        public async Task<ApiResponse<ResultMessage>> DeleteReviewPlaceAsyn(Guid reviewPlaceId)
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
                var reviewPlaceEntity = await _dbContext.ReviewPlaces.FindAsync(reviewPlaceId);
                if (reviewPlaceEntity == null)
                {
                    return await ResponseHelper.NotFoundErrorAsync(errors: errors, response: response);
                }
                bool hasAdminRole = (await _userManager.GetRolesAsync(user: currentUser)).Contains(CRoleType.Admin.ToString());
                bool isOwnerReview = reviewPlaceEntity.UserId == currentUser.Id;
                if (!(isOwnerReview || hasAdminRole))
                {
                    errors.Add(new ErrorDetail()
                    {
                        Error = $"Bạn không có quyền để thực hiện việc thay đổi bình luận này",
                        ErrorScope = CErrorScope.PageSumarry
                    });
                    response.Result.Errors.AddRange(errors);
                    response.Result.Success = false;
                    response.StatusCode = StatusCodes.Status403Forbidden;
                    return response;
                }
                _dbContext.ReviewPlaces.Remove(entity: reviewPlaceEntity);
                await _dbContext.SaveChangesAsync();
                response.Result.Data = new ResultMessage()
                {
                    Level = CNotificationLevel.Success,
                    Message = $"Xóa đánh giá địa điểm thành công.",
                    NotificationType = CNotificationType.Place
                };
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status202Accepted;
                return response;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }
        #endregion Delete review place

        // public async Task<List<ReviewPlaceDto>> GetReviewPlaceByIdAsync(Guid placeId)
        // {
        //     var result = await _dbContext.ReviewPlaces.Where(x => x.PlaceId == placeId).ToListAsync();
        //     if (result.IsNullOrEmpty())
        //     {
        //         _logger.LogWarning($"No review exist for PlaceId: {placeId}");
        //         return new List<ReviewPlaceDto>();
        //     }
        //     return result.Adapt<List<ReviewPlaceDto>>();
        // }
    }

}