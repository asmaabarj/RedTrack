import { createAction, props } from '@ngrx/store';
import { Etape } from '../../models/etape.model';

export const loadEtapes = createAction(
  '[Apprenant Etapes] Load Etapes'
);

export const loadEtapesSuccess = createAction(
  '[Apprenant Etapes] Load Etapes Success',
  props<{ etapes: Etape[] }>()
);

export const loadEtapesFailure = createAction(
  '[Apprenant Etapes] Load Etapes Failure',
  props<{ error: string }>()
);
