import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
import { ClassService } from '../../services/class.service';
import * as ApprenantClassesActions from './apprenant-classes.action';

@Injectable()
export class ApprenantClassesEffects {
  loadApprenantClasses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApprenantClassesActions.loadApprenantClasses),
      tap(() => console.log('Effect: Loading apprenant classes')),
      mergeMap(() =>
        this.classService.getApprenantClasses().pipe(
          tap(classes => console.log('API Response:', classes)),
          map(classes => ApprenantClassesActions.loadApprenantClassesSuccess({ classes })),
          catchError(error => {
            console.error('API Error:', error);
            return of(ApprenantClassesActions.loadApprenantClassesFailure({ error: error.message }));
          })
        )
      )
    )
  );


  constructor(
    private actions$: Actions,
    private classService: ClassService
  ) {}
} 