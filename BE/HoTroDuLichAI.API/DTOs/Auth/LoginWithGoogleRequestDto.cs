using Newtonsoft.Json;

namespace HoTroDuLichAI.API
{
    public class LoginWithGoogleRequestDto
    {
        [ValidationTokenGoogle]
        public string IdToken { get; set; } = string.Empty;
    }


    public class TokenInfoRequestDto
    {
        [JsonProperty("issued_to")]
        public string IssuedTo { get; set; } = string.Empty;

        [JsonProperty("audience")]
        public string Audience { get; set; } = string.Empty;

        [JsonProperty("user_id")]
        public string UserId { get; set; } = string.Empty;

        [JsonProperty("scope")]
        public string Scope { get; set; } = string.Empty;

        [JsonProperty("expires_in")]
        public int ExpiresIn { get; set; }

        [JsonProperty("verified_email")]
        public bool VerifiedEmail { get; set; }

        [JsonProperty("access_type")]
        public string AccessType { get; set; } = string.Empty;
    }

    public class GoogleUserInfoRequestDto
    {
        [JsonProperty("sub")]
        public string Sub { get; set; } = string.Empty;

        [JsonProperty("name")]
        public string Name { get; set; } = string.Empty;

        [JsonProperty("given_name")]
        public string GivenName { get; set; } = string.Empty;

        [JsonProperty("family_name")]
        public string FamilyName { get; set; } = string.Empty;

        [JsonProperty("picture")]
        public string Picture { get; set; } = string.Empty;

        [JsonProperty("email")]
        public string Email { get; set; } = string.Empty;

        [JsonProperty("email_verified")]
        public bool EmailVerified { get; set; }

        [JsonProperty("locale")]
        public string Locale { get; set; } = string.Empty;
    }

    public class UserInfoFromIdTokenGoogle
    {
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Picture { get; set; } = string.Empty;

    }
}