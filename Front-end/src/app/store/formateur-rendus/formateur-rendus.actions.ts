import { createAction, props } from '@ngrx/store';
import { EtapeAvecRendus } from '../../models/rendu.model';

export const loadApprenantRendus = createAction(
  '[Formateur Rendus] Load Apprenant Rendus',
  props<{ apprenantId: string }>()
);

export const loadApprenantRendusSuccess = createAction(
  '[Formateur Rendus] Load Apprenant Rendus Success',
  props<{ etapes: EtapeAvecRendus[] }>()
);

export const loadApprenantRendusFailure = createAction(
  '[Formateur Rendus] Load Apprenant Rendus Failure',
  props<{ error: string }>()
);

export const createRenduResponse = createAction(
  '[Formateur Rendus] Create Rendu Response',
  props<{ renduId: string, response: { commentaire: string, type: string } }>()
);

export const createRenduResponseSuccess = createAction(
  '[Formateur Rendus] Create Rendu Response Success',
  props<{ response: any }>()
);

export const createRenduResponseFailure = createAction(
  '[Formateur Rendus] Create Rendu Response Failure',
  props<{ error: string }>()
); 