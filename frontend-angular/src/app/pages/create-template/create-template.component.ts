import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SignatureService } from '../../services/signature.service';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department';

@Component({
  selector: 'app-create-template',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.css']
})
export class CreateTemplateComponent implements OnInit {
  currentStep = 1;
  activeTab = 'editor';

  // Form fields
  signatureName = '';
  description = '';
  selectedDepartmentId: number = 0;
  selectedStatus = 0;
  selectedTemplate = 0;
  htmlContent = `<table style="font-family: Arial, sans-serif; font-size: 14px; color: #374151;">
  <tbody>
    <tr>
      <td style="padding-right: 16px; vertical-align: top;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">
          T
        </div>
      </td>
      <td style="vertical-align: top; border-left: 3px solid #2563eb; padding-left: 16px;">
        <div style="margin-bottom: 4px;">
          <strong style="font-size: 16px;">{{firstName}} {{lastName}}</strong>
        </div>
        <div style="color: #6b7280; margin-bottom: 4px;">{{position}} | {{department}}</div>
        <div style="color: #6b7280;">{{businessEmail}}</div>
        <div style="color: #6b7280;">{{mobilePhone}}</div>
        <div style="color: #2563eb;">{{websiteUrl}}</div>
      </td>
    </tr>
  </tbody>
</table>`;

  departments: Department[] = [];
  previewHtml: SafeHtml = '';

  editableFields: { [key: string]: boolean }= {
    name: true,
    jobTitle: true,
    email: true,
    phone: false,
    department: false,
    linkedin: false,
    website: false
  };

  steps = [
    { number: 1, label: 'Info' },
    { number: 2, label: 'Design' },
    { number: 3, label: 'Fields' },
    { number: 4, label: 'Review' }
  ];

  constructor(
    private signatureService: SignatureService,
    private departmentService: DepartmentService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    this.departmentService.getAll().subscribe(data => this.departments = data);
    this.updatePreview();
  }

  updatePreview() {
    const sample = this.htmlContent
      .replace('{{firstName}}', 'Gofrane')
      .replace('{{lastName}}', 'Abidi')
      .replace('{{position}}', 'Senior IT Manager')
      .replace('{{department}}', 'IT')
      .replace('{{businessEmail}}', 'gofrane.abidi@timsoft.com')
      .replace('{{mobilePhone}}', '+216 52 277 383')
      .replace('{{websiteUrl}}', 'www.timsoft.com');

    this.previewHtml = this.sanitizer.bypassSecurityTrustHtml(sample);
  }

  saveAsDraft() {
    this.selectedStatus = 0;
    this.save();
  }

  publish() {
    this.selectedStatus = 1;
    this.save();
  }

  save() {
    if (!this.signatureName) {
      alert('Le nom de la signature est obligatoire');
      return;
    }
    if (!this.selectedDepartmentId) {
      alert('Sélectionne un département');
      return;
    }

    const signature = {
      signatureName: this.signatureName,
      status: this.selectedStatus,
      typeTemplate: this.getTemplateTypeName(this.selectedTemplate),   
      departmentId: this.selectedDepartmentId,
      contenuHTML: this.htmlContent
    };

    this.signatureService.create(signature).subscribe({
      next: () => this.router.navigate(['/templates']),
      error: (err) => console.error(err)
    });
  }

  nextStep() { if (this.currentStep < 4) this.currentStep++; }
  prevStep() { if (this.currentStep > 1) this.currentStep--; }

  getTemplateTypeName(value: number): string {
  switch (value) {
    case 0: return 'MinimalClean';
    case 1: return 'ModernProfessional';
    default: return 'MinimalClean';
  }
}
}