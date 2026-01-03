using Bran.Domain.ContextObjects;
using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Domain.Strategy
{
    public class DailyLimitRule : IComplianceRule
    {
        private readonly decimal _dailyLimit;
        public string Name => "Daily Limit Surpassed";

        public DailyLimitRule(decimal dailyLimit)
        {
            _dailyLimit = dailyLimit;
        }

        public Alert? Validate(ComplianceContext complianceContext)
        {
            var today = DateTime.UtcNow.Date;

            var todaysTransactions = complianceContext.RecentTransactions
                .Where(t => t.ClientId == complianceContext.ClientId && t.DateHour.Date == today)
                .OrderBy(t => t.DateHour)
                .ToList();

            if (!todaysTransactions.Any())
                return null;

            var totalToday = todaysTransactions.Sum(t => t.Amount);

            if (totalToday > _dailyLimit)
            {
                var violatingTransaction = todaysTransactions.Last();

                return new Alert(
                    complianceContext.ClientId,
                    violatingTransaction.Id,
                    Name,
                    AlertSeverity.High
                );
            }

            return null;
        }
    }
}
