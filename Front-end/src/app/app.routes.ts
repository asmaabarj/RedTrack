import { Routes } from '@angular/router';
import { LoginComponent } from './pages/authentification/login/login.component';
import { authGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { FormatteurDashboardComponent } from './pages/formatteur/formatteur-dashboard/formatteur-dashboard.component';
import { ApprenantDashboardComponent } from './pages/apprenant/apprenant-dashboard/apprenant-dashboard.component';
import { ClassesListComponent } from './pages/admin/manage-classes/classes-list/classes-list.component';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  {
    path: 'dashboard-admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'dashboard-formatteur',
    component: FormatteurDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'FORMATEUR' }
  },
  {
    path: 'dashboard-apprenant',
    component: ApprenantDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'APPRENANT' }
  },
  {
    path: 'admin/classes',
    component: ClassesListComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
  