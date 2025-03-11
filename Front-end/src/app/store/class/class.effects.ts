import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ClassService } from '../../services/class.service';
import * as ClassActions from './class.actions';

@Injectable()
export class ClassEffects {
  loadClasses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClassActions.loadClasses),
      mergeMap(() =>
        this.classService.getClasses().pipe(
          map(response => ClassActions.loadClassesSuccess({ response })),
          catchError(error => 
            of(ClassActions.loadClassesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClassActions.createClass),
      mergeMap(({ request }) =>
        this.classService.createClass(request).pipe(
          map(classe => ClassActions.createClassSuccess({ class: classe })),
          catchError(error => 
            of(ClassActions.createClassFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private classService: ClassService
  ) {}
}