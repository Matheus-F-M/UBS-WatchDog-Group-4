using Bran.Application.Interfaces;
using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Application.Services
{
    public class ReportService : IReportService
    {
        private readonly IClientsRepository _clients;
        private readonly ITransactionsRepository _transactions;
        private readonly IAlertsRepository _alerts;

        public ReportService(IClientsRepository clients, ITransactionsRepository transactions, IAlertsRepository alerts)
        {
            _clients = clients;
            _transactions = transactions;
            _alerts = alerts;
        }

        public async Task<Report>GenerateClientReportAsync(Guid clientId, DateTime startDate, DateTime endDate)
        {
            var client = await _clients.GetByIdAsync(clientId);
            if (client == null) throw new Exception("Cliente não encontrado");

            var transactions = await _transactions.GetByClientAndPeriodAsync(clientId, startDate, endDate);
            var alerts = await _alerts.GetByClientAndPeriodAsync(clientId, startDate, endDate);

            var totalAmount = transactions.Sum(t => (decimal)t.Amount);
            var alertCount = alerts.Count();

            return new Report(client.Id, client.Name, totalAmount, alertCount, startDate, endDate);
        }

    }

}
