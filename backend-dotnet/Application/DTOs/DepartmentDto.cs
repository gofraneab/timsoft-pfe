namespace TimsoftSignature.Application.DTOs
{
    public class DepartmentDto
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public List<UserDto> Users { get; set; } = new();
        public List<SignatureDto> Signatures { get; set; } = new();
    }
}
