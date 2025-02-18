import { Routes } from '@angular/router';
import { LoginComponent } from './pages/authentification/login/login.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { Role } from './models/user.model';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard-admin',
    loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: Role.ADMIN }
  },
  {
    path: 'dashboard-formatteur',
    loadComponent: () => import('./pages/formatteur/formatteur-dashboard/formatteur-dashboard.component').then(m => m.FormatteurDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: Role.FORMATTEUR }
  },
  {
    path: 'dashboard-apprenant',
    loadComponent: () => import('./pages/apprenant/apprenant-dashboard/apprenant-dashboard.component').then(m => m.ApprenantDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: Role.APPRENANT }
  },
  { path: '**', redirectTo: 'login' }
];
  