using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI.API
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRoleService, RoleService>();

            services.AddScoped<IPlaceService, PlaceService>();
            services.AddScoped<IArticleService, ArticleService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IItineraryService, ItineraryService>();
            services.AddScoped<IReviewPlaceService, ReviewPlaceSerice>();
            services.AddScoped<IBusinessService, BusinessService>();

            services.AddScoped<IMyService, MyService>();
            services.AddScoped<IImageKitIOService, ImageKitIOService>();

            services.AddScoped<IChatService, ChatService>();
            return services;
        }


        public static IApplicationBuilder MapRuntimeContext(this IApplicationBuilder app)
        {
            RuntimeContext.ServiceProvider = app.ApplicationServices;
            app.Use(async (context, next) =>
            {
                // Set current user and user ID in RuntimeContext
                var userManager = context.RequestServices.GetRequiredService<UserManager<UserEntity>>();
                var dbContext = context.RequestServices.GetRequiredService<HoTroDuLichAIDbContext>();
                var httpContextAccessor = context.RequestServices.GetRequiredService<IHttpContextAccessor>();
                var env = context.RequestServices.GetRequiredService<IWebHostEnvironment>();
                Guid.TryParse(httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value, out Guid userId);
                var linkHelper = await dbContext.LinkHelpers.FirstOrDefaultAsync();
                if (linkHelper != null)
                {
                    RuntimeContext.LinkHelper = linkHelper;
                }

                if (userId != Guid.Empty)
                {
                    var user = await userManager.FindByIdAsync(userId.ToString());
                    RuntimeContext.CurrentUser = user;
                    RuntimeContext.CurrentUserId = userId;
                }
                var httpRequest = httpContextAccessor.HttpContext?.Request;
                if (httpRequest != null && httpRequest.Headers.TryGetValue("Authorization", out var accessTokenValue) &&
                    accessTokenValue.ToString().StartsWith("Bearer "))
                {
                    RuntimeContext.CurrentAccessToken = accessTokenValue.ToString().Substring("Bearer ".Length).Trim();
                }
                else
                {
                    RuntimeContext.CurrentAccessToken = httpRequest?.Query["access_token"].FirstOrDefault() ?? string.Empty;
                }

                await next.Invoke();
            });
            return app;
        }

        public static IApplicationBuilder MapJwtRevocation(this IApplicationBuilder app)
        {
            app.UseMiddleware<JwtRevocationMiddleware>();
            return app;
        }
    }
}