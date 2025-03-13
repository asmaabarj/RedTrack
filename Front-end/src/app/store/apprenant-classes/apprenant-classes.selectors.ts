import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApprenantClassesState } from './apprenant-classes.reducer';

export const selectApprenantClassesState = createFeatureSelector<ApprenantClassesState>('apprenantClasses');

export const selectApprenantClasses= createSelector(
  selectApprenantClassesState,
  state => state.classes
);

export const selectApprenantClassesLoading = createSelector(
  selectApprenantClassesState,
  state => state.loading
);

export const selectApprenantClassesError = createSelector(
  selectApprenantClassesState,
  state => state.error
); 