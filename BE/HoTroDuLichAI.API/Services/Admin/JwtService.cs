using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace HoTroDuLichAI.API
{
    internal class JwtService : IJwtService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly UserManager<UserEntity> _userManager;
        private readonly ILogger<JwtService> _logger;

        public JwtService(
            HoTroDuLichAIDbContext dbContext,
            UserManager<UserEntity> userManager,
            ILogger<JwtService> logger)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _logger = logger;
        }


        public async Task<JwtTokenDto> GenerateJwtTokenAsync(UserEntity userEntity, string ipAddress)
        {
            var accessToken = await GenerateJwtAccessTokenAsync(userEntity: userEntity);
            var refreshToken = await GenerateJwtRefreshTokenAsync(userEntity: userEntity, ipAddress: ipAddress, accessToken: accessToken);
            return new JwtTokenDto()
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        public async Task<string> GenerateJwtAccessTokenAsync(UserEntity userEntity)
        {
            var securityKey = new SymmetricSecurityKey(key: Encoding.UTF8.GetBytes(RuntimeContext.AppSettings.JwtSetting.SecretKey));
            var credentials = new SigningCredentials(key: securityKey, algorithm: SecurityAlgorithms.HmacSha256);
            var userClaims = new List<Claim>()
            {
                new Claim(type: ClaimTypes.NameIdentifier, value: userEntity.Id.ToString()),
                new Claim(type: ClaimTypes.Name, value: userEntity.UserName ?? string.Empty),
                new Claim(type: ClaimTypes.Email, value: userEntity.Email ?? string.Empty)
            };
            var userRoles = await _userManager.GetRolesAsync(user: userEntity);
            if (!userRoles.IsNullOrEmpty())
            {
                foreach (var role in userRoles)
                {
                    userClaims.Add(new Claim(type: ClaimTypes.Role, value: role));
                }
            }
            var now = DateTime.UtcNow;
            var token = new JwtSecurityToken(
                issuer: RuntimeContext.AppSettings.JwtSetting.Issuer,
                audience: RuntimeContext.AppSettings.JwtSetting.Audience,
                claims: userClaims,
                notBefore: now,
                expires: now.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token: token);
        }

        public async Task<string> GenerateJwtRefreshTokenAsync(UserEntity userEntity, string ipAddress, string accessToken)
        {
            var resfreshToken = new UserRefreshTokenEntity()
            {
                UserId = userEntity.Id,
                AccessToken = accessToken,
                ExpireTime = DateTime.UtcNow.AddDays(7),
                RemoteIpAddress = ipAddress
            };

            _dbContext.UserRefreshTokens.Add(resfreshToken);
            await _dbContext.SaveChangesAsync();
            await _userManager.UpdateAsync(user: userEntity);
            return resfreshToken.RefreshToken;
        }
    }
}