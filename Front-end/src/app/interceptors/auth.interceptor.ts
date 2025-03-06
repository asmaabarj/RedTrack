import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAuthToken } from '../store/auth/auth.selectors';
import { first, mergeMap } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  
  return store.select(selectAuthToken).pipe(
    first(),
    mergeMap(token => {
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      return next(req);
    })
  );
};
