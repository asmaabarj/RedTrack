import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import { AuthActions } from './auth.actions';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { JwtService } from '../../services/jwt.service';
import { Role } from '../../models/user.model';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ request }) =>
        this.authService.login(request).pipe(
          map(response => {
            console.log('Login successful, response:', response);
            localStorage.setItem('token', response.token);
            return AuthActions.loginSuccess({ response });
          }),
          catchError(error => {
            console.error('Login failed:', error);
            return of(AuthActions.loginFailure({ error: error.message }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ response }) => {
          try {
            console.log('Processing login success, token:', response.token);
            const role = this.jwtService.extractRole(response.token);
            console.log('Extracted role:', role);

            switch (role) {
              case Role.ADMIN:
                console.log('Redirecting to admin dashboard...');
                this.router.navigate(['/dashboard-admin']);
                break;
              case Role.FORMATTEUR:
                this.router.navigate(['/dashboard-formatteur']);
                break;
              case Role.APPRENANT:
                this.router.navigate(['/dashboard-apprenant']);
                break;
              default:
                console.error('Unknown role:', role);
                this.router.navigate(['/login']);
            }
          } catch (error) {
            console.error('Error during redirection:', error);
          }
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private jwtService: JwtService
  ) {}
} 