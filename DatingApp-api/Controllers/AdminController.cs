using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp_api.Dtos;
using DatingApp_api.helpers;
using DatingApp_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DatingApp_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly UserManager<User> _userManager;
        private readonly IOptions<CloudinarySettings> _cloudConfig;
        private Cloudinary _cloudinary;
        public AdminController(DataContext dataContext, UserManager<User> userManager, IOptions<CloudinarySettings> cloudConfig)
        {
            _cloudConfig = cloudConfig;
            _userManager = userManager;
            _dataContext = dataContext;

            Account acc = new Account(
                _cloudConfig.Value.CloudName,
                _cloudConfig.Value.ApiKey,
                _cloudConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }

        [Authorize(Policy = "RequiredAdminRole")]
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
        [HttpPost("editRoles/{userName}")]
        public async Task<IActionResult> EditUsers(string userName, RoleEditDto roleDto)
        {

            var newAssignment = await AssingRole(userName, roleDto);

            if (newAssignment.Succeeded)
            {
                return NoContent();
            }

            return BadRequest("Error al cambiar roles: " + newAssignment.Errors);
        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpGet("photosForModeration")]
        public async Task<IActionResult> GetPhotosForModeration()
        {
            var photos = await _dataContext.Photos
                            .Include(u => u.User)
                            .IgnoreQueryFilters()
                            .Where(p => p.IsApproved == false)
                            .Select(u => new
                            {
                                Id = u.Id,
                                UserName = u.User.UserName,
                                Url = u.Url,
                                IsApproved = u.IsApproved
                            }).ToListAsync();
            return Ok(photos);
        }
        [Authorize(Policy = "RequiredAdminRole")]
        [HttpPost("approvePhoto/{photoId}")]
        public async Task<IActionResult> ApprovePhoto(int photoId)
        {
            var photo = await _dataContext.Photos
                        .IgnoreQueryFilters()
                        .FirstOrDefaultAsync(p => p.Id == photoId);

            photo.IsApproved = true;

            await _dataContext.SaveChangesAsync();

            return Ok();
        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpPost("rejectPhoto/{photoId}")]
        public async Task<IActionResult> RejectPhoto(int photoId)
        {
            var photo = await _dataContext.Photos
                        .IgnoreQueryFilters()
                        .FirstOrDefaultAsync(p => p.Id == photoId);

            if (photo.IsMain)
                return BadRequest("You cannot reject the main photo");

            if (photo.PublicId != null)
            {
                var deleteParams = new DeletionParams(photo.PublicId);

                var result = _cloudinary.Destroy(deleteParams);

                if (result.Result == "ok")
                {
                    _dataContext.Photos.Remove(photo);
                }
            }

            if (photo.PublicId == null)
            {
                _dataContext.Remove(photo);
            }

            await _dataContext.SaveChangesAsync();

            return Ok();
        }
        private async Task<IdentityResult> AssingRole(string userName, RoleEditDto roleDto)
        {
            var user = _userManager.FindByNameAsync(userName).Result;

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