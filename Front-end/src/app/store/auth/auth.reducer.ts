import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { UserProfileResponse } from '../../models/auth.model';

export interface AuthState {
  token: string | null;
  role: string | null;
  userProfile: UserProfileResponse | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  token: null,
  role: null,
  userProfile: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    token: response.token,
    role: response.role,
    loading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AuthActions.logout, () => initialState),
  on(AuthActions.loadUserProfileSuccess, (state, { profile }) => ({
    ...state,
    userProfile: profile
  }))
);
