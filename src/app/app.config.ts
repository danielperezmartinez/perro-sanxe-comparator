import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
  withNoIncrementalHydration,
} from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';

// Los pipes de precio/fecha de la app usan el locale 'es-ES' explícitamente
// (ver ResultRow); sin registrar sus datos, Angular lanza NG0701.
registerLocaleData(localeEs, 'es-ES');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
