using ShoutOut.Enums;
using ShoutOut.Model.Interfaces;

namespace ShoutOut.Model
{
    public class User : IEntity
    {
        public int Id { get; set; }
        public Role Role { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public byte[]? Avatar { get; set; }
        public int PointsToGive { get; set; } = 100;
        public int PointToHave { get; set; } = 0;
        public DateTime? Birthday { get; set; }
        public DateTime? StartAtCompany { get; set; }
        public string? PasswordHash { get; set; }
        public string? VerificationToken { get; set; }
        public DateTime? VerifiedAt { get; set; }
        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetTokenExpires { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenCreated { get; set; }
        public DateTime? RefreshTokenExpires { get; set; }
        public bool IsActive { get; set; }
    }
}
