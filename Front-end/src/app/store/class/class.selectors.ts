import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClassState } from './class.reducer';

export const selectClassState = createFeatureSelector<ClassState>('class');

export const selectClasses = createSelector(
  selectClassState,
  state => state.classes
);

export const selectClassesLoading = createSelector(
  selectClassState,
  state => state.loading
);

export const selectClassesError = createSelector(
  selectClassState,
  state => state.error
);

export const selectArchivedClasses = createSelector(
  selectClassState,
  state => state.archivedClasses
); 