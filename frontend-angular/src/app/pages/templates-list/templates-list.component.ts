import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SignatureService } from '../../services/signature.service';
import { Signature } from '../../models/signature';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-templates-list',
    standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './templates-list.component.html',
  styleUrl: './templates-list.component.css'
})
export class TemplatesListComponent implements OnInit {
allSignatures: Signature[] = [];
  filteredSignatures: Signature[] = [];
  activeTab: string = 'all';
  constructor(private signatureService: SignatureService, private sanitizer: DomSanitizer) {}
  

  ngOnInit() {
     this.loadSignatures();
  }
  loadSignatures() {
    this.signatureService.getAll().subscribe({
      next: (data) => {
        this.allSignatures = data;
        this.filterByTab('all');
      },
      error: (err) => console.error(err)
    });
  }
 filterByTab(tab: string) {
    this.activeTab = tab;
    switch(tab) {
      case 'all':
        this.filteredSignatures = this.allSignatures;
        break;
      case 'active':
        this.filteredSignatures = this.allSignatures.filter(s => s.status === 1);
        break;
      case 'draft':
        this.filteredSignatures = this.allSignatures.filter(s => s.status === 0);
        break;
      case 'disabled':
        this.filteredSignatures = this.allSignatures.filter(s => s.status === 2);
        break;
    }
  }
  countByStatus(status: number): number {
    return this.allSignatures.filter(s => s.status === status).length;
  }

  deleteSignature(id: number) {
    if(confirm('Supprimer cette signature ?')) {
      this.signatureService.delete(id).subscribe({
        next: () => this.loadSignatures(),
        error: (err) => console.error(err)
      });
    }
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

  getPreviewColor(type: number): string {
    const colors: any = { 0: '#e8f4e8', 1: '#e8eef8' };
    return colors[type] || '#f0f0f0';
  }

  sanitize(html: string): SafeHtml {
  let preview = html
    .replace(/{{firstName}}/g, 'Gofrane')
    .replace(/{{lastName}}/g, 'Abidi')
    .replace(/{{position}}/g, 'IT Manager')
    .replace(/{{department}}/g, 'IT')
    .replace(/{{businessEmail}}/g, 'g.abidi@timsoft.com')
    .replace(/{{mobilePhone}}/g, '+216 52 277 383')
    .replace(/{{websiteUrl}}/g, 'www.timsoft.com');

  return this.sanitizer.bypassSecurityTrustHtml(preview);
}
}
