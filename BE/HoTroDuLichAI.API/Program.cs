using HoTroDuLichAI.API;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Microsoft.ML;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ValidIssuer = RuntimeContext.AppSettings.JwtSetting.Issuer,
        ValidAudience = RuntimeContext.AppSettings.JwtSetting.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(RuntimeContext.AppSettings.JwtSetting.SecretKey))
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chatHub"))
            {
                context.Token = accessToken;
            }
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/notificationHub"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            var jwt = context.SecurityToken as JsonWebToken;
            if (jwt == null)
            {
                context.Fail("Token không hợp lệ");
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Description = "Vui lòng nhập token của bạn theo định dạng sau: ''Bearer Token_Cua_Ban''",
        Type = SecuritySchemeType.ApiKey,
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();

    options.SwaggerDoc("v1", new OpenApiInfo()
    {
        Version = "v1",
        Title = "Hỗ trợ du lịch bằng AI",
        Description = ".NET API",
        Contact = new OpenApiContact()
        {
            Name = "Nguyen Vu Duy",
            Url = new Uri("https://www.youtube.com")
        }
    });

    options.EnableAnnotations();

    // var xmlFileName = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    // var path = Path.Combine(AppContext.BaseDirectory, xmlFileName);
    // options.IncludeXmlComments(path);
});

builder.Services.AddServices();

builder.Services.AddDbContext<HoTroDuLichAIDbContext>(db =>
{
    db.UseSqlServer(connectionString: builder.Configuration["AppSettings:ConnectionStrings:DefaultConnection"]);
});

builder.Services.AddDataProtection();

builder.Services.AddIdentityCore<UserEntity>(options =>
{
    options.SignIn.RequireConfirmedEmail = true;
})
.AddRoles<RoleEntity>()
.AddEntityFrameworkStores<HoTroDuLichAIDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddScoped<UserManager<UserEntity>>();
builder.Services.AddScoped<RoleManager<RoleEntity>>();
builder.Services.Configure<ApiBehaviorOptions>(opt =>
{
    opt.SuppressModelStateInvalidFilter = true;
});

builder.Services.AddSignalR();

builder.Services.AddSingleton<MLContext>();
builder.Services.AddSingleton(serviceProvider =>
{
    var mlContext = serviceProvider.GetRequiredService<MLContext>();
    var modelPath = Path.Combine($"{Directory.GetCurrentDirectory()}", "AITraining\\Data\\TrainingData.zip");
    return mlContext.Model.Load(modelPath, out var modelInputSchema);
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(cor =>
{
    cor.AllowAnyHeader()
        .AllowAnyMethod()
        .WithOrigins("http://localhost:5173")
        .AllowCredentials();
});

app.UseHttpsRedirection();

app.MapControllers();

app.UseAuthentication();

app.MapJwtRevocation();

app.UseAuthorization();

app.MapRuntimeContext();

app.MapHub<ChatHub>("/chatHub");
app.MapHub<NotificationHub>("/notificationHub");

app.Run();