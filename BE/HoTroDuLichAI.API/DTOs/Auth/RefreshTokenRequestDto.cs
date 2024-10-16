
using System.ComponentModel.DataAnnotations;
using HoTroDuLichAI.API;

namespace HoTroDuLichAI.API
{
    public class RefreshTokenRequestDto
    {
        [Required(ErrorMessage = "{0} is required.")]
        [GuidFormat]
        public string RefreshToken { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
    }
}