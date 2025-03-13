import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApprenantEtapesState } from './apprenant-etapes.reducer';

export const selectApprenantEtapesState = createFeatureSelector<ApprenantEtapesState>('apprenantEtapes');

export const selectEtapes = createSelector(
  selectApprenantEtapesState,
  state => state.etapes
);

export const selectEtapesLoading = createSelector(
    selectApprenantEtapesState,
  state => state.loading
); 