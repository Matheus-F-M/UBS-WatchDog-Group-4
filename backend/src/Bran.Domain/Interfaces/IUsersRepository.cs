using Bran.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Domain.Interfaces
{
    public interface IUsersRepository
    {
        Task<bool> IsEmailTakenAsync(string email, CancellationToken ct = default);

        Task AddUserAsync(User user, CancellationToken ct = default);

        Task UpdateUserAsync(User user, CancellationToken ct = default);

        Task DeleteUserAsync(User user, CancellationToken ct = default);

        Task<IReadOnlyCollection<User>> GetAllUsersAsync(CancellationToken ct = default);

        Task<User?> GetUserByIdAsync(Guid userId, CancellationToken ct = default);

        Task<User?> GetUserByNameAsync(string userName, CancellationToken ct = default);

        Task<User?> GetUserByEmailAsync(string email, CancellationToken ct = default);
    }

}
