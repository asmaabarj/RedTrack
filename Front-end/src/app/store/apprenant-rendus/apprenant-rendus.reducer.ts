import { createReducer, on } from '@ngrx/store';
import { EtapeAvecRendus } from '../../models/rendu.model';
import * as RendusActions from './apprenant-rendus.actions';

export interface RendusState {
  etapes: EtapeAvecRendus[];
  loading: boolean;
  error: string | null;
}

export const initialState: RendusState = {
  etapes: [],
  loading: false,
  error: null
};

export const rendusReducer = createReducer(
  initialState,
  on(RendusActions.loadRendus, state => ({
    ...state,
    loading: true
  })),
  on(RendusActions.loadRendusSuccess, (state, { etapes }) => ({
    ...state,
    etapes,
    loading: false,
    error: null
  })),
  on(RendusActions.loadRendusFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
); 