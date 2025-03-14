import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormateurRendusState } from './formateur-rendus.reducer';

const selectFormateurRendusState = createFeatureSelector<FormateurRendusState>('formateurRendus');

export const selectEtapes = createSelector(
  selectFormateurRendusState,
  state => state.etapes
);

export const selectLoading = createSelector(
  selectFormateurRendusState,
  state => state.loading
);

export const selectError = createSelector(
  selectFormateurRendusState,
  state => state.error
); 