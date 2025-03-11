import { createSelector } from '@ngrx/store';
import { ApprenantState } from './apprenant.reducer';

export const selectApprenantState = (state: any) => state.apprenant;

export const selectApprenants = createSelector(
  selectApprenantState,
  (state: ApprenantState) => state.apprenants
);

export const selectApprenantsLoading = createSelector(
  selectApprenantState,
  (state: ApprenantState) => state.loading
);

export const selectApprenantsError = createSelector(
  selectApprenantState,
  (state: ApprenantState) => state.error
); 