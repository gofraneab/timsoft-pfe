using TimsoftSignature.Domain.Entities;
using TimsoftSignature.Domain.Interfaces;

namespace TimsoftSignature.Application.Services
{
    public class SignatureService
    {
        private readonly ISignatureRepository _signatureRepository;

        public SignatureService(ISignatureRepository signatureRepository)
        {
            _signatureRepository = signatureRepository;
        }

        public async Task<List<Signature>> GetAllSignatures()
        {
            return await _signatureRepository.GetAllAsync();
        }

        public async Task<Signature> GetSignatureById(int id)
        {
            return await _signatureRepository.GetByIdAsync(id);
        }

        public async Task AddSignature(Signature signature)
        {
            await _signatureRepository.AddAsync(signature);
        }

        public async Task UpdateSignature(Signature signature)
        {
            await _signatureRepository.UpdateAsync(signature);
        }

        public async Task DeleteSignature(int id)
        {
            await _signatureRepository.DeleteAsync(id);
        }

        public async Task<Signature?> GetActiveSignatureByDepartment(int departmentId)
        {
            return await _signatureRepository.GetActiveByDepartmentAsync(departmentId);
        }
    }
}

