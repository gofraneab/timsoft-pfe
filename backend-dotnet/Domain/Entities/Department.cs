using System.ComponentModel.DataAnnotations;

namespace TimsoftSignature.Domain.Entities
{
    public class Department
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public ICollection<User> Users { get; set; }
        public ICollection<Signature> Signatures { get; set; }
    }
}
