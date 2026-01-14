using Bran.Domain.ContextObjects;
using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Domain.Rules.Transactions
{
    public class TransactionDailyLimitRule : IComplianceRule
    {
        private readonly IComplianceConfigsRepository _configRepository;
        public string Name => "TransactionDailyLimitRule";

        public TransactionDailyLimitRule(IComplianceConfigsRepository configRepository)
        {
            _configRepository = configRepository;
        }

        public async Task<Alert?> ValidateAsync(ComplianceContext context)
        {
            var config = await _configRepository.GetParameterAsync(Name, "DailyLimit");

            if (config == null)
                return null; // ou lançar exceção de config inválida

            var dailyLimit = double.Parse(config.Value);

            var today = DateTime.UtcNow.Date;

            var todaysTransactions = context.RecentTransactions
                .Where(t => t.ClientId == context.ClientId && t.DateHour.Date == today)
                .OrderBy(t => t.DateHour)
                .ToList();

            if (!todaysTransactions.Any())
                return null;

            var totalToday = todaysTransactions.Sum(t => t.Amount);

            if (totalToday > dailyLimit)
            {
                var violatingTransaction = todaysTransactions.Last();
                return new Alert(
                    context.ClientId,
                    violatingTransaction.Id,
                    Name,
                    AlertSeverity.High
                );
            }

            return null;
        }
    }
}
