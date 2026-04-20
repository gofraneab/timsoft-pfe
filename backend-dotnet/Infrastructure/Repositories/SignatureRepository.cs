using Microsoft.EntityFrameworkCore;
using TimsoftSignature.Domain.Entities;
using TimsoftSignature.Domain.Enums;
using TimsoftSignature.Domain.Interfaces;
using TimsoftSignature.Infrastructure.Persistence;

namespace TimsoftSignature.Infrastructure.Repositories
{
    public class SignatureRepository : ISignatureRepository
    {
        private readonly ApplicationDbContext _context;

        public SignatureRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Signature>> GetAllAsync()
        {
            return await _context.Signatures
                                 .Include(s => s.Department)
                                 .ToListAsync();
        }

        public async Task<Signature> GetByIdAsync(int id)
        {
            return await _context.Signatures
                                 .Include(s => s.Department)
                                 .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task AddAsync(Signature signature)
        {
            await _context.Signatures.AddAsync(signature);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Signature signature)
        {
            _context.Signatures.Update(signature);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var signature = await _context.Signatures.FindAsync(id);
            if (signature != null)
            {
                _context.Signatures.Remove(signature);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Signature?> GetActiveByDepartmentAsync(int departmentId)
        {
            return await _context.Signatures
                .FirstOrDefaultAsync(s => s.DepartmentId == departmentId
                                       && s.Status == SignatureStatus.Published);
        }

        public async Task<List<Signature>> GetByDepartmentIdAsync(int departmentId)
        {
            return await _context.Signatures
                .Where(s => s.DepartmentId == departmentId)
                .Include(s => s.Department)
                .ToListAsync();
        }
    }
}
