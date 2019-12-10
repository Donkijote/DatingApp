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
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace DatingApp_api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper, UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _mapper = mapper;
            _config = config;
            _repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto user)
        {
            user.Username = user.Username.ToLower();

            if (await _repo.UserExists(user.Username))
                return BadRequest("Username already exists");

            var newUser = _mapper.Map<User>(user);

            var createduser = await _repo.Register(newUser, user.Password);

            var userToReturn = _mapper.Map<UserDetailDto>(createduser);

            return CreatedAtRoute("GetUser", new { controller = "Users", id = createduser.Id }, userToReturn);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var user = await _userManager.FindByNameAsync(userForLoginDto.Username);

            if (user == null)
                return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(user, userForLoginDto.Password, false);

            if (result.Succeeded)
            {
                //optional token to pass user information like photos or something else
                var userInfo = _mapper.Map<UserListDto>(user);

                //3. write the token in the response sent back to the client
                return Ok(new
                {
                    token = GenerateJwtTokenIdentity(user).Result,
                    userInfo
                });
            }

            return Unauthorized();

        }

        private async Task<string> GenerateJwtTokenIdentity(User user)
        {
            //claims or info that token will have
            var claims = new List<Claim>{
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };
            //getting user's roles
            var roles = await _userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

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

            return tokenHandler.WriteToken(token);
        }
    }
}