import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
import { ClassService } from '../../services/class.service';
import * as FormateurClassesActions from './formateur-classes.actions';

@Injectable()
export class FormateurClassesEffects {
  loadFormateurClasses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurClassesActions.loadFormateurClasses),
      tap(() => console.log('Effect: Loading formateur classes')),
      mergeMap(() =>
        this.classService.getFormateurClasses().pipe(
          tap(classes => console.log('API Response:', classes)),
          map(classes => FormateurClassesActions.loadFormateurClassesSuccess({ classes })),
          catchError(error => {
            console.error('API Error:', error);
            return of(FormateurClassesActions.loadFormateurClassesFailure({ error: error.message }));
          })
        )
      )
    )
  );

  updateClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurClassesActions.updateClass),
      mergeMap(({ id, class: classData }) =>
        this.classService.updateFormateurClass(id, classData).pipe(
          map(updatedClass => FormateurClassesActions.updateClassSuccess({ class: updatedClass })),
          catchError(error => of(FormateurClassesActions.updateClassFailure({ error: error.message })))
        )
      )
    )
  );

  updateClassSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurClassesActions.updateClassSuccess),
      map(() => FormateurClassesActions.loadFormateurClasses())
    )
  );

  constructor(
    private actions$: Actions,
    private classService: ClassService
  ) {}
} 