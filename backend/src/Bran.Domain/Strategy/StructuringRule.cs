using Bran.Domain.Interfaces;
using Bran.Domain.Entities;
using Bran.Domain.ValueObjects;
using System;
using System.Linq;
using Bran.Domain.ContextObjects;

namespace Bran.Domain.ComplianceRules
{
    public class StructuringRule : IComplianceRule
    {
        private readonly decimal _thresholdAmount;
        private readonly int _minTransactionCount;
        private readonly int _daysWindow;

        public string Name => "Structuring Detected";

        public StructuringRule(decimal thresholdAmount, int minTransactionCount, int daysWindow)
        {
            _thresholdAmount = thresholdAmount;
            _minTransactionCount = minTransactionCount;
            _daysWindow = daysWindow;
        }

        public Alert? Validate(ComplianceContext complianceContext)
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