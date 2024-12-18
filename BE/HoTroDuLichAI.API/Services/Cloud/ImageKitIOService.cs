using System.Net.Http.Headers;
using Imagekit.Models;
using Imagekit.Sdk;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public class ImageKitIOService : IImageKitIOService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly ILogger<ImageKitIOService> _logger;
        private readonly ImagekitClient _imageKitClient;

        public ImageKitIOService(
            HoTroDuLichAIDbContext dbContext,
            ILogger<ImageKitIOService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
            _imageKitClient = new ImagekitClient(
                publicKey: RuntimeContext.AppSettings.CloudSetting.ImageKitIO.PublicKey,
                privateKey: RuntimeContext.AppSettings.CloudSetting.ImageKitIO.PrivateKey,
                urlEndPoint: RuntimeContext.AppSettings.CloudSetting.ImageKitIO.UrlEndpoint);
        }
        #region get authentication of image kit
        public async Task<ApiResponse<AuthParamResponse>> GetAuthAsync()
        {
            var response = new ApiResponse<AuthParamResponse>();
            var errors = new List<ErrorDetail>();
            try
            {
                var authParams = _imageKitClient.GetAuthenticationParameters();
                response.Result.Data = authParams;
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status200OK;
                return await Task.FromResult(result: response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                errors.Add(new ErrorDetail()
                {
                    Error = $"Đã có lỗi xảy ra trong quá trình xác thực với ImageKit. {ex.Message}",
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.Result.Errors.AddRange(errors);
                response.StatusCode = StatusCodes.Status500InternalServerError;
                response.Result.Success = false;
                return response;
            }
        }
        #endregion

        public async Task<ApiResponse<FileInfoBase>> GetFileDetailsAsync(string fileId)
        {
            var response = new ApiResponse<FileInfoBase>();
            var errors = new List<ErrorDetail>();

            try
            {
                ResponseMetaData metaData = await _imageKitClient.GetFileDetailAsync(fileId: fileId);

                if (metaData.HttpStatusCode != StatusCodes.Status200OK)
                {
                    response.StatusCode = metaData.HttpStatusCode;
                    response.Result.Success = false;

                    var error = metaData.Raw.FromJson<ErrorGetImageDetailDto>();
                    errors.Add(new ErrorDetail()
                    {
                        Error = error?.Message ?? "Đã có lỗi xảy ra",
                        ErrorScope = CErrorScope.PageSumarry
                    });
                    response.Result.Errors.AddRange(errors);
                    return response;
                }

                var result = metaData.Raw.FromJson<Dictionary<string, object>>();

                if (result == null || !result.ContainsKey("fileType"))
                {
                    response.StatusCode = StatusCodes.Status400BadRequest;
                    response.Result.Success = false;
                    errors.Add(new ErrorDetail()
                    {
                        Error = "Đã có lỗi xảy ra trong quá trình map dữ liệu.",
                        ErrorScope = CErrorScope.PageSumarry
                    });
                    response.Result.Errors.AddRange(errors);
                    return response;
                }

                string fileType = result["fileType"].ToString() ?? string.Empty;
                if (fileType.Equals("non-image", StringComparison.OrdinalIgnoreCase))
                {
                    var videoResult = metaData.Raw.FromJson<VideoFileInfo>();
                    if (videoResult != null)
                    {
                        response.Result.Data = videoResult;
                        response.Result.Success = true;
                        response.StatusCode = StatusCodes.Status200OK;
                    }
                }
                else if (fileType.Equals("image", StringComparison.OrdinalIgnoreCase))
                {
                    var imageResult = metaData.Raw.FromJson<ImageFileInfo>();
                    if (imageResult != null)
                    {
                        response.Result.Data = imageResult;
                        response.Result.Success = true;
                        response.StatusCode = StatusCodes.Status200OK;
                    }
                }
                else
                {
                    response.StatusCode = StatusCodes.Status400BadRequest;
                    response.Result.Success = false;
                    errors.Add(new ErrorDetail()
                    {
                        Error = "Loại file không hợp lệ.",
                        ErrorScope = CErrorScope.PageSumarry
                    });
                    response.Result.Errors.AddRange(errors);
                    return response;
                }

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                errors.Add(new ErrorDetail()
                {
                    Error = $"Đã có lỗi xảy ra trong quá trình lấy thông tin file: {fileId} từ ImageKit. Error: {ex.Message}",
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                response.StatusCode = StatusCodes.Status500InternalServerError;
                return response;
            }
        }

        #region Upload files image kit
        public async Task<ApiResponse<ImageKitUploadResponseDto>> BulkUploadFilesAsync(ImageKitUploadRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            var response = new ApiResponse<ImageKitUploadResponseDto>();
            var errors = new List<ErrorDetail>();
            var infos = new List<ImageUploadInfo>();

            try
            {
                infos = await UploadFilesAsync(files: requestDto.Files);
                response.Result.Data = new ImageKitUploadResponseDto() { ImageInfos = infos };
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status202Accepted;
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error: {ex.Message}");
                if (ex.InnerException != null)
                {
                    _logger.LogError($"Inner Exception: {ex.InnerException.Message}.");
                }
                errors.Add(new ErrorDetail()
                {
                    Error = $"Đã có lỗi xảy ra trong quá trình upload file với ImageKit. Error : {ex.Message}",
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.Result.Success = false;
                response.Result.Errors.AddRange(errors);
                response.StatusCode = StatusCodes.Status500InternalServerError;
                return response;
            }
        }
        #endregion

        #region  Delete files image kit
        public async Task<ApiResponse<ResultMessage>> BulkDeleteFilesAsync(ImageKitDeleteRequestDto requestDto,
            ModelStateDictionary? modelState = null)
        {
            var response = new ApiResponse<ResultMessage>();
            var errors = new List<ErrorDetail>();
            if (requestDto.FileIds.IsNullOrEmpty())
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"{nameof(requestDto.FileIds)} không được để trống.",
                    ErrorScope = CErrorScope.Field,
                    Field = $"{nameof(requestDto.FileIds)}_Error"
                });
                response.Result.Success = false;
                response.StatusCode = StatusCodes.Status400BadRequest;
                response.Result.Errors.AddRange(errors);
                return response;
            }
            try
            {
                var result = await _imageKitClient.BulkDeleteFilesAsync(fileIds: requestDto.FileIds);
                response.StatusCode = result.HttpStatusCode;
                response.Result.Data = new ResultMessage()
                {
                    Level = result.SuccessfullyDeletedfileIds.Count() > 0 ? CNotificationLevel.Success
                        : result.MissingfileIds.Count == requestDto.FileIds.Count
                            ? CNotificationLevel.Error : CNotificationLevel.Warning,
                    Message = $"Đã xóa thành công : {result.SuccessfullyDeletedfileIds.Count}. Xóa không thành công : {result.MissingfileIds.Count}.",
                    NotificationType = CNotificationType.Normal
                };
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                response.Result.Success = false;
                errors.Add(new ErrorDetail()
                {
                    Error = $"Đã có lỗi xảy ra trong quá trình delete file với ImageKit. Error : {ex.Message}",
                    ErrorScope = CErrorScope.PageSumarry
                });
                response.Result.Errors.AddRange(errors);
                response.StatusCode = StatusCodes.Status500InternalServerError;
                return response;
            }
        }
        #endregion

        private string FormatFileSize(int bytes)
        {
            const long KB = 1024;
            const long MB = KB * 1024;
            const long GB = MB * 1024;

            if (bytes >= GB)
            {
                return $"{bytes / (double)GB:F2} GB";
            }
            else if (bytes >= MB)
            {
                return $"{bytes / (double)MB:F2} MB";
            }
            else if (bytes >= KB)
            {
                return $"{bytes / (double)KB:F2} KB";
            }
            else
            {
                return $"{bytes} Bytes";
            }
        }


        private async Task<List<ImageUploadInfo>> UploadFilesAsync(List<IFormFile> files)
        {
            var client = new HttpClient();
            List<ImageUploadInfo> imageFiles = new List<ImageUploadInfo>();
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri("https://upload.imagekit.io/api/v2/files/upload"),
                Headers =
                {
                    { "Accept", "application/json" },
                    { "Authorization", "Basic cHJpdmF0ZV9oVXhmcUR6YnliRitnUXRsSXZraWtYdUNIVUk9Og==" },
                },
                Content = new MultipartFormDataContent()
            };

            foreach (var file in files)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    var fileContent = new ByteArrayContent(memoryStream.ToArray());

                    fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);

                    fileContent.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
                    {
                        Name = "file",
                        FileName = file.FileName
                    };

                    ((MultipartFormDataContent)request.Content).Add(fileContent, "file");
                }

                ((MultipartFormDataContent)request.Content).Add(new StringContent(file.FileName), "fileName");
                ((MultipartFormDataContent)request.Content).Add(new StringContent("true"), "useUniqueFileName");
                ((MultipartFormDataContent)request.Content).Add(new StringContent("true"), "isPublished");

                ((MultipartFormDataContent)request.Content).Add(new StringContent(""), "tags");
                ((MultipartFormDataContent)request.Content).Add(new StringContent(""), "folder");
                ((MultipartFormDataContent)request.Content).Add(new StringContent(""), "isPrivateFile");
                ((MultipartFormDataContent)request.Content).Add(new StringContent(""), "customCoordinates");
                ((MultipartFormDataContent)request.Content).Add(new StringContent(""), "responseFields");
                ((MultipartFormDataContent)request.Content).Add(new StringContent(""), "extensions");
                ((MultipartFormDataContent)request.Content).Add(new StringContent(""), "webhookUrl");
                ((MultipartFormDataContent)request.Content).Add(new StringContent(""), "overwriteFile");
                ((MultipartFormDataContent)request.Content).Add(new StringContent(""), "overwriteAITags");
                ((MultipartFormDataContent)request.Content).Add(new StringContent(""), "overwriteTags");
                ((MultipartFormDataContent)request.Content).Add(new StringContent(""), "overwriteCustomMetadata");
                ((MultipartFormDataContent)request.Content).Add(new StringContent(""), "transformation");
                ((MultipartFormDataContent)request.Content).Add(new StringContent(""), "checks");
            }

            using (var response = await client.SendAsync(request))
            {
                if (response.IsSuccessStatusCode)
                {
                    var body = await response.Content.ReadAsStringAsync();
                    imageFiles.Add(body.FromJson<ImageUploadInfo>());
                }
                else
                {
                    var errorBody = await response.Content.ReadAsStringAsync();
                    throw new Exception(errorBody);
                }
            }
            return imageFiles;
        }
    }
}