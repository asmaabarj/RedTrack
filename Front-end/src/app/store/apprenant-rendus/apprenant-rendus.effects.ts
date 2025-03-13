import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as RendusActions from './apprenant-rendus.actions';
import { RenduService } from '../../services/rendu.service';

@Injectable()
export class RendusEffects {
  loadRendus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RendusActions.loadRendus),
      mergeMap(() => this.renduService.getEtapesAvecRendus()
        .pipe(
          map(etapes => RendusActions.loadRendusSuccess({ etapes })),
          catchError(error => of(RendusActions.loadRendusFailure({ error: error.message })))
        ))
    );
  });

  createRendu$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RendusActions.createRendu),
      mergeMap(({ rendu }) => 
        this.renduService.createRendu(rendu).pipe(
          map(createdRendu => RendusActions.createRenduSuccess({ rendu: createdRendu })),
          catchError(error => of(RendusActions.createRenduFailure({ error: error.message })))
        )
      )
    );
  });

  createRenduSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RendusActions.createRenduSuccess),
      map(() => RendusActions.loadRendus())
    );
  });

  constructor(
    private actions$: Actions,
    private renduService: RenduService
  ) {}
}