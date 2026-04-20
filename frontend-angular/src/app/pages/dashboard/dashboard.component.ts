import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SignatureService } from '../../services/signature.service';
import { UserService } from '../../services/user.service';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalSignatures = 0;
  totalUsers = 0;
  totalDepartments = 0;
  publishedSignatures = 0;
  draftSignatures = 0;
  disabledSignatures = 0;

  recentSignatures: any[] = [];
  recentUsers: any[] = [];
  departments: any[] = [];

  constructor(
    private signatureService: SignatureService,
    private userService: UserService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.signatureService.getAll().subscribe(data => {
      this.totalSignatures = data.length;
      this.publishedSignatures = data.filter(s => s.status === 1).length;
      this.draftSignatures = data.filter(s => s.status === 0).length;
      this.disabledSignatures = data.filter(s => s.status === 2).length;
      this.recentSignatures = data.slice(0, 5);
    });

    this.userService.getAll().subscribe(data => {
      this.totalUsers = data.length;
      this.recentUsers = data.slice(0, 5);
    });

    this.departmentService.getAll().subscribe(data => {
      this.totalDepartments = data.length;
      this.departments = data;
    });
  }

  getStatusLabel(status: number): string {
    const labels: any = { 0: 'Draft', 1: 'Published', 2: 'Disabled' };
    return labels[status] || 'Unknown';
  }

  getStatusClass(status: number): string {
    const classes: any = { 0: 'badge-draft', 1: 'badge-active', 2: 'badge-disabled' };
    return classes[status] || '';
  }

  getTemplateLabel(type: number): string {
    const labels: any = { 0: 'Minimal Clean', 1: 'Modern Professional' };
    return labels[type] || 'Unknown';
  }

  getInitials(user: any): string {
    return `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`.toUpperCase();
  }

  getAvatarColor(id: number): string {
    const colors = ['#2563eb', '#1D9E75', '#D85A30', '#BA7517', '#7F77DD'];
    return colors[id % colors.length];
  }

  getRoleLabel(role: number): string {
    return role === 0 ? 'Admin' : 'User';
  }
}