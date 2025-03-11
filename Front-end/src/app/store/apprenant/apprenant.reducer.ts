import { createReducer, on } from '@ngrx/store';
import * as ApprenantActions from './apprenant.actions';
import { User } from '../../models/user.model';

export interface ApprenantState {
  apprenants: User[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

export const initialState: ApprenantState = {
  apprenants: [],
  totalElements: 0,
  loading: false,
  error: null
};

export const apprenantReducer = createReducer(
  initialState,
  on(ApprenantActions.loadApprenants, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ApprenantActions.loadApprenantsSuccess, (state, { response }) => ({
    ...state,
    apprenants: response.content,
    totalElements: response.totalElements,
    loading: false
  })),
  on(ApprenantActions.loadApprenantsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(ApprenantActions.archiveApprenantSuccess, (state, { id }) => ({
    ...state,
    apprenants: state.apprenants.map(apprenant =>
      apprenant.id === id ? { ...apprenant, active: false } : apprenant
    )
  })),
  on(ApprenantActions.loadArchivedApprenants, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ApprenantActions.loadArchivedApprenantsSuccess, (state, { apprenants }) => ({
    ...state,
    apprenants,
    loading: false
  })),
  on(ApprenantActions.loadArchivedApprenantsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
); 