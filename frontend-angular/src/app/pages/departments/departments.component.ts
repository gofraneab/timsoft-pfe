import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];
  showModal = false;
  isEditing = false;
  selectedDept: Partial<Department> = {};

  constructor(private departmentService: DepartmentService) {}

  ngOnInit() { this.loadDepartments(); }

  loadDepartments() {
    this.departmentService.getAll().subscribe({
      next: (data) => this.departments = data,
      error: (err) => console.error(err)
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.selectedDept = {};
    this.showModal = true;
  }

  openEditModal(dept: Department) {
    this.isEditing = true;
    this.selectedDept = { ...dept };
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  saveDepartment() {
    if (!this.selectedDept.name) { alert('Nom obligatoire'); return; }

    if (this.isEditing && this.selectedDept.id) {
      this.departmentService.update(this.selectedDept.id, this.selectedDept).subscribe({
        next: () => { this.loadDepartments(); this.closeModal(); },
        error: (err) => console.error(err)
      });
    } else {
      this.departmentService.create(this.selectedDept).subscribe({
        next: () => { this.loadDepartments(); this.closeModal(); },
        error: (err) => console.error(err)
      });
    }
  }

  deleteDepartment(id: number) {
    if (confirm('Supprimer ce département ?')) {
      this.departmentService.delete(id).subscribe({
        next: () => this.loadDepartments(),
        error: (err) => console.error(err)
      });
    }
  }

  getUserCount(dept: Department): number {
    return dept.users?.length || 0;
  }

  getSignatureCount(dept: Department): number {
    return dept.signatures?.length || 0;
  }
  getTotalUsers(): number {
  return this.departments.reduce((sum, d) => sum + (d.users?.length || 0), 0);
}
}