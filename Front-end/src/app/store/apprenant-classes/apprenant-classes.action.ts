import { createAction, props } from '@ngrx/store';
import { Class } from '../../models/class.model';

export const loadApprenantClasses = createAction(
  '[Apprenant Classes] Load Classes'
);

export const loadApprenantClassesSuccess = createAction(
  '[Apprenant Classes] Load Classes Success',
  props<{ classes: Class[] }>()
);

export const loadApprenantClassesFailure = createAction(
  '[Apprenant Classes] Load Classes Failure',
  props<{ error: string }>()
);