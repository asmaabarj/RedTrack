import { createAction, props } from '@ngrx/store';
import { LoginRequest, AuthResponse, UserProfileResponse } from '../../models/auth.model';

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: AuthResponse; isNewLogin: boolean }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const checkStoredAuth = createAction('[Auth] Check Stored Auth');

export const logout = createAction('[Auth] Logout');

export const loadUserProfile = createAction('[Auth] Load User Profile');

export const loadUserProfileSuccess = createAction(
  '[Auth] Load User Profile Success',
  props<{ profile: UserProfileResponse }>()
);

export const loadUserProfileFailure = createAction(
  '[Auth] Load User Profile Failure',
  props<{ error: string }>()
);
