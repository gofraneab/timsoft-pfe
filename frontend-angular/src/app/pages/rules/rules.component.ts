import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.css'
})
export class RulesComponent {
  rules = [
    {
      id: 1,
      name: 'Signature obligatoire RH',
      description: 'Tous les emails du département RH doivent utiliser la signature officielle',
      department: 'Ressources Humaines',
      active: true
    },
    {
      id: 2,
      name: 'Template IT par défaut',
      description: 'Le département IT utilise le template Modern Professional',
      department: 'Informatique',
      active: true
    },
    {
      id: 3,
      name: 'Signature Marketing',
      description: 'Le département Marketing utilise le template Minimal Clean',
      department: 'Marketing',
      active: false
    }
  ];

  showModal = false;
  newRule = { name: '', description: '', department: '', active: true };

  openModal() {
    this.newRule = { name: '', description: '', department: '', active: true };
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  addRule() {
    if (!this.newRule.name) { alert('Nom obligatoire'); return; }
    this.rules.push({ id: Date.now(), ...this.newRule });
    this.closeModal();
  }

  toggleRule(rule: any) { rule.active = !rule.active; }

  deleteRule(id: number) {
    if (confirm('Supprimer cette règle ?')) {
      this.rules = this.rules.filter(r => r.id !== id);
    }
  }
}