import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { LoginRequest, AuthResponse } from '../../models/auth.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ request: LoginRequest }>(),
    'Login Success': props<{ response: AuthResponse }>(),
    'Login Failure': props<{ error: string }>(),
    'Logout': emptyProps(),
    'Logout Success': emptyProps(),
  }
}); 