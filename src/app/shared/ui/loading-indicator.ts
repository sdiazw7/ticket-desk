import { Component, input } from '@angular/core';

/** A small spinner with a text label. Announced politely by screen readers. */
@Component({
  selector: 'app-loading-indicator',
  template: `
    <div class="loading" role="status" aria-live="polite">
      <span class="spinner" aria-hidden="true"></span>
      <span>{{ label() }}</span>
    </div>
  `,
  styles: `
    .loading {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--color-text-muted);
    }
    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid var(--color-primary-muted);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class LoadingIndicator {
  readonly label = input('Loading...');
}
