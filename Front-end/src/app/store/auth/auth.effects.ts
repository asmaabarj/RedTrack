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
            localStorage.setItem('token', response.token);
            return AuthActions.loginSuccess({ response });
          }),
          catchError(error => 
            of(AuthActions.loginFailure({ error: error.error.message }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ response }) => {
          const role = this.jwtService.extractRole(response.token);
          switch (role) {
            case Role.ADMIN:
              this.router.navigate(['/dashboard-admin']);
              break;
            case Role.FORMATTEUR:
              this.router.navigate(['/dashboard-formatteur']);
              break;
            case Role.APPRENANT:
              this.router.navigate(['/dashboard-apprenant']);
              break;
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