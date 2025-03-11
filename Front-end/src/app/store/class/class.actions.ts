import { createAction, props } from '@ngrx/store';
import { Class, ClassResponse } from '../../models/class.model';
import { CreateClassRequest } from '../../models/class.model';

export const loadClasses = createAction('[Class] Load Classes');

export const loadClassesSuccess = createAction(
  '[Class] Load Classes Success',
  props<{ response: ClassResponse }>()
);

export const loadClassesFailure = createAction(
  '[Class] Load Classes Failure',
  props<{ error: string }>()
);

export const createClass = createAction(
  '[Class] Create Class',
  props<{ request: CreateClassRequest }>()
);

export const createClassSuccess = createAction(
  '[Class] Create Class Success',
  props<{ class: Class }>()
);

export const createClassFailure = createAction(
  '[Class] Create Class Failure',
  props<{ error: string }>()
);

export const archiveClass = createAction(
  '[Class] Archive Class',
  props<{ id: string }>()
);

export const archiveClassSuccess = createAction(
  '[Class] Archive Class Success',
  props<{ id: string }>()
);

export const archiveClassFailure = createAction(
  '[Class] Archive Class Failure',
  props<{ error: string }>()
);

export const setSelectedClass = createAction(
  '[Class] Set Selected Class',
  props<{ class: Class }>()
);

export const updateClass = createAction(
  '[Class] Update Class',
  props<{ id: string, request: CreateClassRequest }>()
);

export const updateClassSuccess = createAction(
  '[Class] Update Class Success',
  props<{ class: Class }>()
);

export const updateClassFailure = createAction(
  '[Class] Update Class Failure',
  props<{ error: string }>()
);

export const loadArchivedClasses = createAction(
  '[Class] Load Archived Classes'
);

export const loadArchivedClassesSuccess = createAction(
  '[Class] Load Archived Classes Success',
  props<{ response: ClassResponse }>()
);

export const loadArchivedClassesFailure = createAction(
  '[Class] Load Archived Classes Failure',
  props<{ error: string }>()
);

export const unarchiveClass = createAction(
  '[Class] Unarchive Class',
  props<{ id: string }>()
);

export const unarchiveClassSuccess = createAction(
  '[Class] Unarchive Class Success',
  props<{ id: string }>()
);

export const unarchiveClassFailure = createAction(
  '[Class] Unarchive Class Failure',
  props<{ error: string }>()
); 