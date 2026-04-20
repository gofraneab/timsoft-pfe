using TimsoftSignature.Domain.Entities;
using TimsoftSignature.Domain.Interfaces;

namespace TimsoftSignature.Application.Services
{
    public class DepartmentService
    {


        private readonly IDepartmentRepository _departmentRepository;

        public DepartmentService(IDepartmentRepository departmentRepository)
        {
            _departmentRepository = departmentRepository;
        }

        public async Task<List<Department>> GetAllDepartments()
        {
            return await _departmentRepository.GetAllAsync();
        }

        public async Task<Department> GetDepartmentById(int id)
        {
            return await _departmentRepository.GetByIdAsync(id);
        }

        public async Task AddDepartment(Department department)
        {
            await _departmentRepository.AddAsync(department);
        }

        public async Task UpdateDepartment(Department department)
        {
            await _departmentRepository.UpdateAsync(department);
        }

        public async Task DeleteDepartment(int id)
        {
            await _departmentRepository.DeleteAsync(id);
        }
    }


}

