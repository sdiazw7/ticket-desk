import { Component, input } from '@angular/core';

/**
 * Shows the first validation message for a form field once the user has interacted with it.
 * Generic on purpose: it knows nothing about tickets, so any feature (such as login) can use it.
 */
@Component({
  selector: 'app-field-error',
  template: `
    @if (show() && errors().length > 0) {
      <p class="field-error" [id]="id()">{{ errors()[0].message }}</p>
    }
  `,
  styles: `
    .field-error {
      margin: 4px 0 0;
      color: var(--color-error);
      font-size: 0.875rem;
    }
  `,
})
export class FieldError {
  /** Validation errors for the field; only the first message is shown. */
  readonly errors = input.required<readonly { message?: string }[]>();
  /** Usually the field's touched state, so errors don't appear before the user types. */
  readonly show = input(true);
  /** Id that the input references with aria-describedby, so screen readers announce the error. */
  readonly id = input<string>();
}
