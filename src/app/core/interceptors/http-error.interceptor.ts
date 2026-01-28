import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ErrorBannerService } from '../../shared/services/error-banner.service';
import { parseServerErrors } from '../../shared/utils/server-errors.util';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const banner = inject(ErrorBannerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const { generalErrors } = parseServerErrors(error);
      const message =
        generalErrors[0] ??
        'Ocurrio un error inesperado al procesar la solicitud.';
      banner.show(message);
      return throwError(() => error);
    }),
  );
};
