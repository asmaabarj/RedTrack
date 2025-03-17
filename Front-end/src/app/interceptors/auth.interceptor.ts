import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAuthToken } from '../store/auth/auth.selectors';
import { first, mergeMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as AuthActions from '../store/auth/auth.actions';

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
      return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            store.dispatch(AuthActions.logout());
          }
          return throwError(() => error);
        })
      );
    })
  );
};