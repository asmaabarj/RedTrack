import { HttpInterceptorFn, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);

  if (token) {
    const clonedReq = req.clone({
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
    return next(clonedReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
  return next(req);
};
