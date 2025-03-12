import { createAction, props } from '@ngrx/store';
import { Etape } from '../../models/etape.model';

export const loadEtapes = createAction(
  '[Formateur Etapes] Load Etapes'
);

export const loadEtapesSuccess = createAction(
  '[Formateur Etapes] Load Etapes Success',
  props<{ etapes: Etape[] }>()
);

export const loadEtapesFailure = createAction(
  '[Formateur Etapes] Load Etapes Failure',
  props<{ error: string }>()
);

export const createEtape = createAction(
  '[Formateur Etapes] Create Etape',
  props<{ etape: any }>()
);

export const createEtapeSuccess = createAction(
  '[Formateur Etapes] Create Etape Success',
  props<{ etape: Etape }>()
);

export const createEtapeFailure = createAction(
  '[Formateur Etapes] Create Etape Failure',
  props<{ error: string }>()
);

export const updateEtape = createAction(
  '[Formateur Etapes] Update Etape',
  props<{ id: string, etape: any }>()
);

export const updateEtapeSuccess = createAction(
  '[Formateur Etapes] Update Etape Success',
  props<{ etape: Etape }>()
);

export const updateEtapeFailure = createAction(
  '[Formateur Etapes] Update Etape Failure',
  props<{ error: string }>()
); 