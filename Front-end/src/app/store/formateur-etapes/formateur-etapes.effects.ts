import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
import { EtapeService } from '../../services/etape.service';
import * as FormateurEtapesActions from './formateur-etapes.actions';

@Injectable()
export class FormateurEtapesEffects {
  loadEtapes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurEtapesActions.loadEtapes),
      tap(() => console.log('Loading etapes...')),
      mergeMap(() =>
        this.etapeService.getAllEtapes().pipe(
          tap(etapes => console.log('Etapes loaded:', etapes)),
          map(etapes => FormateurEtapesActions.loadEtapesSuccess({ etapes })),
          catchError(error => {
            console.error('Error loading etapes:', error);
            return of(FormateurEtapesActions.loadEtapesFailure({ error: error.message }));
          })
        )
      )
    )
  );

  createEtape$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurEtapesActions.createEtape),
      mergeMap(({ etape }) =>
        this.etapeService.createEtape(etape).pipe(
          map(createdEtape => FormateurEtapesActions.createEtapeSuccess({ etape: createdEtape })),
          catchError(error => of(FormateurEtapesActions.createEtapeFailure({ error: error.message })))
        )
      )
    )
  );

  createEtapeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurEtapesActions.createEtapeSuccess),
      map(() => FormateurEtapesActions.loadEtapes())
    )
  );

  updateEtape$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurEtapesActions.updateEtape),
      mergeMap(({ id, etape }) =>
        this.etapeService.updateEtape(id, etape).pipe(
          map(updatedEtape => FormateurEtapesActions.updateEtapeSuccess({ etape: updatedEtape })),
          catchError(error => of(FormateurEtapesActions.updateEtapeFailure({ error: error.message })))
        )
      )
    )
  );

  updateEtapeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormateurEtapesActions.updateEtapeSuccess),
      map(() => FormateurEtapesActions.loadEtapes())
    )
  );

  constructor(
    private actions$: Actions,
    private etapeService: EtapeService
  ) {}
} 