import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import * as ApprenantActions from './apprenant.actions';

@Injectable()
export class ApprenantEffects {
  loadApprenants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApprenantActions.loadApprenants),
      mergeMap(() =>
        this.userService.getApprenants().pipe(
          map(response => ApprenantActions.loadApprenantsSuccess({ response })),
          catchError(error => 
            of(ApprenantActions.loadApprenantsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  archiveApprenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApprenantActions.archiveApprenant),
      mergeMap(({ id }) =>
        this.userService.archiveUser(id).pipe(
          map(() => ApprenantActions.archiveApprenantSuccess({ id })),
          catchError(error => 
            of(ApprenantActions.archiveApprenantFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}

  createApprenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApprenantActions.createApprenant),
      mergeMap(({ request }) =>
        this.userService.register(request).pipe(
          map(() => ApprenantActions.createApprenantSuccess()),
          catchError(error => 
            of(ApprenantActions.createApprenantFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createApprenantSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApprenantActions.createApprenantSuccess),
      map(() => ApprenantActions.loadApprenants())
    )
  );

  updateApprenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApprenantActions.updateApprenant),
      mergeMap(({ id, request, newClassId }) =>
        this.userService.updateUser(id, request).pipe(
          mergeMap(user => 
            this.userService.updateUserClass(id, newClassId).pipe(
              map(() => ApprenantActions.updateApprenantSuccess({ user }))
            )
          ),
          catchError(error => 
            of(ApprenantActions.updateApprenantFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateApprenantSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApprenantActions.updateApprenantSuccess),
      map(() => ApprenantActions.loadApprenants())
    )
  );

  loadArchivedApprenants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApprenantActions.loadArchivedApprenants),
      mergeMap(() =>
        this.userService.getArchivedApprenants().pipe(
          map(apprenants => {
            console.log('Archived apprenants loaded:', apprenants);
            return ApprenantActions.loadArchivedApprenantsSuccess({ apprenants });
          }),
          catchError(error => {
            console.error('Error loading archived apprenants:', error);
            return of(ApprenantActions.loadArchivedApprenantsFailure({ error: error.message }));
          })
        )
      )
    )
  );

  unarchiveApprenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApprenantActions.unarchiveApprenant),
      mergeMap(({ id }) =>
        this.userService.unarchiveUser(id).pipe(
          map(() => ApprenantActions.unarchiveApprenantSuccess()),
          catchError(error => 
            of(ApprenantActions.unarchiveApprenantFailure({ error: error.message }))
          )
        )
      )
    )
  );

  unarchiveApprenantSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApprenantActions.unarchiveApprenantSuccess),
      map(() => ApprenantActions.loadArchivedApprenants())
    )
  );
} 