using Bran.Domain.Interfaces;
using Bran.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Application.Services
{
    public class UserService
    {
        private readonly IUsersRepository _userRepository;

        public UserService(IUsersRepository userRepository)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        }
        public async Task<User> CreateUserAsync(string username, string email, string passwordHash, CancellationToken ct = default)
        {
            if (await _userRepository.IsEmailTakenAsync(email, ct))
            {
                throw new ArgumentException("Email is already taken.", nameof(email));
            }
            var user = new User(
                username,
                email,
                passwordHash
            );
            await _userRepository.AddUserAsync(user, ct);
            return user;
        }
        public async Task DeleteUserAsync(Guid userId, CancellationToken ct = default)
        {
            var user = await _userRepository.GetUserByIdAsync(userId, ct);
            if (user == null)
            {
                throw new ArgumentException("User not found.", nameof(userId));
            }
            await _userRepository.DeleteUserAsync(user, ct);
        }
        public async Task UpdateUserEmailAsync(Guid userId, string newEmail, CancellationToken ct = default)
        {
            var user = await _userRepository.GetUserByIdAsync(userId, ct);
            if (user == null)
            {
                throw new ArgumentException("User not found.", nameof(userId));
            }
            if (await _userRepository.IsEmailTakenAsync(newEmail, ct))
            {
                throw new ArgumentException("Email is already taken.", nameof(newEmail));
            }
            user.UpdateEmail(newEmail);
            await _userRepository.UpdateUserAsync(user, ct);
        }
        public async Task UpdateUserPasswordAsync(Guid userId, string newPasswordHash, CancellationToken ct = default)
        {
            var user = await _userRepository.GetUserByIdAsync(userId, ct);
            if (user == null)
            {
                throw new ArgumentException("User not found.", nameof(userId));
            }
            user.UpdatePasswordHash(newPasswordHash);
            await _userRepository.UpdateUserAsync(user, ct);
        }
        public async Task SetUserAdminStatusAsync(Guid userId, bool isAdmin, CancellationToken ct = default)
        {
            var user = await _userRepository.GetUserByIdAsync(userId, ct);
            if (user == null)
            {
                throw new ArgumentException("User not found.", nameof(userId));
            }
            user.SetAdminStatus(isAdmin);
            await _userRepository.UpdateUserAsync(user, ct);
        }
        public async Task UpdateUsernameAsync(Guid userId, string newUsername, CancellationToken ct = default)
        {
            var user = await _userRepository.GetUserByIdAsync(userId, ct);
            if (user == null)
            {
                throw new ArgumentException("User not found.", nameof(userId));
            }
            user.UpdateUsername(newUsername);
            await _userRepository.UpdateUserAsync(user, ct);
        }
        public async Task<User?> GetUserByIdAsync(Guid userId, CancellationToken ct = default)
        {
            return await _userRepository.GetUserByIdAsync(userId, ct);
        }
        public async Task<IReadOnlyCollection<User>> GetAllUsersAsync(CancellationToken ct = default)
        {
            return await _userRepository.GetAllUsersAsync(ct);
        }
        public async Task<User?> GetUserByEmailAsync(string email, CancellationToken ct = default)
        {
            return await _userRepository.GetUserByEmailAsync(email, ct);
        }
        public async Task<User?> GetUserByNameAsync(string userName, CancellationToken ct = default)
        {
            return await _userRepository.GetUserByNameAsync(userName, ct);
        }
    }
}
