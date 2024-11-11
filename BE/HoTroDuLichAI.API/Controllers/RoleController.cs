using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HoTroDuLichAI.API.Controllers
{
    [ApiController]
    [Route("/api/v1/admin/role")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(
            IRoleService roleService
        )
        {
            _roleService = roleService;    
        }

        [HttpPost("paging")]
        public async Task<IActionResult> GetAllRoles(RolePagingAndFilterParams param)
        {
            var result = await _roleService.GetAllRolesAsync(param: param);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost]
        public async Task<IActionResult> AddRoles(CreateRolesRequestDto requestDto)
        {
            var result = await _roleService.CreateRolesAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPut]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> UpdateRoles(UpdateRolesRequestDto requestDto)
        {
            var result = await _roleService.UpdateRolesAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("bulkdelete")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> DeleteRoles(DeleteRolesRequestDto requestDto)
        {
            var result = await _roleService.DeleteRolesAsync(requestDto: requestDto);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpGet("{roleId}")]
        public async Task<IActionResult> GetRoleById(Guid roleId)
        {
            var result = await _roleService.GetRoleByIdAsync(roleId: roleId);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }
    }
}