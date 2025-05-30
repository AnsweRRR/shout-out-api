﻿using ShoutOut.Enums;

namespace ShoutOut.Dto.User
{
    public class UserResultDto
    {
        public int Id { get; set; }
        public Role Role { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Avatar { get; set; }
        public string? Display { get; set; }
        public int PointsToGive { get; set; }
        public int PointToHave { get; set; }
        public DateTime? Birthday { get; set; }
        public DateTime? StartAtCompany { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public bool? Verified { get; set; }
        public bool? IsActive { get; set; }
    }
}
