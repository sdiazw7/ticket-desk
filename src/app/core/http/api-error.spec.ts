import { HttpErrorResponse } from '@angular/common/http';
import { ApiError, toApiError } from './api-error';

describe('toApiError', () => {
  it('returns an ApiError, which is a real Error', () => {
    const result = toApiError(new HttpErrorResponse({ status: 500 }));
    expect(result).toBeInstanceOf(ApiError);
    expect(result).toBeInstanceOf(Error);
  });

  it('reports a connection problem when the server cannot be reached', () => {
    const result = toApiError(new HttpErrorResponse({ status: 0 }));
    expect(result.status).toBe(0);
    expect(result.message).toContain('Unable to reach the server');
  });

  it('reports not found for 404', () => {
    const result = toApiError(new HttpErrorResponse({ status: 404 }));
    expect(result.status).toBe(404);
    expect(result.message).toBe('The requested item was not found.');
  });

  it('keeps the status code for other HTTP errors', () => {
    expect(toApiError(new HttpErrorResponse({ status: 500 })).status).toBe(500);
  });

  it('handles errors that are not HTTP errors', () => {
    expect(toApiError(new Error('boom')).status).toBe(-1);
  });
});
