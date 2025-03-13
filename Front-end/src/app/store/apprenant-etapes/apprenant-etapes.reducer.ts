import { createReducer, on } from '@ngrx/store';
import { Etape } from '../../models/etape.model';
import * as ApprenantEtapesActions from './apprenant-etapes.actions';

export interface ApprenantEtapesState {
  etapes: Etape[];
  loading: boolean;
  error: string | null;
}

export const initialState: ApprenantEtapesState = {
  etapes: [],
  loading: false,
  error: null
};

export const apprenantEtapesReducer = createReducer(
  initialState,
  on(ApprenantEtapesActions.loadEtapes, state => ({
    ...state,
    loading: true
  })),
  on(ApprenantEtapesActions.loadEtapesSuccess, (state, { etapes }) => ({
    ...state,
    etapes,
    loading: false
  })),
  on(ApprenantEtapesActions.loadEtapesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
); 