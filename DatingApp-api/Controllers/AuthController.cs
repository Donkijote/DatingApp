using System.Threading.Tasks;
using DatingApp_api.Data;
using DatingApp_api.Models;
using Microsoft.AspNetCore.Mvc;
using DatingApp_api.Dtos;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;
using System;
using System.IdentityModel.Tokens.Jwt;

namespace DatingApp_api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        public AuthController(IAuthRepository repo, IConfiguration config)
        {
            _config = config;
            _repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto user)
        {
            user.Username = user.Username.ToLower();

            if (await _repo.UserExists(user.Username))
                return BadRequest("Username already exists");

            var newUser = new User
            {
                Username = user.Username
            };

            var createduser = await _repo.Register(newUser, user.Password);

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto user)
        {
            var userFromRepo = await _repo.Login(user.Username.ToLower(), user.Password);
            if (userFromRepo == null)
                return Unauthorized();
            //claims or info that token will have
            var claims = new[]{
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };
            // Create a security key for the token
            var key = new SymmetricSecurityKey(Encoding.UTF8
                    .GetBytes(_config.GetSection("AppSettings:Token").Value));

            //use key for the siging credential and encrypting the key
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            //create token 
            //1. add claims as subject
            //2. expirantion date
            //3. the encrypted credentials
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            //Create a jwt token
            //1. create handler
            var tokenHandler = new JwtSecurityTokenHandler();
            //2. create token based on the token description
            var token = tokenHandler.CreateToken(tokenDescriptor);
            //3. write the token in the response sent back to the client
            return Ok(new
            {
                token = tokenHandler.WriteToken(token)
            });

        }
    }
}