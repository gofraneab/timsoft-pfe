using TimsoftSignature.Domain.Enums;

namespace TimsoftSignature.Application.DTOs
{
    public class SignatureDto
    {
        public int Id { get; set; }
        public string SignatureName { get; set; }
        public SignatureStatus Status { get; set; }
        public TemplateType TypeTemplate { get; set; }

        public string? ContenuHTML { get; set; }
        public DateTime CreatedAt { get; set; }
        public int DepartmentId { get; set; }
    }
}
