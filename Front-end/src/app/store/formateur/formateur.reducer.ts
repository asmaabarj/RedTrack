import { createReducer, on } from '@ngrx/store';
import * as FormateurActions from './formateur.actions';
import { User } from '../../models/user.model';

export interface FormateurState {
  formateurs: User[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

export const initialState: FormateurState = {
  formateurs: [],
  totalElements: 0,
  loading: false,
  error: null
};

export const formateurReducer = createReducer(
  initialState,
  on(FormateurActions.loadFormateurs, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(FormateurActions.loadFormateursSuccess, (state, { response }) => ({
    ...state,
    formateurs: response.content,
    totalElements: response.totalElements,
    loading: false
  })),
  on(FormateurActions.loadFormateursFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(FormateurActions.archiveFormateurSuccess, (state, { id }) => ({
    ...state,
    formateurs: state.formateurs.filter(formateur => formateur.id !== id)
  })),
  on(FormateurActions.loadArchivedFormateurs, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(FormateurActions.loadArchivedFormateursSuccess, (state, { formateurs }) => ({
    ...state,
    formateurs,
    loading: false
  })),
  on(FormateurActions.loadArchivedFormateursFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
); 