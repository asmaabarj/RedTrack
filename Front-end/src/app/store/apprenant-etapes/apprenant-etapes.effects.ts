import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
import { EtapeService } from '../../services/etape.service';
import * as ApprenantEtapesActions from './apprenant-etapes.actions';

@Injectable()
export class ApprenantEtapesEffects {
  loadEtapes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApprenantEtapesActions.loadEtapes),
      tap(() => console.log('Loading etapes...')),
      mergeMap(() =>
        this.etapeService.getApprenantEtapes().pipe(
          tap(etapes => console.log('Etapes loaded:', etapes)),
          map(etapes => ApprenantEtapesActions.loadEtapesSuccess({ etapes })),
          catchError(error => {
            console.error('Error loading etapes:', error);
            return of(ApprenantEtapesActions.loadEtapesFailure({ error: error.message }));
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