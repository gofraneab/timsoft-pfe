import { Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';
import { TemplatesListComponent } from './pages/templates-list/templates-list.component';
import { CreateTemplateComponent } from './pages/create-template/create-template.component';
import { EditTemplateComponent } from './pages/edit-template/edit-template.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { RulesComponent } from './pages/rules/rules.component';
import { DepartmentsComponent } from './pages/departments/departments.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'templates', component: TemplatesListComponent },
  { path: 'templates/create', component: CreateTemplateComponent },
  { path: 'templates/edit/:id', component: EditTemplateComponent },
  { path: 'users', component: UsersComponent },
  { path: 'departments', component: DepartmentsComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'settings', component: SettingsComponent },
];
