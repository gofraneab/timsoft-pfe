import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SignatureService } from '../../services/signature.service';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department';
import { Signature } from '../../models/signature';

@Component({
  selector: 'app-edit-template',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-template.component.html',
  styleUrl: './edit-template.component.css'
})
export class EditTemplateComponent implements OnInit {
  signatureId: number = 0;
  activeTab = 'editor';

  signatureName = '';
  description = '';
  selectedDepartmentId: number = 0;
  selectedStatus = 0;
  selectedTemplate = 0;
  htmlContent = '';

  departments: Department[] = [];
  previewHtml: SafeHtml = '';
  isLoading = true;

  editableFields: { [key: string]: boolean } = {
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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.departmentService.getAll().subscribe(data => this.departments = data);

    // Récupère l'id depuis l'URL
    this.signatureId = Number(this.route.snapshot.paramMap.get('id'));

    // Charge la signature existante
    this.signatureService.getById(this.signatureId).subscribe({
      next: (sig: Signature) => {
        this.signatureName = sig.signatureName;
        this.selectedDepartmentId = sig.departmentId;
        this.selectedStatus = sig.status;
        this.selectedTemplate = sig.typeTemplate;
        this.htmlContent = sig.contenuHTML || '';
        this.isLoading = false;
        this.updatePreview();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  updatePreview() {
    const sampleUser: { [key: string]: string } = {
      firstName: 'Gofrane',
      lastName: 'Abidi',
      position: 'Senior IT Manager',
      department: 'IT',
      businessEmail: 'gofrane.abidi@timsoft.com',
      mobilePhone: '+216 52 277 383',
      websiteUrl: 'www.timsoft.com',
      linkedInUrl: 'linkedin.com/in/gofrane',
      companyName: 'Timsoft',
      address: 'Les Berges du Lac, Tunis'
    };

    let html = this.htmlContent;
    Object.entries(sampleUser).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    this.previewHtml = this.sanitizer.bypassSecurityTrustHtml(html);
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

    const signature = {
      signatureName: this.signatureName,
      status: this.selectedStatus,
      typeTemplate: this.selectedTemplate,
      departmentId: this.selectedDepartmentId,
      contenuHTML: this.htmlContent
    };

    this.signatureService.update(this.signatureId, signature).subscribe({
      next: () => this.router.navigate(['/templates']),
      error: (err) => console.error(err)
    });
  }
}