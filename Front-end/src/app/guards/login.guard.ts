import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, switchMap } from 'rxjs/operators';
import { selectAuthToken, selectAuthRole } from '../store/auth/auth.selectors';
import { StorageService } from '../services/storage.service';
import { of } from 'rxjs';

export const loginGuard = () => {
  const router = inject(Router);
  const store = inject(Store);
  const storageService = inject(StorageService);

  return store.select(selectAuthToken).pipe(
    take(1),
    switchMap(token => {
      const authData = token ? null : storageService.getAuth();
      
      if (token || authData?.token) {
        return store.select(selectAuthRole).pipe(
          take(1),
          map(role => {
            const currentRole = role || authData?.role;
            
            switch (currentRole) {
              case 'ADMIN':
                router.navigate(['/admin']);
                break;
              case 'FORMATEUR':
                router.navigate(['/formateur']);
                break;
              case 'APPRENANT':
                router.navigate(['/apprenant']);
                break;
            }
            return false;
          })
        );
      }
      
      return of(true);
    })
  );
};
