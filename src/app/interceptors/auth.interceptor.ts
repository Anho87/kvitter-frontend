import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError, switchMap } from 'rxjs';
import { ApiService } from '../services/api-service.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiService = inject(ApiService);
  const token = apiService.getAccessToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` }, withCredentials: true })
    : req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return apiService.refreshAccessToken().pipe(
          switchMap((newToken) => {
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
              withCredentials: true
            });
            return next(retryReq);
          })
        );
      } else if (error.status === 403) {
        apiService.logoutUser();
      }
      return throwError(() => error);
    })
  );
};


