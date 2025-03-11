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
} 