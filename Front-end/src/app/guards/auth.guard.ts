import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectAuthToken } from '../store/auth/auth.selectors';

export const authGuard = () => {
  const store = inject(Store);
  const router = inject(Router);
  
  return store.select(selectAuthToken).pipe(
    map(token => {
      if (token) return true;
      router.navigate(['/login']);
      return false;
    })
  );
}; 