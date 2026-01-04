using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Domain.Strategy
{
    public class RiskCalculator
    {
        private readonly IEnumerable<IRiskRule> _rules;

        public RiskCalculator(IEnumerable<IRiskRule> rules)
        {
            _rules = rules;
        }

        public int Calculate(Client client)
        {
            return _rules.Sum(rule => rule.CalculatePoints(client));
        }
    }
}
