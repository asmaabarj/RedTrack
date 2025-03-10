import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.authService.login(action.credentials).pipe(
          map((response) => {
            this.storageService.setAuth(response.token, response.role);
            return AuthActions.loginSuccess({ response });
          }),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ response }) => {
          switch (response.role) {
            case 'ADMIN':
              this.router.navigate(['/admin']);
              break;
            case 'APPRENANT':
              this.router.navigate(['/apprenant']);
              break;
            case 'FORMATEUR':
              this.router.navigate(['/formateur']);
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
        tap(() => {
          this.storageService.clearAuth();
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUserProfile),
      mergeMap(() =>
        this.authService.getUserProfile().pipe(
          map(profile => AuthActions.loadUserProfileSuccess({ profile })),
          catchError(error => of(AuthActions.loadUserProfileFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {}
}
