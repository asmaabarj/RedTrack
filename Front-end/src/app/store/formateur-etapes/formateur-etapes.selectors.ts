import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormateurEtapesState } from './formateur-etapes.reducer';

export const selectFormateurEtapesState = createFeatureSelector<FormateurEtapesState>('formateurEtapes');

export const selectEtapes = createSelector(
  selectFormateurEtapesState,
  state => state.etapes
);

export const selectEtapesLoading = createSelector(
  selectFormateurEtapesState,
  state => state.loading
); 