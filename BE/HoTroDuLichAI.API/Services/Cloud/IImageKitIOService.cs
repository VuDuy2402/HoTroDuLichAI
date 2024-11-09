using Imagekit.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface IImageKitIOService
    {
        Task<ApiResponse<ImageKitUploadResponseDto>> BulkUploadFilesAsync(ImageKitUploadRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> BulkDeleteFilesAsync(ImageKitDeleteRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<FileInfoBase>> GetFileDetailsAsync(string fileId);
        Task<ApiResponse<AuthParamResponse>> GetAuthAsync();
    }
}