import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { FormateurDashboardComponent } from './pages/formateur/formateur-dashboard/formateur-dashboard.component';
import { ApprenantsListComponent } from './pages/formateur/manage-apprenants/apprenants-list/apprenants-list.component';

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
    component: FormateurDashboardComponent,
    canActivate: [() => authGuard(['FORMATEUR'])]
  },
  {
    path: 'admin/classes',
    loadComponent: () => import('./pages/admin/manage-classes/classes-list/classes-list.component')
      .then(m => m.ClassesListComponent),
    canActivate: [() => authGuard(['ADMIN'])]
  },
  {
    path: 'admin/formateurs',
    loadComponent: () => import('./pages/admin/manage-formateurs/formateurs-list/formateurs-list.component')
      .then(m => m.FormateursListComponent),
    canActivate: [() => authGuard(['ADMIN'])]
  },
  {
    path: 'admin/apprenants',
    loadComponent: () => import('./pages/admin/manage-apprenants/apprenants-list/apprenants-list.component')
      .then(m => m.ApprenantsListComponent),
    canActivate: [() => authGuard(['ADMIN'])]
  },
  {
    path: 'formateur/apprenants',
    loadComponent: () => import('./pages/formateur/manage-apprenants/apprenants-list/apprenants-list.component')
      .then(m => m.ApprenantsListComponent),
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
