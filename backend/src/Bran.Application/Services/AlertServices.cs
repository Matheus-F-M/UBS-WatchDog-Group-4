using Bran.Domain.Interfaces;
using Bran.Domain.Entities;
using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Application.Services
{
    public class AlertServices
    {
        private readonly IAlertsRepository _alertRepository;

        public AlertServices(IAlertsRepository alertRepository)
        {
            _alertRepository = alertRepository;
        }

        public async Task<Domain.Entities.Alert?> GetAlertAsync(Guid id)
        {
            return await _alertRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Alert>> GetAllAlertsAsync()
        {
            return await _alertRepository.GetAllAlertsAsync();
        }

        public async Task<IEnumerable<Alert>> GetAlertsByClientIdAsync(Guid clientId)
        {
            return await _alertRepository.GetAllByClientIdAsync(clientId);
        }

        public async Task<IEnumerable<Alert>> GetAlertsByStatusAsync(AlertStatus status)
        {
            return await _alertRepository.GetByStatusAsync(status);
        }

        public async Task<IEnumerable<Alert>> GetAlertsBySeverityAsync(AlertSeverity severity)
        {
            return await _alertRepository.GetBySeverityAsync(severity);
        }

        public async Task<IEnumerable<Alert>> GetByTransactionIdAsync(Guid transactionId)
        {
            return await _alertRepository.GetByTransactionIdAsync(transactionId);
        }

        public async Task<IEnumerable<Alert>> GetByDateRangeAsync(DateTime startUtc, DateTime endUtc)
        {
            return await _alertRepository.GetByDateRangeAsync(startUtc, endUtc);
        }

        public async Task<IEnumerable<Alert>> GetByClientAndPeriodAsync(Guid clientId, DateTime startDate, DateTime endDate)
        {
            return await _alertRepository.GetByClientAndPeriodAsync(clientId, startDate, endDate);
        }

        public async Task UpdateStausAsync(Guid alertId, AlertStatus newStatus)
        {
            await _alertRepository.UpdateStatusAsync(alertId, newStatus);
        }
    }
}
