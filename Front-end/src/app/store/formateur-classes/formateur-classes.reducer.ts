import { createReducer, on } from '@ngrx/store';
import { Class } from '../../models/class.model';
import * as FormateurClassesActions from './formateur-classes.actions';

export interface FormateurClassesState {
  classes: Class[];
  loading: boolean;
  error: string | null;
}

export const initialState: FormateurClassesState = {
  classes: [],
  loading: false,
  error: null
};

export const formateurClassesReducer = createReducer(
  initialState,
  on(FormateurClassesActions.loadFormateurClasses, state => ({
    ...state,
    loading: true
  })),
  on(FormateurClassesActions.loadFormateurClassesSuccess, (state, { classes }) => ({
    ...state,
    classes,
    loading: false
  })),
  on(FormateurClassesActions.loadFormateurClassesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
); 