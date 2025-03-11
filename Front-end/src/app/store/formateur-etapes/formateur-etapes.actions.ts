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