using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Domain.Entities
{
    public class ComplianceConfigs
    {

        public Guid Id { get; private set; }
        public string RuleName { get; private set; }   // Ex: "TransactionDailyLimitRule"
        public string Key { get; private set; }        // Ex: "DailyLimit"
        public string Value { get; private set; }      // Ex: "50000"

        protected ComplianceConfigs() { }

        public ComplianceConfigs(Guid id, string ruleName, string key, string value)
        {
            Id = id;
            RuleName = ruleName;
            Key = key;
            Value = value;
        }

        public void UpdateValue(string newValue)
        {
            Value = newValue;
        }

    }
}
