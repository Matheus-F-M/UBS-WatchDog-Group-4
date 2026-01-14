using Bran.Domain.Entities;
using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Bran.Domain.Interfaces 
{ 
    public interface IAlertsRepository 
    { 
        Task<Alert?> GetByIdAsync(Guid alertId); 
        Task<IReadOnlyCollection<Alert>> GetAllAlertsAsync(); 
        Task<IReadOnlyCollection<Alert>> GetAllByClientIdAsync(Guid clientId); 
        Task<IReadOnlyCollection<Alert>> GetByTransactionIdAsync(Guid transactionId); 
        Task<IReadOnlyCollection<Alert>> GetByStatusAsync(AlertStatus status); 
        Task<IReadOnlyCollection<Alert>> GetBySeverityAsync(AlertSeverity severity); 
        Task<IReadOnlyCollection<Alert>> GetByDateRangeAsync(DateTime startUtc, DateTime endUtc);
        Task<IReadOnlyCollection<Alert>> GetByClientAndPeriodAsync(Guid clientId, DateTime startDate, DateTime endDate);
        Task AddRangeAsync(IEnumerable<Alert> alerts, CancellationToken ct = default);
        Task AddAsync(Alert alert); 
        Task UpdateAsync(Alert alert); 
        Task UpdateStatusAsync(Guid alertId, AlertStatus newStatus); 
        Task DeleteAsync(Guid alertId); 
    } 
}
