import { createReducer, on } from '@ngrx/store';
import { Etape } from '../../models/etape.model';
import * as FormateurEtapesActions from './formateur-etapes.actions';

export interface FormateurEtapesState {
  etapes: Etape[];
  loading: boolean;
  error: string | null;
}

export const initialState: FormateurEtapesState = {
  etapes: [],
  loading: false,
  error: null
};

export const formateurEtapesReducer = createReducer(
  initialState,
  on(FormateurEtapesActions.loadEtapes, state => ({
    ...state,
    loading: true
  })),
  on(FormateurEtapesActions.loadEtapesSuccess, (state, { etapes }) => ({
    ...state,
    etapes,
    loading: false
  })),
  on(FormateurEtapesActions.loadEtapesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
); 