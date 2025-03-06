import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  token: string | null;
  role: string | null;
  error: string | null;
  isLoading: boolean;
}

export const initialState: AuthState = {
  token: null,
  role: null,
  error: null,
  isLoading: false
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, state => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { token, role }) => ({
    ...state,
    token,
    role,
    isLoading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false
  })),
  on(AuthActions.logout, () => ({
    ...initialState
  }))
); 