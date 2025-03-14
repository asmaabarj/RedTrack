import { createReducer, on } from '@ngrx/store';
import { EtapeAvecRendus } from '../../models/rendu.model';
import * as FormateurRendusActions from './formateur-rendus.actions';

export interface FormateurRendusState {
  etapes: EtapeAvecRendus[];
  loading: boolean;
  error: string | null;
}

const initialState: FormateurRendusState = {
  etapes: [],
  loading: false,
  error: null
};

export const formateurRendusReducer = createReducer(
  initialState,
  on(FormateurRendusActions.loadApprenantRendus, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(FormateurRendusActions.loadApprenantRendusSuccess, (state, { etapes }) => ({
    ...state,
    etapes,
    loading: false
  })),
  on(FormateurRendusActions.loadApprenantRendusFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(FormateurRendusActions.createRenduResponseSuccess, (state, { response }) => ({
    ...state,
    etapes: state.etapes.map(etape => ({
      ...etape,
      rendus: etape.rendus.map(rendu => 
        rendu.id === response.renduId ? {
          ...rendu,
          type: response.type,
          responses: [response, ...rendu.responses]
        } : rendu
      )
    }))
  }))
); 