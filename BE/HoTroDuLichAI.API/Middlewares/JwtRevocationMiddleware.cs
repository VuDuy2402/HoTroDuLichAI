using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;

namespace HoTroDuLichAI.API
{
    public class JwtRevocationMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtRevocationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, UserManager<UserEntity> userManager)
        {
            var dbContext = context.RequestServices.GetRequiredService<HoTroDuLichAIDbContext>();

            // Xác thực người dùng.
            var authResult = await context.AuthenticateAsync();

            // Nếu xác thực thành công, tiếp tục xử lý.
            if (authResult.Succeeded)
            {
                // Lấy access token từ header "Authorization".
                var accessToken = GetAccessToken(context);
                if (string.IsNullOrEmpty(accessToken))
                {
                    // Nếu access token không hợp lệ hoặc bị thiếu, trả về lỗi.
                    await WriteErrorResponseAsync(context, StatusCodes.Status401Unauthorized, "Token không hợp lệ hoặc bị thiếu.");
                    return;
                }

                // Lấy claim UserID từ access token.
                var userIdClaim = GetUserIdClaim(accessToken);
                if (userIdClaim == null)
                {
                    // Nếu claim UserID bị thiếu, trả về lỗi.
                    await WriteErrorResponseAsync(context, StatusCodes.Status500InternalServerError, "Lỗi hệ thống.");
                    return;
                }

                // Lấy refresh token của người dùng từ cơ sở dữ liệu.
                var userRefreshToken = await GetUserRefreshTokenAsync(dbContext, accessToken, userIdClaim.Value);
                if (userRefreshToken == null)
                {
                    // Nếu refresh token bị thiếu, trả về lỗi.
                    await WriteErrorResponseAsync(context, StatusCodes.Status401Unauthorized, "Token không tồn tại.");
                    return;
                }

                // Lấy thông tin người dùng từ cơ sở dữ liệu.
                var user = await userManager.FindByIdAsync(userIdClaim.Value);

                // Kiểm tra nếu token đã bị thu hồi.
                if (user != null && userRefreshToken.LastRevoked > GetTokenValidFrom(accessToken))
                {
                    // Nếu token đã bị thu hồi, trả về lỗi.
                    await WriteErrorResponseAsync(context, StatusCodes.Status401Unauthorized, "Token đã bị thu hồi.");
                    return;
                }
            }

            // Chuyển quyền điều khiển cho middleware tiếp theo trong pipeline.
            await _next(context);
        }

        // Phương thức này lấy access token từ header "Authorization".
        private string GetAccessToken(HttpContext context)
        {
            // Lấy token từ header "Authorization"
            if (context.Request.Headers.TryGetValue("Authorization", out var accessTokenValue)
                && accessTokenValue.ToString().StartsWith("Bearer "))
            {
                return accessTokenValue.ToString().Substring("Bearer ".Length).Trim();
            }

            // Lấy token từ query string
            var accessTokenFromQuery = context.Request.Query["access_token"].FirstOrDefault();
            if (!string.IsNullOrEmpty(accessTokenFromQuery))
            {
                return accessTokenFromQuery;
            }

            // Nếu không tìm thấy token trong cả header "Authorization" và query string, trả về null.
            return string.Empty;
        }

        // Phương thức này lấy claim UserID từ access token.
        private Claim? GetUserIdClaim(string accessToken)
        {
            var handler = new JsonWebTokenHandler();
            var jsonToken = handler.ReadJsonWebToken(accessToken);
            return jsonToken.Claims
                .FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
        }

        // Phương thức này lấy refresh token của người dùng từ cơ sở dữ liệu.
        private async Task<UserRefreshTokenEntity?> GetUserRefreshTokenAsync(
            HoTroDuLichAIDbContext dbContext,
            string accessToken, string userId)
        {
            return await dbContext.UserRefreshTokens
                .FirstOrDefaultAsync(usr =>
                    usr.AccessToken == accessToken
                    && usr.UserId.ToString() == userId);
        }

        // Phương thức này lấy thời gian hợp lệ từ của token.
        private DateTime GetTokenValidFrom(string accessToken)
        {
            var handler = new JsonWebTokenHandler();
            var jsonToken = handler.ReadJsonWebToken(accessToken);
            return jsonToken.ValidFrom;
        }

        // Phương thức này ghi thông báo lỗi.
        private async Task WriteErrorResponseAsync(HttpContext context, int statusCode, string message)
        {
            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";
            var errorResponse = new { error = message };
            await context.Response.WriteAsync(errorResponse.ToJson());
        }

    }
}