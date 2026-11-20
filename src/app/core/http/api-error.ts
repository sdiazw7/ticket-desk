import { HttpErrorResponse } from '@angular/common/http';

/**
 * The single error type the rest of the app works with.
 * It extends Error so tools that expect real errors (such as Angular resources) keep it intact.
 */
export class ApiError extends Error {
  override readonly name = 'ApiError';

  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Converts any HTTP failure into a user-friendly ApiError. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return new ApiError(
        0,
        'Unable to reach the server. Please check your connection and try again.',
      );
    }
    if (error.status === 404) {
      return new ApiError(404, 'The requested item was not found.');
    }
    return new ApiError(error.status, 'Something went wrong. Please try again.');
  }
  return new ApiError(-1, 'An unexpected error occurred.');
}
