import { createAction, props } from '@ngrx/store';
import { User, UserResponse } from '../../models/user.model';
import { RegisterRequest } from '../../models/user.model';
import { UpdateUserRequest } from '../../models/user.model';

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

export const createApprenant = createAction(
  '[Apprenant] Create Apprenant',
  props<{ request: RegisterRequest }>()
);

export const createApprenantSuccess = createAction(
  '[Apprenant] Create Apprenant Success'
);

export const createApprenantFailure = createAction(
  '[Apprenant] Create Apprenant Failure',
  props<{ error: string }>()
);

export const updateApprenant = createAction(
  '[Apprenant] Update Apprenant',
  props<{ id: string, request: UpdateUserRequest, newClassId: string }>()
);

export const updateApprenantSuccess = createAction(
  '[Apprenant] Update Apprenant Success',
  props<{ user: User }>()
);

export const updateApprenantFailure = createAction(
  '[Apprenant] Update Apprenant Failure',
  props<{ error: string }>()
);

export const loadArchivedApprenants = createAction(
  '[Apprenant] Load Archived Apprenants'
);

export const loadArchivedApprenantsSuccess = createAction(
  '[Apprenant] Load Archived Apprenants Success',
  props<{ apprenants: User[] }>()
);

export const loadArchivedApprenantsFailure = createAction(
  '[Apprenant] Load Archived Apprenants Failure',
  props<{ error: string }>()
);

export const unarchiveApprenant = createAction(
  '[Apprenant] Unarchive Apprenant',
  props<{ id: string }>()
);

export const unarchiveApprenantSuccess = createAction(
  '[Apprenant] Unarchive Apprenant Success'
);

export const unarchiveApprenantFailure = createAction(
  '[Apprenant] Unarchive Apprenant Failure',
  props<{ error: string }>()
); 