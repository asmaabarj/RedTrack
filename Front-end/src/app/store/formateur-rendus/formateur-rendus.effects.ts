import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as FormateurRendusActions from './formateur-rendus.actions';
import { FormateurRendusService } from '../../services/formateur-rendus.service';

@Injectable()
export class FormateurRendusEffects {
  constructor(
    private actions$: Actions,
    private formateurRendusService: FormateurRendusService
  ) {}

  loadApprenantRendus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FormateurRendusActions.loadApprenantRendus),
      mergeMap(({ apprenantId }) => 
        this.formateurRendusService.getApprenantRendus(apprenantId).pipe(
          map(etapes => FormateurRendusActions.loadApprenantRendusSuccess({ etapes })),
          catchError(error => of(FormateurRendusActions.loadApprenantRendusFailure({ error: error.message })))
        )
      )
    );
  });

  createRenduResponse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FormateurRendusActions.createRenduResponse),
      mergeMap(({ renduId, response }) =>
        this.formateurRendusService.createRenduResponse(renduId, response).pipe(
          map(createdResponse => FormateurRendusActions.createRenduResponseSuccess({ response: createdResponse })),
          catchError(error => of(FormateurRendusActions.createRenduResponseFailure({ error: error.message })))
        )
      )
    );
  });
} 