import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
import { authInterceptor } from './interceptors/auth.interceptor'; 

import { routes } from './app.routes';
import { apiPrefixInterceptor } from './interceptors/apiPrefix.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([apiPrefixInterceptor, authInterceptor])
    ), 
  ]
};
