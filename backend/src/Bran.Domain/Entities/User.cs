using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Domain.Entities
{
    public class User
    {
        public Guid Id { get; private set; }
        public string Username { get; private set; }
        public string Email { get; private set; }
        public string PasswordHash { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }
        public bool isAdmin { get; private set; }
        protected User() { }
        public User(string username, string email, string passwordHash)
        {
            if (string.IsNullOrWhiteSpace(username))
                throw new ArgumentException("Username cannot be null or empty.", nameof(username));
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be null or empty.", nameof(email));
            if (string.IsNullOrWhiteSpace(passwordHash))
                throw new ArgumentException("PasswordHash cannot be null or empty.", nameof(passwordHash));
            Id = Guid.NewGuid();
            Username = username;
            Email = email;
            PasswordHash = passwordHash;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
            isAdmin = false;
        }
        public void UpdateEmail(string newEmail)
        {
            if (string.IsNullOrWhiteSpace(newEmail))
                throw new ArgumentException("Email cannot be null or empty.", nameof(newEmail));
            Email = newEmail;
            UpdatedAt = DateTime.UtcNow;
        }
        public void SetAdminStatus(bool adminStatus)
        {
            isAdmin = adminStatus;
            UpdatedAt = DateTime.UtcNow;
        }
        public void UpdatePasswordHash(string newPasswordHash)
        {
            if (string.IsNullOrWhiteSpace(newPasswordHash))
                throw new ArgumentException("PasswordHash cannot be null or empty.", nameof(newPasswordHash));
            PasswordHash = newPasswordHash;
            UpdatedAt = DateTime.UtcNow;
        }
        public void UpdateUsername(string newUsername)
        {
            if (string.IsNullOrWhiteSpace(newUsername))
                throw new ArgumentException("Username cannot be null or empty.", nameof(newUsername));
            Username = newUsername;
            UpdatedAt = DateTime.UtcNow;
        }
        public override string ToString()
        {
            return $"User - ID: {Id}, Username: {Username}, Email: {Email}, CreatedAt: {CreatedAt}, UpdatedAt: {UpdatedAt}, IsAdmin {isAdmin}";
        }
    }
}
