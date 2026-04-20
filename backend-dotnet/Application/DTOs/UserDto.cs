using TimsoftSignature.Domain.Enums;

namespace TimsoftSignature.Application.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Position { get; set; }
        public string CompanyName { get; set; }
        public string OfficePhone { get; set; }
        public string MobilePhone { get; set; }
        public string Address { get; set; }
        public string WebsiteUrl { get; set; }
        public string BusinessEmail { get; set; }
        public string LogoUrl { get; set; }
        public string PhotoUrl { get; set; }
        public string LinkedInUrl { get; set; }
        public string YoutubeUrl { get; set; }
        public string InstagramUrl { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public Role Role { get; set; }
        public int DepartmentId { get; set; }
    }
}
