using System.Threading.Tasks;
using DatingApp_api.Data;
using DatingApp_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp_api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        public AuthController(IAuthRepository repo)
        {
            this._repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(string username, string password)
        {
            //validate request
            username = username.ToLower();

            if (await _repo.UserExists(username))
                return BadRequest("Username already exists");

            var newUser = new User
            {
                Username = username
            };

            var createduser = await _repo.Register(newUser, password);

            return StatusCode(201);
        }
    }
}