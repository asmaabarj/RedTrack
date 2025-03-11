import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import * as FormateurActions from './formateur.actions';

@Injectable()
export class FormateurEffects {
  loadFormateurs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurActions.loadFormateurs),
      mergeMap(() =>
        this.userService.getFormateurs().pipe(
          map(response => FormateurActions.loadFormateursSuccess({ response })),
          catchError(error => 
            of(FormateurActions.loadFormateursFailure({ error: error.message }))
          )
        )
      )
    )
  );

  archiveFormateur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurActions.archiveFormateur),
      mergeMap(({ id }) =>
        this.userService.archiveUser(id).pipe(
          map(() => FormateurActions.archiveFormateurSuccess({ id })),
          catchError(error => 
            of(FormateurActions.archiveFormateurFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createFormateur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurActions.createFormateur),
      mergeMap(({ request }) =>
        this.userService.register(request).pipe(
          map(() => FormateurActions.createFormateurSuccess()),
          catchError(error => 
            of(FormateurActions.createFormateurFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createFormateurSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurActions.createFormateurSuccess),
      map(() => FormateurActions.loadFormateurs())
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}
} 