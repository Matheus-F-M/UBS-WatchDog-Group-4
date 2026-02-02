using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using Bran.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Infrastructure.Repositories
{
    public class ComplianceConfigsRepository : IComplianceConfigsRepository
    {
        private readonly BranDbContext _context;
        public ComplianceConfigsRepository(BranDbContext context)
        {
            _context = context;
        }
        public async Task<IReadOnlyCollection<ComplianceConfigs>> GetByRuleAsync(string ruleName, CancellationToken ct = default)
        {
            return await _context.ComplianceConfigs
                .AsNoTracking()
                .Where(cc => cc.RuleName == ruleName)
                .ToListAsync(ct);
        }
        public async Task<ComplianceConfigs?> GetParameterAsync(string ruleName, string key, CancellationToken ct = default)
        {
            return await _context.ComplianceConfigs
                .FirstOrDefaultAsync(cc => cc.RuleName == ruleName && cc.Key == key, ct);
        }
        public async Task UpdateParameterAsync(ComplianceConfigs parameter, CancellationToken ct = default)
        {
            _context.ComplianceConfigs.Update(parameter);
            await _context.SaveChangesAsync(ct);
        }
    }
}