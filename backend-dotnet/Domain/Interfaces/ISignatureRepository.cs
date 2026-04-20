using TimsoftSignature.Domain.Entities;

namespace TimsoftSignature.Domain.Interfaces
{
    public interface ISignatureRepository
    {
        Task<List<Signature>> GetAllAsync();
        Task<Signature> GetByIdAsync(int id);
        Task AddAsync(Signature signature);
        Task UpdateAsync(Signature signature);
        Task DeleteAsync(int id);
        Task<List<Signature>> GetByDepartmentIdAsync(int departmentId);
        Task<Signature?> GetActiveByDepartmentAsync(int departmentId);
    }
}
