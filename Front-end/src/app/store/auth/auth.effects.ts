import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';
import { switchMap, map, catchError, tap, exhaustMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { JwtService } from '../../services/jwt.service';
import { StorageService } from '../../services/storage.service';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(action =>
        this.authService.login(action.credentials).pipe(
          map(response => AuthActions.loginSuccess({ 
            token: response.token, 
            role: response.role 
          })),
          catchError(error => of(AuthActions.loginFailure({ 
            error: error.error?.message || 'Email ou mot de passe incorrect' 
          })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token, role }) => {
          this.storageService.saveAuth({ token, role });
          switch (role) {
            case 'ADMIN':
              this.router.navigate(['/dashboard-admin']);
              break;
            case 'FORMATEUR':
              this.router.navigate(['/dashboard-formatteur']);
              break;
            case 'APPRENANT':
              this.router.navigate(['/dashboard-apprenant']);
              break;
          }
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        exhaustMap(() => 
          this.authService.logout().pipe(
            tap(() => {
              this.storageService.clearAuth();
              this.router.navigate(['/login']);
            }),
            catchError(error => {
              console.error('Logout error:', error);
              this.storageService.clearAuth();
              this.router.navigate(['/login']);
              return of(error);
            })
          )
        )
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private jwtService: JwtService,
    private storageService: StorageService
  ) {}
} 