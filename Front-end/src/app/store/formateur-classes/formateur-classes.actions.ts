import { createAction, props } from '@ngrx/store';
import { Class } from '../../models/class.model';

export const loadFormateurClasses = createAction(
  '[Formateur Classes] Load Classes'
);

export const loadFormateurClassesSuccess = createAction(
  '[Formateur Classes] Load Classes Success',
  props<{ classes: Class[] }>()
);

export const loadFormateurClassesFailure = createAction(
  '[Formateur Classes] Load Classes Failure',
  props<{ error: string }>()
);

export const updateClass = createAction(
  '[Formateur Classes] Update Class',
  props<{ id: string; class: any }>()
);

export const updateClassSuccess = createAction(
  '[Formateur Classes] Update Class Success',
  props<{ class: Class }>()
);

export const updateClassFailure = createAction(
  '[Formateur Classes] Update Class Failure',
  props<{ error: string }>()
); 