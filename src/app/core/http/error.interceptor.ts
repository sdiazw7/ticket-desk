import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { Logger } from '../logging/logger';
import { toApiError } from './api-error';

/**
 * Converts every failed HTTP call into an ApiError, so pages handle one consistent error shape,
 * and reports the failure through the Logger.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(Logger);

  return next(req).pipe(
    catchError((error: unknown) => {
      const apiError = toApiError(error);
      logger.error(`[HTTP] ${req.method} ${req.urlWithParams} failed`, apiError);
      return throwError(() => apiError);
    }),
  );
};
