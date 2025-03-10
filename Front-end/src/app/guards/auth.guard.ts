import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

export function authGuard(allowedRoles: string[]) {
  const router = inject(Router);
  const storageService = inject(StorageService);

  if (!storageService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const authData = storageService.getAuth();
  
  if (!authData || !authData.role) {
    storageService.clearAuth(); 
    router.navigate(['/login']);
    return false;
  }

  if (!allowedRoles.includes(authData.role)) {
    switch (authData.role) {
      case 'ADMIN':
        router.navigate(['/admin']);
        break;
      case 'FORMATEUR':
        router.navigate(['/formateur']);
        break;
      case 'APPRENANT':
        router.navigate(['/apprenant']);
        break;
      default:
        router.navigate(['/login']);
    }
    return false;
  }

  return true;
}