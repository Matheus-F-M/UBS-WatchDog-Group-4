using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Domain.Entities
{
    public class Currency
    {
        public string Code { get; private set; }
        public string Name { get; private set; }
        public decimal DailyRate { get; private set; }
        public DateTime UpdatedAt { get; private set; }
        protected Currency() { }

        public Currency(string code, string name, decimal dailyRate)
        {
            Code = code;
            Name = name;
            DailyRate = dailyRate;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateExchangeRate(decimal newRate)
        {
            if (newRate <= 0)
                throw new ArgumentException("Exchange rate must be greater than zero.");

            DailyRate = newRate;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
