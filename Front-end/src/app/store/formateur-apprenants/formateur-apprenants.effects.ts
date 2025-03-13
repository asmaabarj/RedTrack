import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { FormateurService } from '../../services/formateur.service';
import { 
  loadApprenants, 
  loadApprenantsSuccess, 
  loadApprenantsFailure, 
  loadArchivedApprenants, 
  loadArchivedApprenantsSuccess, 
  loadArchivedApprenantsFailure, 
  archiveApprenant, 
  archiveApprenantSuccess, 
  archiveApprenantFailure, 
  unarchiveApprenant, 
  unarchiveApprenantSuccess, 
  unarchiveApprenantFailure, 
  createApprenant, 
  createApprenantSuccess, 
  createApprenantFailure, 
  updateApprenant, 
  updateApprenantSuccess, 
  updateApprenantFailure 
} from './formateur-apprenants.actions';

@Injectable()
export class FormateurApprenantEffects {
  constructor(private actions$: Actions, private formateurService: FormateurService) {}

  // Load Apprenants Effect
  loadApprenants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadApprenants),
      mergeMap(() =>
        this.formateurService.getApprenants().pipe(
          map(response => loadApprenantsSuccess({ apprenants: response.content })),
          catchError(error => of(loadApprenantsFailure({ error: error.message })))
        )
      )
    )
  );

  // Load Archived Apprenants Effect
  loadArchivedApprenants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadArchivedApprenants),
      mergeMap(() =>
        this.formateurService.getArchivedApprenants().pipe(
          map(response => loadArchivedApprenantsSuccess({ apprenants: response.content })),
          catchError(error => of(loadArchivedApprenantsFailure({ error: error.message })))
        )
      )
    )
  );

  // Archive Apprenant Effect
  archiveApprenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(archiveApprenant),
      mergeMap(({ apprenantId }) =>
        this.formateurService.archiveApprenant(apprenantId).pipe(
          map(() => archiveApprenantSuccess({ apprenantId })),
          catchError(error => of(archiveApprenantFailure({ error: error.message })))
        )
      )
    )
  );

  // Unarchive Apprenant Effect
  unarchiveApprenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(unarchiveApprenant),
      mergeMap(({ apprenantId }) =>
        this.formateurService.unarchiveApprenant(apprenantId).pipe(
          map(() => unarchiveApprenantSuccess({ apprenantId })),
          catchError(error => of(unarchiveApprenantFailure({ error: error.message })))
        )
      )
    )
  );

  createApprenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createApprenant),
      mergeMap(({ request }) =>
        this.formateurService.createApprenant(request).pipe(
          map(apprenant => createApprenantSuccess({ apprenant })),
          catchError(error => of(createApprenantFailure({ error: error.message })))
        )
      )
    )
  );

  updateApprenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateApprenant),
      mergeMap(({ apprenantId, request }) =>
        this.formateurService.updateApprenant(apprenantId, request).pipe(
          map(apprenant => updateApprenantSuccess({ apprenant })),
          catchError(error => of(updateApprenantFailure({ error: error.message })))
        )
      )
    )
  );
}
