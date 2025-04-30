import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  const isRelative = !/^http(s)?:\/\//.test(req.url);
  const updatedReq = isRelative
    ? req.clone({ url: environment.apiUrl + req.url })
    : req;

  return next(updatedReq);
};
