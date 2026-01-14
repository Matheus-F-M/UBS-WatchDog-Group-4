using Bran.Domain.ContextObjects;
using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using Bran.Domain.ValueObjects;
using System;
using System.Linq;
using System.Transactions;

namespace Bran.Domain.Rules.Transactions
{
    public class TransactionStructuringRule : IComplianceRule
    {
        private double _thresholdAmount;
        private int _minTransactionCount;
        private int _daysWindow;
        private readonly IComplianceConfigsRepository _configsRepository;

        public string Name => "Structuring Detected";

        public TransactionStructuringRule(IComplianceConfigsRepository configsRepository)
        {
            _configsRepository = configsRepository;
        }

        public async Task InitializeAsync()
        {
            var rule = await _configsRepository.GetParameterAsync("TransactionStructuringRule", "ThresholdAmount");
            _thresholdAmount = double.Parse(rule.Value);

            rule = await _configsRepository.GetParameterAsync("TransactionStructuringRule", "MinTransactionCount");
            _minTransactionCount = int.Parse(rule.Value);

            rule = await _configsRepository.GetParameterAsync("TransactionStructuringRule", "DaysWindow");
            _daysWindow = int.Parse(rule.Value);
        }

        public async Task<Alert> ValidateAsync(ComplianceContext complianceContext)
        {
            await InitializeAsync();

            var windowStart = DateTime.UtcNow.Date.AddDays(-_daysWindow);
            var now = DateTime.UtcNow;

            var transactionsInWindow = complianceContext.RecentTransactions
                .Where(t => t.ClientId == complianceContext.ClientId &&
                            t.DateHour >= windowStart &&
                            t.DateHour <= now)
                .OrderBy(t => t.DateHour).ToList();

            transactionsInWindow.Add(complianceContext.CurrentTransaction);

            if (transactionsInWindow.Count >= _minTransactionCount)
            {
                var totalAmount = transactionsInWindow.Sum(t => t.Amount);

                if (totalAmount >= _thresholdAmount)
                {
                    var lastTransaction = transactionsInWindow.Last();
                    return (new Alert(
                        complianceContext.ClientId,
                        lastTransaction.Id,
                        Name,
                        AlertSeverity.High
                    ));
                }
            }

            return (null);
        }
    }
}