using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI.API
{
    [ApiController]
    [Route("/api/v1/admin/linkhelper")]
    public class LinkHelperController : ControllerBase
    {
        private readonly ILogger<LinkHelperController> _logger;
        private readonly HoTroDuLichAIDbContext _dbContext;

        public LinkHelperController(
            HoTroDuLichAIDbContext dbContext,
            ILogger<LinkHelperController> logger)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        [HttpGet]
        // [Authorize]
        public async Task<IActionResult> GetLinkHelpers()
        {
            var a = RuntimeContext.CurrentAccessToken;
            return Ok(await _dbContext.LinkHelpers.ToListAsync());
        }


        // [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddUrlEndpoint(LinkHelperRequestDto linkHelper)
        {
            try
            {
                var urlHelpers = await _dbContext.LinkHelpers.FirstOrDefaultAsync();
                if (urlHelpers == null)
                {
                    await _dbContext.LinkHelpers.AddAsync(entity: new LinkHelperEntity()
                    {
                        AppEndpoint = linkHelper.AppEndpoint,
                        ConfirmResetPasswordRoute = linkHelper.ConfirmResetPasswordRoute
                    });
                    await _dbContext.SaveChangesAsync();
                }
                else
                {
                    MapDtoToEntity<LinkHelperRequestDto, LinkHelperEntity>(dto: linkHelper, entity: urlHelpers);
                    _dbContext.LinkHelpers.Update(entity: urlHelpers);
                    await _dbContext.SaveChangesAsync();
                }
                return Ok($"Add link successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(statusCode: StatusCodes.Status500InternalServerError, $"An error occured while add link.");
            }
        }

        private static void MapDtoToEntity<TDto, TEntity>(TDto dto, TEntity entity)
        {
            var dtoProperties = typeof(TDto).GetProperties();
            var entityProperties = typeof(TEntity).GetProperties();

            foreach (var dtoProperty in dtoProperties)
            {
                var entityProperty = entityProperties.FirstOrDefault(p => p.Name == dtoProperty.Name);
                if (entityProperty != null && entityProperty.CanWrite)
                {
                    var dtoValue = dtoProperty.GetValue(dto);
                    if (dtoValue != null && !string.IsNullOrEmpty(dtoValue.ToString()))
                    {
                        entityProperty.SetValue(entity, dtoValue);
                    }
                }
            }
        }
    }

    public class LinkHelperRequestDto
    {
        public string AppEndpoint { get; set; } = string.Empty;
        public string ClientAppEndpoint { get; set; } = string.Empty;
        public string ConfirmResetPasswordRoute { get; set; } = string.Empty;
    }
}