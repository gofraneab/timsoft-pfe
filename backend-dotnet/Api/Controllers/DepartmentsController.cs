using Microsoft.AspNetCore.Mvc;
using TimsoftSignature.Application.DTOs;
using TimsoftSignature.Application.Services;
using TimsoftSignature.Domain.Entities;

namespace TimsoftSignature.Api.Controllers
{
   
  
        [ApiController]
        [Route("api/[controller]")]
        public class DepartmentsController : ControllerBase
        {
            private readonly DepartmentService _departmentService;

            public DepartmentsController(DepartmentService departmentService)
            {
                _departmentService = departmentService;
            }

            // GET all departments
            [HttpGet]
            public async Task<IActionResult> GetDepartments()
            {
                var departments = await _departmentService.GetAllDepartments();
                var dtos = departments.Select(d => new DepartmentDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Description = d.Description,
                    Users = d.Users?.Select(u => new UserDto
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Position = u.Position,
                        CompanyName = u.CompanyName,
                        OfficePhone = u.OfficePhone,
                        MobilePhone = u.MobilePhone,
                        Address = u.Address,
                        WebsiteUrl = u.WebsiteUrl,
                        BusinessEmail = u.BusinessEmail,
                        LogoUrl = u.LogoUrl,
                        PhotoUrl = u.PhotoUrl,
                        LinkedInUrl = u.LinkedInUrl,
                        YoutubeUrl = u.YoutubeUrl,
                        InstagramUrl = u.InstagramUrl,
                        Email = u.Email,
                        Role = u.Role,
                        DepartmentId = u.DepartmentId
                    }).ToList() ?? new List<UserDto>(),
                    Signatures = d.Signatures?.Select(s => new SignatureDto
                    {
                        Id = s.Id,
                        SignatureName = s.SignatureName,
                        Status = s.Status,
                        TypeTemplate = s.TypeTemplate,
                        CreatedAt = s.CreatedAt,
                        DepartmentId = s.DepartmentId
                    }).ToList() ?? new List<SignatureDto>()
                });
                return Ok(dtos);
            }

            // GET department by id
            [HttpGet("{id}")]
            public async Task<IActionResult> GetDepartment(int id)
            {
                var department = await _departmentService.GetDepartmentById(id);

                if (department == null)
                    return NotFound();

                var dto = new DepartmentDto
                {
                    Id = department.Id,
                    Name = department.Name,
                    Description = department.Description,
                    Users = department.Users?.Select(u => new UserDto
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Position = u.Position,
                        CompanyName = u.CompanyName,
                        OfficePhone = u.OfficePhone,
                        MobilePhone = u.MobilePhone,
                        Address = u.Address,
                        WebsiteUrl = u.WebsiteUrl,
                        BusinessEmail = u.BusinessEmail,
                        LogoUrl = u.LogoUrl,
                        PhotoUrl = u.PhotoUrl,
                        LinkedInUrl = u.LinkedInUrl,
                        YoutubeUrl = u.YoutubeUrl,
                        InstagramUrl = u.InstagramUrl,
                        Email = u.Email,
                        Role = u.Role,
                        DepartmentId = u.DepartmentId
                    }).ToList() ?? new List<UserDto>(),
                    Signatures = department.Signatures?.Select(s => new SignatureDto
                    {
                        Id = s.Id,
                        SignatureName = s.SignatureName,
                        Status = s.Status,
                        TypeTemplate = s.TypeTemplate,
                        CreatedAt = s.CreatedAt,
                        DepartmentId = s.DepartmentId
                    }).ToList() ?? new List<SignatureDto>()
                };

                return Ok(dto);
            }

            // CREATE department
            [HttpPost]
            public async Task<IActionResult> CreateDepartment(DepartmentDto dto)
            {
                var department = new Department
                {
                    Name = dto.Name,
                    Description = dto.Description
                };

                await _departmentService.AddDepartment(department);

                return Ok("Department created successfully");
            }

            // UPDATE department
            [HttpPut("{id}")]
            public async Task<IActionResult> UpdateDepartment(int id, DepartmentDto dto)
            {
                var department = await _departmentService.GetDepartmentById(id);

                if (department == null)
                    return NotFound();

                department.Name = dto.Name;
                department.Description = dto.Description;

                await _departmentService.UpdateDepartment(department);

                return Ok("Department updated successfully");
            }

            // DELETE department
            [HttpDelete("{id}")]
            public async Task<IActionResult> DeleteDepartment(int id)
            {
                await _departmentService.DeleteDepartment(id);

                return Ok("Department deleted successfully");
            }
        }
    }

