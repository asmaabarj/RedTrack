import { createAction, props } from '@ngrx/store';
import { User, UserResponse } from '../../models/user.model';

export const loadApprenants = createAction(
  '[Apprenant] Load Apprenants'
);

export const loadApprenantsSuccess = createAction(
  '[Apprenant] Load Apprenants Success',
  props<{ response: UserResponse }>()
);

export const loadApprenantsFailure = createAction(
  '[Apprenant] Load Apprenants Failure',
  props<{ error: string }>()
);

export const archiveApprenant = createAction(
  '[Apprenant] Archive Apprenant',
  props<{ id: string }>()
);

export const archiveApprenantSuccess = createAction(
  '[Apprenant] Archive Apprenant Success',
  props<{ id: string }>()
);

export const archiveApprenantFailure = createAction(
  '[Apprenant] Archive Apprenant Failure',
  props<{ error: string }>()
); 