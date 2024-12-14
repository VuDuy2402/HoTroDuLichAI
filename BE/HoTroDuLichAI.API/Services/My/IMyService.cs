using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface IMyService
    {
        Task<ApiResponse<MyBaseProfileResponseDto>> GetMyBaseProfileAsync();
        Task<ApiResponse<MyProfileDetailResponseDto>> GetMyProfileAsync();
        Task<ApiResponse<MyProfileDetailResponseDto>> UpdateMyImagesAsync(UpdateMyImageRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<MyProfileDetailResponseDto>> UpdateMyProfileAsync(UpdateMyProfileRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<BusinessMoreInfoResponseDto>> GetMyBusinessAsync();
    }
}