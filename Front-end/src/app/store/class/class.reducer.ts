import { createReducer, on } from '@ngrx/store';
import * as ClassActions from './class.actions';
import { Class } from '../../models/class.model';

export interface ClassState {
  classes: Class[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

export const initialState: ClassState = {
  classes: [],
  totalElements: 0,
  loading: false,
  error: null
};

export const classReducer = createReducer(
  initialState,
  on(ClassActions.loadClasses, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ClassActions.loadClassesSuccess, (state, { response }) => ({
    ...state,
    classes: response.content,
    totalElements: response.totalElements,
    loading: false
  })),
  on(ClassActions.loadClassesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
); 