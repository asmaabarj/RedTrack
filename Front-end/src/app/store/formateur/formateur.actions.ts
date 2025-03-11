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