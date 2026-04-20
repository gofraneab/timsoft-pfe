import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DepartmentService } from '../../services/department.service';
import { User } from '../../models/user';
import { Department } from '../../models/department';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  departments: Department[] = [];

  searchTerm = '';
  selectedDepartment = 0;
  selectedRole = -1;

  // Modal
  showModal = false;
  isEditing = false;
  selectedUser: Partial<User> = {};

  constructor(
    private userService: UserService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadDepartments();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.allUsers = data;
        this.applyFilters();
      },
      error: (err) => console.error(err)
    });
  }

  loadDepartments() {
    this.departmentService.getAll().subscribe({
      next: (data) => this.departments = data,
      error: (err) => console.error(err)
    });
  }

  applyFilters() {
    this.filteredUsers = this.allUsers.filter(u => {
      const matchSearch = this.searchTerm === '' ||
        u.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchDept = this.selectedDepartment === 0 ||
        u.departmentId === Number(this.selectedDepartment);

      const matchRole = this.selectedRole === -1 ||
        u.role === Number(this.selectedRole);

      return matchSearch && matchDept && matchRole;
    });
  }

  getDepartmentName(id: number): string {
    return this.departments.find(d => d.id === id)?.name || 'N/A';
  }

  getRoleLabel(role: number): string {
    return role === 0 ? 'Admin' : 'User';
  }

  getRoleClass(role: number): string {
    return role === 0 ? 'badge-admin' : 'badge-user';
  }

  getInitials(user: User): string {
    return `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`.toUpperCase();
  }

  getAvatarColor(id: number): string {
    const colors = ['#2563eb', '#1D9E75', '#D85A30', '#BA7517', '#7F77DD', '#D4537E'];
    return colors[id % colors.length];
  }

  // Modal Add User
  openAddModal() {
    this.isEditing = false;
    this.selectedUser = { role: 1, departmentId: 0 };
    this.showModal = true;
  }

  openEditModal(user: User) {
    this.isEditing = true;
    this.selectedUser = { ...user };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser = {};
  }

  saveUser() {
    if (!this.selectedUser.firstName || !this.selectedUser.email) {
      alert('Prénom et email sont obligatoires');
      return;
    }

    if (this.isEditing && this.selectedUser.id) {
      this.userService.update(this.selectedUser.id, this.selectedUser).subscribe({
        next: () => { this.loadUsers(); this.closeModal(); },
        error: (err) => console.error(err)
      });
    } else {
      this.userService.create(this.selectedUser).subscribe({
        next: () => { this.loadUsers(); this.closeModal(); },
        error: (err) => console.error(err)
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('Supprimer cet utilisateur ?')) {
      this.userService.delete(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error(err)
      });
    }
  }

  countByRole(role: number): number {
  return this.allUsers.filter(u => u.role === role).length;
}
}