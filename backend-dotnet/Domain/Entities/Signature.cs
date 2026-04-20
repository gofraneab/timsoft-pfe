using System.ComponentModel.DataAnnotations;
using TimsoftSignature.Domain.Enums;

namespace TimsoftSignature.Domain.Entities
{
    public class Signature
    {
        [Key]
        public int Id{ get; set; }

        public string SignatureName { get; set; }

        public SignatureStatus Status { get; set; }

        public TemplateType TypeTemplate { get; set; }

        public DateTime CreatedAt { get; set; }

        public string? ContenuHTML { get; set; }

        public int DepartmentId { get; set; }

        public Department Department { get; set; }

    }
}
