using Bran.Domain.ContextObjects;
using Bran.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Domain.Interfaces { 
    public interface IComplianceRule
    { 
        string Name { get; } 
        Task<Alert?> ValidateAsync(ComplianceContext complianceContext); 
    } 
}
