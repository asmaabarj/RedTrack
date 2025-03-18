import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import * as AuthActions from './auth.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.authService.login(action.credentials).pipe(
          map((response) => {
            if (response && response.token && response.role) {
              this.storageService.setAuth(response.token, response.role);
              return AuthActions.loginSuccess({ response, isNewLogin: true });
            }
            return AuthActions.loginFailure({ error: 'Réponse invalide du serveur' });
          }),
          catchError((error) => {
            let errorMessage = 'Email ou mot de passe incorrect';
            
            if (error.status === 423) {
              errorMessage = 'Votre compte a été désactivé. Veuillez contacter l\'administrateur.';
            } else if (error.status === 403 && error.error?.message) {
              errorMessage = error.error.message;
            }
            
            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ response, isNewLogin }) => {
          if (isNewLogin) {
            if (response.role) {
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
                default:
                  this.store.dispatch(AuthActions.logout());
              }
            }
          }
        })
      ),
    { dispatch: false }
  );

  checkStoredAuth$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.checkStoredAuth),
    map(() => {
      const authData = this.storageService.getAuth();
      if (authData) {
        return AuthActions.loginSuccess({ response: authData, isNewLogin: false });
      }
      return AuthActions.logout();
    })
  ));

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
    private router: Router,
    private store: Store
  ) {}
}
