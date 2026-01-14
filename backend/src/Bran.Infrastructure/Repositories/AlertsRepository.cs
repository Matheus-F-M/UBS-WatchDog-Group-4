using Bran.Infrastructure.Persistence;
using Bran.Domain.Entities;
using Bran.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bran.Domain.Interfaces;
namespace Bran.Infrastructure.Repositories {
    public class AlertsRepository : IAlertsRepository
    { 
        private readonly BranDbContext _context; 
        public AlertsRepository(BranDbContext context)
        { 
            _context = context; 
        }
        public async Task AddRangeAsync(IEnumerable<Alert> alerts, CancellationToken ct = default)
        {
            await _context.Set<Alert>().AddRangeAsync(alerts, ct);
            await _context.SaveChangesAsync(ct);
        }
        public async Task AddAsync(Alert alert)
        { 
            await _context.Set<Alert>().AddAsync(alert); 
            await _context.SaveChangesAsync(); 
        } 
        public async Task DeleteAsync(Guid alertId) 
        { 
            var alert = await GetByIdAsync(alertId); 
            if (alert != null) 
            { 
                _context.Set<Alert>().Remove(alert);
                await _context.SaveChangesAsync(); 
            } 
        } 
        public async Task<IReadOnlyCollection<Alert>> GetAllAlertsAsync() 
        { 
            return await _context.Set<Alert>().ToListAsync(); 
        } 
        public async Task<Alert?> GetByIdAsync(Guid alertId) 
        { 
            return await _context.Set<Alert>().FindAsync(alertId); 
        } 
        public async Task<IReadOnlyCollection<Alert>> GetAllByClientIdAsync(Guid clientId) 
        { 
            return await _context.Set<Alert>().Where(a => a.ClientId == clientId).ToListAsync(); 
        } 
        public async Task<IReadOnlyCollection<Alert>> GetByTransactionIdAsync(Guid transactionId) 
        { 
            return await _context.Set<Alert>().Where(a => a.TransactionId == transactionId).ToListAsync(); 
        } 
        public async Task<IReadOnlyCollection<Alert>> GetByStatusAsync(AlertStatus status) 
        { 
            return await _context.Set<Alert>().Where(a => a.Status == status).ToListAsync(); 
        } 
        public async Task<IReadOnlyCollection<Alert>> GetBySeverityAsync(AlertSeverity severity) 
        { 
            return await _context.Set<Alert>().Where(a => a.Severity == severity).ToListAsync(); 
        }
        public async Task<IReadOnlyCollection<Alert>> GetByDateRangeAsync(DateTime startUtc, DateTime endUtc) 
        { 
            return await _context.Set<Alert>().Where(a => a.CreatedAt >= startUtc && a.CreatedAt <= endUtc).ToListAsync(); 
        }
        public async Task<IReadOnlyCollection<Alert>> GetByClientAndPeriodAsync(Guid clientId, DateTime startDate, DateTime endDate)
        {
            return await _context.Set<Alert>()
                .Where(a => a.ClientId == clientId && a.CreatedAt >= startDate && a.CreatedAt <= endDate)
                .ToListAsync();
        }
        public async Task UpdateAsync(Alert alert) 
        { 
            _context.Set<Alert>().Update(alert); 
            await _context.SaveChangesAsync(); 
        }
        public async Task UpdateStatusAsync(Guid alertId, AlertStatus newStatus)
        {
            var alert = await GetByIdAsync(alertId);
            if (alert != null)
            {
                _context.Entry(alert).Property(a => a.Status).CurrentValue = newStatus;
                await _context.SaveChangesAsync();
            }
        }
    } 
}
