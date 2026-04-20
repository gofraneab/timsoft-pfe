import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  settings = {
    companyName: 'Timsoft Group',
    companyEmail: 'contact@timsoft-group.com',
    companyPhone: '+216 70 860 870',
    companyAddress: 'Imm. Les Arcades, Rue Lac Loch Ness, Tunis 1053',
    companyWebsite: 'www.timsoft-group.com',
    logoUrl: '',
    defaultTemplate: 0,
    autoApplySignature: true,
    allowUserCustomization: false,
    emailNotifications: true
  };

  saved = false;

  saveSettings() {
    this.saved = true;
    setTimeout(() => this.saved = false, 3000);
  }
}