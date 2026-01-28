import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { jest } from '@jest/globals';

import { httpErrorInterceptor } from './http-error.interceptor';
import { ErrorBannerService } from '../../shared/services/error-banner.service';

describe('httpErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let banner: { show: jest.Mock };

  beforeEach(() => {
    banner = { show: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: ErrorBannerService, useValue: banner },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('shows the first constraint error message', () => {
    http.get('/api/products').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/products');
    req.flush(
      { errors: [{ constraints: { minLength: 'min 6' } }] },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(banner.show).toHaveBeenCalledWith('min 6');
  });

  it('falls back to status message when no payload message exists', () => {
    http.get('/api/products').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/products');
    req.flush(null, { status: 404, statusText: 'Not Found' });

    expect(banner.show).toHaveBeenCalledWith('No se encontro el recurso.');
  });
});
