using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using Bran.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Infrastructure.Repositories
{
    public class UsersRepository : IUsersRepository
    {
        private readonly BranDbContext _context;

        public UsersRepository(BranDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<bool> IsEmailTakenAsync(string email, CancellationToken ct = default)
        {
            return await _context.Users.AnyAsync(u => u.Email == email, ct);
        }

        public async Task AddUserAsync(User user, CancellationToken ct = default)
        {
            await _context.Users.AddAsync(user, ct);
            await _context.SaveChangesAsync(ct);
        }

        public async Task UpdateUserAsync(User user, CancellationToken ct = default)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync(ct);
        }

        public async Task DeleteUserAsync(User user, CancellationToken ct = default)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<IReadOnlyCollection<User>> GetAllUsersAsync(CancellationToken ct = default)
        {
            return await _context.Users.AsNoTracking().ToListAsync(ct);
        }

        public async Task<User?> GetUserByIdAsync(Guid userId, CancellationToken ct = default)
        {
            return await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId, ct);
        }

        public async Task<User?> GetUserByNameAsync(string userName, CancellationToken ct = default)
        {
            return await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Username == userName, ct);
        }

        public async Task<User?> GetUserByEmailAsync(string email, CancellationToken ct = default)
        {
            return await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == email, ct);
        }
    }

}
