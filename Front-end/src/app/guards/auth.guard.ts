import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { selectAuthToken, selectAuthRole } from '../store/auth/auth.selectors';
import { StorageService } from '../services/storage.service';

export const authGuard = (allowedRoles?: string[]) => {
  const router = inject(Router);
  const store = inject(Store);
  const storageService = inject(StorageService);

  return store.select(selectAuthToken).pipe(
    take(1),
    switchMap(token => {
      const authData = token ? null : storageService.getAuth();
      if (authData?.token) {
        store.dispatch({
          type: '[Auth] Login Success',
          response: {
            token: authData.token,
            role: authData.role
          }
        });
        return store.select(selectAuthRole);
      }
      
      if (!token && !authData) {
        router.navigate(['/login']);
        return of(false);
      }

      return store.select(selectAuthRole).pipe(
        take(1),
        map(role => {
          if (!role || !allowedRoles?.includes(role)) {
            router.navigate(['/login']);
            return false;
          }
          return true;
        })
      );
    })
  );
};