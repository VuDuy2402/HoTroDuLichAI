using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HoTroDuLichAI.API
{
    [ApiController]
    [Route("/api/v1/admin/user")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger, IUserService userService)
        {
            _logger = logger;
            _userService = userService;
        }


        #region Roles of user
        [HttpGet("roles")]
        [Authorize]
        public async Task<IActionResult> GetUserRoles()
        {
            var roles = User.FindAll(ClaimTypes.Role).Select(role => Enum.Parse<CRoleType>(role.Value)).ToList();
            return Ok(await Task.FromResult(new { Success = true, Data = roles}));
        }

        [HttpPost("roles")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> AddRoles(AddUserRolesRequestDto requestDto)
        {
            var result = await _userService.AddUserRolesAsync(requestDto: requestDto, ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPut("roles")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> UpdateRoles(UpdateUserRolesRequestDto requestDto)
        {
            var result = await _userService.UpdateUserRolesAsync(requestDto: requestDto, ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpDelete("roles")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> RemoveRoles(RemoveUserRolesRequestDto requestDto)
        {
            var result = await _userService.RemoveUserRolesAsync(requestDto: requestDto, ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }
        #endregion


    }
}