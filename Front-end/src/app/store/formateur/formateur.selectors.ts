import { createSelector } from '@ngrx/store';
import { FormateurState } from './formateur.reducer';

export const selectFormateurState = (state: any) => state.formateur;

export const selectFormateurs = createSelector(
  selectFormateurState,
  (state: FormateurState) => state.formateurs
);

export const selectFormateursLoading = createSelector(
  selectFormateurState,
  (state: FormateurState) => state.loading
);

export const selectFormateursError = createSelector(
  selectFormateurState,
  (state: FormateurState) => state.error
); 