import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RendusState } from './apprenant-rendus.reducer';

export const selectRendusState = createFeatureSelector<RendusState>('rendus');

export const selectRendus = createSelector(
  selectRendusState,
  state => state.etapes
);

export const selectLoading = createSelector(
  selectRendusState,
  state => state.loading
);

export const selectError = createSelector(
  selectRendusState,
  state => state.error
); 