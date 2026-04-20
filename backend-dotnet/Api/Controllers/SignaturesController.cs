using Microsoft.AspNetCore.Mvc;
using TimsoftSignature.Application.DTOs;
using TimsoftSignature.Application.Services;
using TimsoftSignature.Domain.Entities;

namespace TimsoftSignature.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SignaturesController : ControllerBase
    {
        private readonly SignatureService _signatureService;

        public SignaturesController(SignatureService signatureService)
        {
            _signatureService = signatureService;
        }

        // GET all signatures
        [HttpGet]
        public async Task<IActionResult> GetSignatures()
        {
            var signatures = await _signatureService.GetAllSignatures();
            var dtos = signatures.Select(s => new SignatureDto
            {
                Id = s.Id,
                SignatureName = s.SignatureName,
                Status = s.Status,
                TypeTemplate = s.TypeTemplate,
                CreatedAt = s.CreatedAt,
                DepartmentId = s.DepartmentId,
                
            });
            return Ok(dtos);
        }

        // GET signature by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSignature(int id)
        {
            var signature = await _signatureService.GetSignatureById(id);

            if (signature == null)
                return NotFound();

            var dto = new SignatureDto
            {
                Id = signature.Id,
                SignatureName = signature.SignatureName,
                Status = signature.Status,
                TypeTemplate = signature.TypeTemplate,
                CreatedAt = signature.CreatedAt,
                DepartmentId = signature.DepartmentId,
            };

            return Ok(dto);
        }

        // CREATE signature
        [HttpPost]
        public async Task<IActionResult> CreateSignature(SignatureDto dto)
        {
            var signature = new Signature
            {
                SignatureName = dto.SignatureName,
                Status = dto.Status,
                TypeTemplate = dto.TypeTemplate,
                CreatedAt = DateTime.UtcNow,
                DepartmentId = dto.DepartmentId,
                
            };

            await _signatureService.AddSignature(signature);

            return Ok("Signature created successfully");
        }

        // UPDATE signature
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSignature(int id, SignatureDto dto)
        {
            var signature = await _signatureService.GetSignatureById(id);

            if (signature == null)
                return NotFound();

            signature.SignatureName = dto.SignatureName;
            signature.Status = dto.Status;
            signature.TypeTemplate = dto.TypeTemplate;
            signature.DepartmentId = dto.DepartmentId;

            await _signatureService.UpdateSignature(signature);

            return Ok("Signature updated successfully");
        }

        // DELETE signature
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSignature(int id)
        {
            await _signatureService.DeleteSignature(id);

            return Ok("Signature deleted successfully");
        }
        [HttpGet("department/{departmentId}")]
        public async Task<IActionResult> GetActiveSignatureByDepartment(int departmentId)
        {
            var signature = await _signatureService.GetActiveSignatureByDepartment(departmentId);

            if (signature == null)
                return NotFound("Aucune signature active pour ce département");

            return Ok(new SignatureDto
            {
                Id = signature.Id,
                SignatureName = signature.SignatureName,
                Status = signature.Status,
                TypeTemplate = signature.TypeTemplate,
                CreatedAt = signature.CreatedAt,
                DepartmentId = signature.DepartmentId
            });
        }
    }
}
