import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/authentification/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [() => authGuard(['ADMIN'])]
  },
  {
    path: 'apprenant',
    loadComponent: () => import('./pages/apprenant/apprenant-dashboard/apprenant-dashboard.component').then(m => m.ApprenantDashboardComponent),
    canActivate: [() => authGuard(['APPRENANT'])]
  },
  {
    path: 'formateur',
    loadComponent: () => import('./pages/formateur/formateur-dashboard/formateur-dashboard.component').then(m => m.FormateurDashboardComponent),
    canActivate: [() => authGuard(['FORMATEUR'])]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
