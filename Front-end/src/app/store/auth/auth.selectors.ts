import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { inject } from '@angular/core';
import { JwtService } from '../../services/jwt.service';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectAuthToken = createSelector(
  selectAuthState,
  (state) => state.token
);

export const selectUserRole = createSelector(
  selectAuthState,
  (state) => {
    if (!state.token) return null;
    const jwtService = inject(JwtService);
    return jwtService.extractRole(state.token);
  }
); 