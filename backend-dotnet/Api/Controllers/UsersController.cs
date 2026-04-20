using Microsoft.AspNetCore.Mvc;
using TimsoftSignature.Application.DTOs;
using TimsoftSignature.Application.Services;
using TimsoftSignature.Domain.Entities;
using TimsoftSignature.Domain.Interfaces;

namespace TimsoftSignature.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        // GET all users
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.GetAllUsers();
            var dtos = users.Select(user => new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Position = user.Position,
                CompanyName = user.CompanyName,
                OfficePhone = user.OfficePhone,
                MobilePhone = user.MobilePhone,
                Address = user.Address,
                WebsiteUrl = user.WebsiteUrl,
                BusinessEmail = user.BusinessEmail,
                LogoUrl = user.LogoUrl,
                PhotoUrl = user.PhotoUrl,
                LinkedInUrl = user.LinkedInUrl,
                YoutubeUrl = user.YoutubeUrl,
                InstagramUrl = user.InstagramUrl,
                Email = user.Email,
                Role = user.Role,
                DepartmentId = user.DepartmentId
            });
            return Ok(dtos);
        }

        // GET user by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _userService.GetUserById(id);

            if (user == null)
                return NotFound();

            var dto = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Position = user.Position,
                CompanyName = user.CompanyName,
                OfficePhone = user.OfficePhone,
                MobilePhone = user.MobilePhone,
                Address = user.Address,
                WebsiteUrl = user.WebsiteUrl,
                BusinessEmail = user.BusinessEmail,
                LogoUrl = user.LogoUrl,
                PhotoUrl = user.PhotoUrl,
                LinkedInUrl = user.LinkedInUrl,
                YoutubeUrl = user.YoutubeUrl,
                InstagramUrl = user.InstagramUrl,
                Email = user.Email,
                Role = user.Role,
                DepartmentId = user.DepartmentId
            };

            return Ok(dto);
        }

        // CREATE user
        [HttpPost]
        public async Task<IActionResult> CreateUser(UserDto dto)
        {
            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Position = dto.Position,
                CompanyName = dto.CompanyName,
                OfficePhone = dto.OfficePhone,
                MobilePhone = dto.MobilePhone,
                Address = dto.Address,
                WebsiteUrl = dto.WebsiteUrl,
                BusinessEmail = dto.BusinessEmail,
                LogoUrl = dto.LogoUrl,
                PhotoUrl = dto.PhotoUrl,
                LinkedInUrl = dto.LinkedInUrl,
                YoutubeUrl = dto.YoutubeUrl,
                InstagramUrl = dto.InstagramUrl,
                Email = dto.Email,
                Password = dto.Password,
                Role = dto.Role,
                DepartmentId = dto.DepartmentId
            };

            await _userService.AddUser(user);

            return Ok("User created successfully");
        }

        // UPDATE user
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserDto dto)
        {
            var user = await _userService.GetUserById(id);

            if (user == null)
                return NotFound();

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Position = dto.Position;
            user.CompanyName = dto.CompanyName;
            user.OfficePhone = dto.OfficePhone;
            user.MobilePhone = dto.MobilePhone;
            user.Address = dto.Address;
            user.WebsiteUrl = dto.WebsiteUrl;
            user.BusinessEmail = dto.BusinessEmail;
            user.LogoUrl = dto.LogoUrl;
            user.PhotoUrl = dto.PhotoUrl;
            user.LinkedInUrl = dto.LinkedInUrl;
            user.YoutubeUrl = dto.YoutubeUrl;
            user.InstagramUrl = dto.InstagramUrl;
            user.Email = dto.Email;
            user.Password = dto.Password;
            user.Role = dto.Role;
            user.DepartmentId = dto.DepartmentId;

            await _userService.UpdateUser(user);

            return Ok("User updated successfully");
        }

        // DELETE user
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteUser(id);

            return Ok("User deleted successfully");
        }
    }
}

