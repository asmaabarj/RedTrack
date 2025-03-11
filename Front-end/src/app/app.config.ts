import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { classReducer } from './store/class/class.reducer';
import { ClassEffects } from './store/class/class.effects';
import { formateurReducer } from './store/formateur/formateur.reducer';
import { FormateurEffects } from './store/formateur/formateur.effects';
import { apprenantReducer } from './store/apprenant/apprenant.reducer';
import { ApprenantEffects } from './store/apprenant/apprenant.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideStore({
      auth: authReducer,
      class: classReducer,
      formateur: formateurReducer,
      apprenant: apprenantReducer
    }),
    provideEffects([
      AuthEffects,
      ClassEffects,
      FormateurEffects,
      ApprenantEffects
    ])
  ]
};
