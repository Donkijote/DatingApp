using System.Linq;
using System.Threading.Tasks;
using DatingApp_api.Dtos;
using DatingApp_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly UserManager<User> _userManager;
        public AdminController(DataContext dataContext, UserManager<User> userManager)
        {
            _userManager = userManager;
            _dataContext = dataContext;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("userwithroles")]
        public async Task<IActionResult> GetUserWithRoles()
        {
            var userList = await _dataContext.Users.OrderBy(x => x.UserName).Select(user => new
            {
                Id = user.Id,
                UserName = user.UserName,
                Role = (from userRole in user.UserRoles
                        join role in _dataContext.Roles
                        on userRole.RoleId
                        equals role.Id
                        select role.Name).ToList()
            }).ToListAsync();

            return Ok(userList);
        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpGet]
        public async Task<IActionResult> EditUsers(string userName, RoleEditDto roleDto)
        {

            var newAssignment = await AssingRole(userName, roleDto);

            if (newAssignment.Succeeded)
            {
                return NoContent();
            }

            return BadRequest("Error al cambiar roles: " + newAssignment.Errors);
        }

        private async Task<IdentityResult> AssingRole(string userName, RoleEditDto roleDto)
        {
            var user = _userManager.FindByIdAsync(userName).Result;

            var roles = await _userManager.GetRolesAsync(user);

            //var role = _roleManager.FindByIdAsync(roleDto.RoleId).Result;

            var selectedRoles = roleDto.RoleNames;

            // selectedRoles = selectedRoles != null ? selectedRoles : new string[]{}
            selectedRoles = selectedRoles ?? new string[] { };

            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(roles));

            result = await _userManager.RemoveFromRolesAsync(user, roles.Except(selectedRoles));

            //var resp = await _userManager.AddToRoleAsync(user, role.Name);

            return result;
        }
    }
}