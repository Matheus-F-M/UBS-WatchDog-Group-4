using Bran.Domain.Interfaces;
using Bran.Domain.Entities;
using Bran.Domain.ValueObjects;
using System;
using System.Linq;
using Bran.Domain.ContextObjects;

namespace Bran.Domain.Rules.Transactions
{
    public class TransactionStructuringRule : IComplianceRule
    {
        private readonly double _thresholdAmount;
        private readonly int _minTransactionCount;
        private readonly int _daysWindow;

        public string Name => "Structuring Detected";

        public TransactionStructuringRule(IEnumerable<ComplianceConfigs> configs)
        {
            _thresholdAmount = double.Parse(configs.First(c => c.Key == "ThresholdAmount").Value);
            _minTransactionCount = int.Parse(configs.First(c => c.Key == "MinTransactionCount").Value);
            _daysWindow = int.Parse(configs.First(c => c.Key == "DaysWindow").Value);
        }

        public Task<Alert?> ValidateAsync(ComplianceContext complianceContext)
        {
            var windowStart = DateTime.UtcNow.Date.AddDays(-_daysWindow);
            var now = DateTime.UtcNow;

            var transactionsInWindow = complianceContext.RecentTransactions
                .Where(t => t.ClientId == complianceContext.ClientId &&
                            t.DateHour >= windowStart &&
                            t.DateHour <= now)
                .OrderBy(t => t.DateHour)
                .ToList();

            if (transactionsInWindow.Count >= _minTransactionCount)
            {
                var totalAmount = transactionsInWindow.Sum(t => t.Amount);

                if (totalAmount >= _thresholdAmount)
                {
                    var lastTransaction = transactionsInWindow.Last();
                    return Task.FromResult<Alert?>(new Alert(
                        complianceContext.ClientId,
                        lastTransaction.Id,
                        Name,
                        AlertSeverity.High
                    ));
                }
            }

            return Task.FromResult<Alert?>(null);
        }
    }
}