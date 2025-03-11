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

  updateFormateur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurActions.updateFormateur),
      mergeMap(({ id, request, newClassId }) =>
        this.userService.updateUser(id, request).pipe(
          mergeMap(user => 
            this.userService.updateUserClass(id, newClassId).pipe(
              map(() => FormateurActions.updateFormateurSuccess({ user }))
            )
          ),
          catchError(error => 
            of(FormateurActions.updateFormateurFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateFormateurSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurActions.updateFormateurSuccess),
      map(() => FormateurActions.loadFormateurs())
    )
  );

  loadArchivedFormateurs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurActions.loadArchivedFormateurs),
      mergeMap(() =>
        this.userService.getArchivedFormateurs().pipe(
          map(formateurs => FormateurActions.loadArchivedFormateursSuccess({ formateurs })),
          catchError(error => 
            of(FormateurActions.loadArchivedFormateursFailure({ error: error.message }))
          )
        )
      )
    )
  );

  unarchiveFormateur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurActions.unarchiveFormateur),
      mergeMap(({ id }) =>
        this.userService.unarchiveUser(id).pipe(
          map(() => FormateurActions.unarchiveFormateurSuccess()),
          catchError(error => 
            of(FormateurActions.unarchiveFormateurFailure({ error: error.message }))
          )
        )
      )
    )
  );

  unarchiveFormateurSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurActions.unarchiveFormateurSuccess),
      map(() => FormateurActions.loadArchivedFormateurs())
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}
} 