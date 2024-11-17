namespace HoTroDuLichAI.API
{
    public class ResponseHelper
    {
        public static async Task<ApiResponse<T>> UnauthenticationResponseAsync<T>(List<ErrorDetail> errors, ApiResponse<T> response)
        {
            errors.Add(new ErrorDetail()
            {
                ErrorScope = CErrorScope.PageSumarry,
                Error = "Thông tin xác thực không hợp hệ. Vui lòng đăng nhập lại."
            });
            response.Result.Success = false;
            response.StatusCode = StatusCodes.Status401Unauthorized;
            return await Task.FromResult(response);
        }

        public static async Task<ApiResponse<T>> InternalServerErrorAsync<T>(List<ErrorDetail> errors, ApiResponse<T> response, Exception ex, string? customMessage = null)
        {
            errors.Add(new ErrorDetail()
            {
                ErrorScope = CErrorScope.PageSumarry,
                Error = string.IsNullOrEmpty(customMessage) ? $"Đã có lỗi xảy ra. {ex.Message}" : customMessage
            });
            response.Result.Errors.AddRange(errors);
            response.Result.Success = false;
            response.StatusCode = StatusCodes.Status500InternalServerError;
            return await Task.FromResult(response);
        }

        public static async Task<ApiResponse<T>> NotFoundErrorAsync<T>(List<ErrorDetail> errors, ApiResponse<T> response, string? customMessage = null)
        {
            errors.Add(new ErrorDetail()
            {
                Error = $"Không tìm thấy {customMessage}.",
                ErrorScope = CErrorScope.PageSumarry
            });
            response.Result.Success = false;
            response.Result.Errors.AddRange(errors);
            response.StatusCode = StatusCodes.Status404NotFound;
            return await Task.FromResult(response);
        }

        public static async Task<ApiResponse<T>> BadRequestErrorAsync<T>(List<ErrorDetail> errors, ApiResponse<T> response)
        {
            response.Result.Errors.AddRange(errors);
            response.Result.Success = false;
            response.StatusCode = StatusCodes.Status400BadRequest;
            return await Task.FromResult(response);
        }
    }
}