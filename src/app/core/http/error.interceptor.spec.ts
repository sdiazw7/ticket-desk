import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Logger } from '../logging/logger';
import { ApiError } from './api-error';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  const logger = { error: vi.fn(), warn: vi.fn() };
  let http: HttpClient;
  let backend: HttpTestingController;

  beforeEach(() => {
    logger.error.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: Logger, useValue: logger },
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('turns an HTTP failure into an ApiError and logs it', () => {
    let received: unknown;

    http.get('/tickets/7').subscribe({ error: (error: unknown) => (received = error) });
    backend.expectOne('/tickets/7').flush(null, { status: 404, statusText: 'Not Found' });

    expect(received).toBeInstanceOf(ApiError);
    expect((received as ApiError).status).toBe(404);
    expect(logger.error).toHaveBeenCalledWith('[HTTP] GET /tickets/7 failed', received);
  });

  it('passes successful responses through without logging', () => {
    let received: unknown;

    http.get('/tickets/7').subscribe((body) => (received = body));
    backend.expectOne('/tickets/7').flush({ id: '7' });

    expect(received).toEqual({ id: '7' });
    expect(logger.error).not.toHaveBeenCalled();
  });
});
