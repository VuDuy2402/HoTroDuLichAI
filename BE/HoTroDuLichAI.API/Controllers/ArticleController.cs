using Microsoft.AspNetCore.Authorization;
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
            param.IsPublic = true;
            var result = await _articleService.GetWithPagingAsync(param: param);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("manage/paging")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> GetWithPagingManage(ArticlePagingAndFilterParams param)
        {
            param.IsAdmin = true;
            var result = await _articleService.GetWithPagingAsync(param: param, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("my/paging")]
        [Authorize(Roles = $"{RoleDescription.NormalUser}, {RoleDescription.Business}")]
        public async Task<IActionResult> GetWithPagingMy(ArticlePagingAndFilterParams param)
        {
            param.IsMy = true;
            var result = await _articleService.GetWithPagingAsync(param: param, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpGet("manage/{articleId}")]
        public async Task<IActionResult> GetArticleById(Guid articleId)
        {
            var result = await _articleService.GetArticleDetailByIdAsync(articleId: articleId);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("requestcreatearticle")]
        [Authorize(Roles = RoleDescription.NormalUser)]

        public async Task<IActionResult> CreateArticle(CreateArticleRequestDto requestDto)
        {
            var result = await _articleService.CreateArticleAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("manage/approverequestcreatearticle")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> ApprovalRequestCreateArticle(ApproveCreateArticleRequestDto requestDto)
        {
            var result = await _articleService.ApprovalRequestCreateArticleAsync(requestDto: requestDto);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("manage/requestnewarticle/paging")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> GetRequestNewArticleWithPaging(ArticlePagingAndFilterParams param)
        {
            param.IsRequestNewArticle = true;
            var result = await _articleService.GetWithPagingAsync(param: param);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPut("manage")]
        [Authorize(Roles = RoleDescription.NormalUser)]
        public async Task<IActionResult> UpdateArticle(UpdateArticleRequestDto requestDto)
        {
            requestDto.IsAdmin = true;
            var result = await _articleService.UpdateArticleAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPut("my")]
        [Authorize(Roles = RoleDescription.NormalUser)]
        public async Task<IActionResult> UpdateMyArticle(UpdateArticleRequestDto requestDto)
        {
            requestDto.IsAdmin = false;
            var result = await _articleService.UpdateArticleAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpDelete("manage/{articleId}")]
        public async Task<IActionResult> DeleteArticle(Guid articleId)
        {
            var result = await _articleService.DeleteArticleAsync(articleId: articleId);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

    }
}