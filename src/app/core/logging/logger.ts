import { Injectable } from '@angular/core';

/**
 * The single place the app writes diagnostic logs.
 * It writes to the browser console today; in production this is where errors
 * would be sent to a monitoring service, without changing any caller.
 */
@Injectable({ providedIn: 'root' })
export class Logger {
  error(message: string, details?: unknown): void {
    console.error(message, details);
  }
}
