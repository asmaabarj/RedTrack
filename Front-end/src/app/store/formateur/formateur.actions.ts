import { createAction, props } from '@ngrx/store';
import { User, UserResponse } from '../../models/user.model';
import { RegisterRequest } from '../../models/user.model';
import { UpdateUserRequest } from '../../models/user.model';

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

export const createFormateur = createAction(
  '[Formateur] Create Formateur',
  props<{ request: RegisterRequest }>()
);

export const createFormateurSuccess = createAction(
  '[Formateur] Create Formateur Success'
);

export const createFormateurFailure = createAction(
  '[Formateur] Create Formateur Failure',
  props<{ error: string }>()
);

export const updateFormateur = createAction(
  '[Formateur] Update Formateur',
  props<{ id: string, request: UpdateUserRequest, newClassId: string }>()
);

export const updateFormateurSuccess = createAction(
  '[Formateur] Update Formateur Success',
  props<{ user: User }>()
);

export const updateFormateurFailure = createAction(
  '[Formateur] Update Formateur Failure',
  props<{ error: string }>()
);

export const loadArchivedFormateurs = createAction(
  '[Formateur] Load Archived Formateurs'
);

export const loadArchivedFormateursSuccess = createAction(
  '[Formateur] Load Archived Formateurs Success',
  props<{ formateurs: User[] }>()
);

export const loadArchivedFormateursFailure = createAction(
  '[Formateur] Load Archived Formateurs Failure',
  props<{ error: string }>()
);

export const unarchiveFormateur = createAction(
  '[Formateur] Unarchive Formateur',
  props<{ id: string }>()
);

export const unarchiveFormateurSuccess = createAction(
  '[Formateur] Unarchive Formateur Success'
);

export const unarchiveFormateurFailure = createAction(
  '[Formateur] Unarchive Formateur Failure',
  props<{ error: string }>()
); 