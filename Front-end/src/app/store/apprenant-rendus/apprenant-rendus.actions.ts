import { createAction, props } from '@ngrx/store';
import { EtapeAvecRendus } from '../../models/rendu.model';
import { RenduDTO } from '../../models/rendu.model';

export const loadRendus = createAction('[Rendus] Load Rendus');

export const loadRendusSuccess = createAction(
  '[Rendus] Load Rendus Success',
  props<{ etapes: EtapeAvecRendus[] }>()
);

export const loadRendusFailure = createAction(
  '[Rendus] Load Rendus Failure',
  props<{ error: string }>()
);

export const createRendu = createAction(
  '[Rendus] Create Rendu',
  props<{ rendu: RenduDTO }>()
);

export const createRenduSuccess = createAction(
  '[Rendus] Create Rendu Success',
  props<{ rendu: RenduDTO }>()
);

export const createRenduFailure = createAction(
  '[Rendus] Create Rendu Failure',
  props<{ error: string }>()
); 