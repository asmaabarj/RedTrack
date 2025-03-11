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