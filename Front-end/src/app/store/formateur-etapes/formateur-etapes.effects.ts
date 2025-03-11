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

  constructor(
    private actions$: Actions,
    private etapeService: EtapeService
  ) {}
} 