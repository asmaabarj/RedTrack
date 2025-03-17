import { createAction, props } from '@ngrx/store';
import { User, CreateApprenantRequest, UpdateApprenantRequest } from '../../models/user.model';

export const loadApprenants = createAction('[Apprenants] Load Apprenants');

export const loadApprenantsSuccess = createAction(
  '[Apprenants] Load Apprenants Success',
  props<{ apprenants: User[] }>()
);

export const loadApprenantsFailure = createAction(
  '[Apprenants] Load Apprenants Failure',
  props<{ error: string }>()
);

export const loadArchivedApprenants = createAction('[Apprenants] Load Archived Apprenants');

export const loadArchivedApprenantsSuccess = createAction(
  '[Apprenants] Load Archived Apprenants Success',
  props<{ apprenants: User[] }>()
);

export const loadArchivedApprenantsFailure = createAction(
  '[Apprenants] Load Archived Apprenants Failure',
  props<{ error: string }>()
);

export const archiveApprenant = createAction(
  '[Apprenants] Archive Apprenant',
  props<{ apprenantId: string }>()
);

export const archiveApprenantSuccess = createAction(
  '[Apprenants] Archive Apprenant Success',
  props<{ apprenantId: string }>()
);

export const archiveApprenantFailure = createAction(
  '[Apprenants] Archive Apprenant Failure',
  props<{ error: string }>()
);

export const unarchiveApprenant = createAction(
  '[Apprenants] Unarchive Apprenant',
  props<{ apprenantId: string }>()
);

export const unarchiveApprenantSuccess = createAction(
  '[Apprenants] Unarchive Apprenant Success',
  props<{ apprenantId: string }>()
);

export const unarchiveApprenantFailure = createAction(
  '[Apprenants] Unarchive Apprenant Failure',
  props<{ error: string }>()
);

export const createApprenant = createAction(
  '[Apprenants] Create Apprenant',
  props<{ request: CreateApprenantRequest }>()
);

export const createApprenantSuccess = createAction(
  '[Apprenants] Create Apprenant Success',
  props<{ apprenant: User }>()
);

export const createApprenantFailure = createAction(
  '[Apprenants] Create Apprenant Failure',
  props<{ error: string }>()
);

export const updateApprenant = createAction(
  '[Apprenants] Update Apprenant',
  props<{ apprenantId: string, request: UpdateApprenantRequest }>()
);

export const updateApprenantSuccess = createAction(
  '[Apprenants] Update Apprenant Success',
  props<{ apprenant: User }>()
);

export const updateApprenantFailure = createAction(
  '[Apprenants] Update Apprenant Failure',
  props<{ error: string }>()
);
