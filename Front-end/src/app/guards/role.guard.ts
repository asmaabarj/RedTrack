import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectUserRole } from '../store/auth/auth.selectors';

export const roleGuard = (route: any) => {
  const store = inject(Store);
  const router = inject(Router);
  
  return store.select(selectUserRole).pipe(
    map(role => {
      if (role === route.data['role']) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
}; 