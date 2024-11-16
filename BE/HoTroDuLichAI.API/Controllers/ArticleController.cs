using Microsoft.AspNetCore.Mvc;

namespace HoTroDuLichAI.API
{
    [ApiController]
    [Route("/api/v1/notification/article")]
    public class ArticleController : ControllerBase
    {
        private readonly IArticleService _articleService;

        public ArticleController(
            IArticleService articleService
        )
        {
            _articleService = articleService;
        }

        [HttpPost("paging")]
        public async Task<IActionResult> GetWithPaging(ArticlePagingAndFilterParams param)
        {
            var result = await _articleService.GetWithPagingAsync(param: param);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }
    }
}