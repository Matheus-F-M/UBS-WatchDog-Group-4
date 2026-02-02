using Bran.Domain.ContextObjects;
using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using Bran.Domain.ValueObjects;
using System;
using System.Linq;

namespace Bran.Domain.Rules.Transactions
{
    public class TransactionStructuringRule : IComplianceRule
    {
        private readonly IComplianceConfigsRepository _configsRepository;

        public string Name => "Structuring Detected";

        public TransactionStructuringRule(IComplianceConfigsRepository configsRepository)
        {
            _configsRepository = configsRepository;
        }

        public async Task<Alert?> ValidateAsync(ComplianceContext complianceContext)
        {
            var configDay = await _configsRepository.GetParameterAsync("TransactionStructuringRule", "DaysWindow");
            var configThreshold = await _configsRepository.GetParameterAsync("TransactionStructuringRule", "ThresholdAmount");
            var configCount = await _configsRepository.GetParameterAsync("TransactionStructuringRule", "MinTransactionCount");

            if (configDay?.Value == null || configThreshold?.Value == null || configCount?.Value == null)
            {
                return null;
            }

            int daysWindowConfig = int.Parse(configDay.Value);
            double thresholdAmount = double.Parse(configThreshold.Value);
            int minTransactionCount = int.Parse(configCount.Value);

            var windowStart = DateTime.UtcNow.Date.AddDays(-daysWindowConfig);
            var now = DateTime.UtcNow;

            var transactionsInWindow = complianceContext.RecentTransactions
                .Where(t => t.ClientId == complianceContext.ClientId &&
                            t.DateHour >= windowStart &&
                            t.DateHour <= now)
                .OrderBy(t => t.DateHour)
                .ToList();

            transactionsInWindow.Add(complianceContext.CurrentTransaction);

            if (transactionsInWindow.Count >= minTransactionCount)
            {
                var totalAmount = transactionsInWindow.Sum(t => t.Amount);

                if (totalAmount >= thresholdAmount)
                {
                    var lastTransaction = transactionsInWindow.Last();
                    return new Alert(
                        complianceContext.ClientId,
                        lastTransaction.Id,
                        Name,
                        AlertSeverity.High
                    );
                }
            }

            return null;
        }
    }
}