using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public class ErrorHelper
    {
        public static List<ErrorDetail> GetModelStateError(ModelStateDictionary? modelState)
        {
            if (modelState == null)
            {
                return new();
            }
            if (modelState.IsValid)
            {
                return new();
            }
            else
            {
                return modelState.Keys
                    .SelectMany(key => modelState[key]!.Errors.Select(x => new ErrorDetail
                    {
                        ErrorScope = CErrorScope.Field,
                        Field = $"{key}_Error",
                        Error = x.ErrorMessage
                    }))
                    .ToList();
            }
        }

        public static ApiResponse<T>? GetReportError<T>(ReportRequestDto requestDto)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<T>();
            if (requestDto == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Dữ liệu gửi về không hợp lệ. Vui lòng kiểm tra lại.",
                    ErrorScope = CErrorScope.FormSummary
                });
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                response.StatusCode = StatusCodes.Status400BadRequest;
                return response;
            }
            if (requestDto.FromDate > DateTimeOffset.UtcNow)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Ngày bắt đầu phải nhỏ hơn hiện tại.",
                    ErrorScope = CErrorScope.Field,
                    Field = $"{nameof(requestDto.FromDate)}_Error"
                });
            }
            if (requestDto.ToDate > DateTimeOffset.UtcNow)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Ngày kết thúc phải nhỏ hơn hiện tại",
                    ErrorScope = CErrorScope.Field,
                    Field = $"{nameof(requestDto.ToDate)}_Error"
                });
            }
            if (requestDto.FromDate > requestDto.ToDate)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Ngày bắt đầu không thể lớn hơn ngày kết thúc.",
                    ErrorScope = CErrorScope.FormSummary
                });
            }
            if (!errors.IsNullOrEmpty())
            {
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                response.StatusCode = StatusCodes.Status400BadRequest;
                return response;
            }
            return null;
        }
    }
}