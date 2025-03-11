import { createAction, props } from '@ngrx/store';
import { User, UserResponse } from '../../models/user.model';

export const loadFormateurs = createAction(
  '[Formateur] Load Formateurs'
);

export const loadFormateursSuccess = createAction(
  '[Formateur] Load Formateurs Success',
  props<{ response: UserResponse }>()
);

export const loadFormateursFailure = createAction(
  '[Formateur] Load Formateurs Failure',
  props<{ error: string }>()
);

export const archiveFormateur = createAction(
  '[Formateur] Archive Formateur',
  props<{ id: string }>()
);

export const archiveFormateurSuccess = createAction(
  '[Formateur] Archive Formateur Success',
  props<{ id: string }>()
);

export const archiveFormateurFailure = createAction(
  '[Formateur] Archive Formateur Failure',
  props<{ error: string }>()
); 