using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Domain.ValueObjects
{
    public enum TransactionType
    {
        Deposit = 0,
        Withdrawal = 1,
        Transfer = 2,
        Payment = 3
    }
}
