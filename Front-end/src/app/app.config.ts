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
import { formateurClassesReducer } from './store/formateur-classes/formateur-classes.reducer';
import { FormateurClassesEffects } from './store/formateur-classes/formateur-classes.effects';
import { formateurEtapesReducer } from './store/formateur-etapes/formateur-etapes.reducer';
import { FormateurEtapesEffects } from './store/formateur-etapes/formateur-etapes.effects';
import { formateurApprenantReducer } from './store/formateur-apprenants/formateur-apprenants.reducer';
import { FormateurApprenantEffects } from './store/formateur-apprenants/formateur-apprenants.effects';
import { apprenantClassesReducer } from './store/apprenant-classes/apprenant-classes.reducer';
import { ApprenantClassesEffects } from './store/apprenant-classes/apprenant-classes.effects';
import { apprenantEtapesReducer } from './store/apprenant-etapes/apprenant-etapes.reducer';
import { ApprenantEtapesEffects } from './store/apprenant-etapes/apprenant-etapes.effects';
import { rendusReducer } from './store/apprenant-rendus/apprenant-rendus.reducer';
import { RendusEffects } from './store/apprenant-rendus/apprenant-rendus.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideStore({
      auth: authReducer,
      class: classReducer,
      formateur: formateurReducer,
      apprenant: apprenantReducer,
      formateurClasses: formateurClassesReducer,
      formateurEtapes: formateurEtapesReducer,
      formateurApprenant: formateurApprenantReducer,
      apprenantClasses: apprenantClassesReducer,
      apprenantEtapes: apprenantEtapesReducer,
      rendus: rendusReducer
    }),
    provideEffects([
      AuthEffects,
      ClassEffects,
      FormateurEffects,
      ApprenantEffects,
      FormateurClassesEffects,
      FormateurEtapesEffects,
      FormateurApprenantEffects,
      ApprenantClassesEffects,
      ApprenantEtapesEffects,
      RendusEffects
    ])
  ]
};
