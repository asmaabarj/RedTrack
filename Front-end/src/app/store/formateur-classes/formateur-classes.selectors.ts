import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormateurClassesState } from './formateur-classes.reducer';

export const selectFormateurClassesState = createFeatureSelector<FormateurClassesState>('formateurClasses');

export const selectFormateurClasses = createSelector(
  selectFormateurClassesState,
  state => state.classes
);

export const selectFormateurClassesLoading = createSelector(
  selectFormateurClassesState,
  state => state.loading
);

export const selectFormateurClassesError = createSelector(
  selectFormateurClassesState,
  state => state.error
); 