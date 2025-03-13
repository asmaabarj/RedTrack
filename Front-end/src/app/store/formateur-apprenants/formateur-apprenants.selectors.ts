import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApprenantsState } from './formateur-apprenants.reducer';

export const selectApprenantsState = createFeatureSelector<ApprenantsState>('formateurApprenant');

export const selectApprenants = createSelector(
  selectApprenantsState,
  (state) => state.apprenants
);

export const selectLoading = createSelector(
  selectApprenantsState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectApprenantsState,
  (state) => state.error
);
