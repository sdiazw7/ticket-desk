import { InjectionToken } from '@angular/core';

/**
 * Base address of the back-end API.
 * Provided in app.config.ts from the environment file, so services ask for the address
 * through dependency injection instead of importing configuration directly.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
