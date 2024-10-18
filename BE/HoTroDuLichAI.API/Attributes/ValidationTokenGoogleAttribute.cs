using System.ComponentModel.DataAnnotations;
using Google.Apis.Auth;

namespace HoTroDuLichAI.API
{
    public class ValidationTokenGoogleAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var _logger = (ILogger<AuthService>?)validationContext.GetService(typeof(ILogger<AuthService>));
            if (_logger == null)
            {
                return new ValidationResult("Đã có lỗi xảy ra trong quá trình get service required.");
            }
            var googleToken = value as string;

            if (string.IsNullOrEmpty(googleToken))
            {
                return new ValidationResult("Google token không được để trống.");
            }

            var googleSetting = RuntimeContext.AppSettings.GoogleSetting ?? new();
            if (string.IsNullOrEmpty(googleSetting.ClientSecret) || string.IsNullOrEmpty(googleSetting.WebClientId)
                || string.IsNullOrEmpty(googleSetting.UserInfoUrl) || string.IsNullOrEmpty(googleSetting.TokenInfoUrl))
            {
                return new ValidationResult("Không tìm thấy thông tin xác thực cho ứng dụng.");
            }

            try
            {
                // Try to get payload from idtoken
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { googleSetting.WebClientId },
                };

                var payload = GoogleJsonWebSignature.ValidateAsync(googleToken, settings).Result;
                return ValidationResult.Success;
            }
            catch (Exception ex)
            {
                try
                {
                    HttpClient client = new HttpClient();
                    HttpResponseMessage response = client.GetAsync($"{googleSetting.TokenInfoUrl}{googleToken}").Result;

                    if (response.IsSuccessStatusCode)
                    {
                        var content = response.Content.ReadAsStringAsync().Result;
                        var tokenInfo = content.FromJson<TokenInfoRequestDto>() ?? new();

                        if (tokenInfo.Audience == googleSetting.WebClientId)
                        {
                            return ValidationResult.Success;
                        }
                        else
                        {
                            return new ValidationResult("Token google không hợp lệ.");
                        }
                    }
                    else
                    {
                        return new ValidationResult("Token google không hợp lệ.");
                    }
                }
                catch (Exception ex1)
                {
                    _logger.LogError($"Internal Server Error : Failed to get user info from Google Access token.\nTrace Log : {ex.Message}{ex1.Message}");
                    return new ValidationResult("Token google không hợp lệ.");
                }
            }
        }
    }
}