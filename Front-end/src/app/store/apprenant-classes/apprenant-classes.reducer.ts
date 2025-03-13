import { createReducer, on } from '@ngrx/store';
import { Class } from '../../models/class.model';
import * as ApprenantClassesActions from './apprenant-classes.action';

export interface ApprenantClassesState {
  classes: Class[];
  loading: boolean;
  error: string | null;
}

export const initialState: ApprenantClassesState = {
  classes: [],
  loading: false,
  error: null
};

export const apprenantClassesReducer = createReducer(
  initialState,
  on(ApprenantClassesActions.loadApprenantClasses, state => ({
    ...state,
    loading: true
  })),
  on(ApprenantClassesActions.loadApprenantClassesSuccess, (state, { classes }) => ({
    ...state,
    classes,
    loading: false
  })),
  on(ApprenantClassesActions.loadApprenantClassesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
); 