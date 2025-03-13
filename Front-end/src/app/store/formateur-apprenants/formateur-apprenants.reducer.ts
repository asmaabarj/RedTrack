import { createReducer, on } from '@ngrx/store';
import { 
  loadApprenants, 
  loadApprenantsSuccess, 
  loadApprenantsFailure, 
  loadArchivedApprenants, 
  loadArchivedApprenantsSuccess, 
  loadArchivedApprenantsFailure,
  archiveApprenantSuccess, 
  unarchiveApprenantSuccess, 
  createApprenantSuccess, 
  createApprenantFailure,
  updateApprenantSuccess
} from './formateur-apprenants.actions';
import { User } from '../../models/user.model';

export interface ApprenantsState {
  apprenants: User[];
  loading: boolean;
  error: string | null;
}

export const initialState: ApprenantsState = {
  apprenants: [],
  loading: false,
  error: null
};

export const formateurApprenantReducer = createReducer(
  initialState,
  on(loadApprenants, state => ({ ...state, loading: true, error: null })),
  on(loadApprenantsSuccess, (state, { apprenants }) => ({ ...state, apprenants, loading: false })),
  on(loadApprenantsFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(loadArchivedApprenants, state => ({ ...state, loading: true, error: null })),
  on(loadArchivedApprenantsSuccess, (state, { apprenants }) => ({ ...state, apprenants, loading: false })),
  on(loadArchivedApprenantsFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(archiveApprenantSuccess, (state, { apprenantId }) => ({
    ...state,
    apprenants: state.apprenants.filter(apprenant => apprenant.id !== apprenantId)
  })),

  on(unarchiveApprenantSuccess, (state, { apprenantId }) => ({
    ...state,
    apprenants: state.apprenants.map(apprenant =>
      apprenant.id === apprenantId ? { ...apprenant, archived: false } : apprenant
    )
  })),

  on(createApprenantSuccess, (state, { apprenant }) => ({
    ...state,
    apprenants: [...state.apprenants, apprenant]
  })),

  on(createApprenantFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(updateApprenantSuccess, (state, { apprenant }) => ({
    ...state,
    apprenants: state.apprenants.map(a => 
      a.id === apprenant.id ? apprenant : a
    )
  }))
);
