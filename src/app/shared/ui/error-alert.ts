import { Component, input } from '@angular/core';

/** A highlighted error message, announced immediately by screen readers. */
@Component({
  selector: 'app-error-alert',
  template: `<p class="error-alert" role="alert">{{ message() }}</p>`,
  styles: `
    .error-alert {
      margin: 0;
      padding: 10px 12px;
      border-radius: 6px;
      background: var(--color-error-bg);
      color: var(--color-error);
    }
  `,
})
export class ErrorAlert {
  readonly message = input.required<string>();
}
