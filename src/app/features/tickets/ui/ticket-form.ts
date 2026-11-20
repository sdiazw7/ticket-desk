import { Component, input, output, signal } from '@angular/core';
import { FormField, FormRoot, form, maxLength, required, validate } from '@angular/forms/signals';

import { ErrorAlert } from '@shared/ui/error-alert';
import { FieldError } from '@shared/ui/field-error';
import { TICKET_LIMITS } from '../domain/ticket.limits';
import { NewTicket, TICKET_PRIORITIES } from '../domain/ticket.model';

const { titleMaxLength, customerNameMaxLength, descriptionMaxLength } = TICKET_LIMITS;

/**
 * Presentational form for entering a ticket.
 * It validates input and emits the values; it does not save anything.
 * The page decides what to do with the values and tells the form when it is saving.
 */
@Component({
  selector: 'app-ticket-form',
  imports: [FormRoot, FormField, ErrorAlert, FieldError],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.scss',
})
export class TicketForm {
  /** True while the page is saving; disables the submit button. */
  readonly saving = input(false);
  /** A message from the page when saving failed, such as a server error. */
  readonly errorMessage = input<string | null>(null);
  /** Emitted with the entered values when the user submits a valid form. */
  readonly submitted = output<NewTicket>();

  protected readonly priorities = TICKET_PRIORITIES;

  private readonly model = signal<NewTicket>({
    title: '',
    customerName: '',
    description: '',
    priority: 'Medium',
  });

  protected readonly ticketForm = form(
    this.model,
    (ticket) => {
      required(ticket.title, { message: 'Title is required.' });
      validate(ticket.title, ({ value }) => notBlank(value(), 'Title is required.'));
      maxLength(ticket.title, titleMaxLength, {
        message: `Title must be ${titleMaxLength} characters or fewer.`,
      });

      required(ticket.customerName, { message: 'Customer name is required.' });
      validate(ticket.customerName, ({ value }) => notBlank(value(), 'Customer name is required.'));
      maxLength(ticket.customerName, customerNameMaxLength, {
        message: `Customer name must be ${customerNameMaxLength} characters or fewer.`,
      });

      maxLength(ticket.description, descriptionMaxLength, {
        message: `Description must be ${descriptionMaxLength} characters or fewer.`,
      });

      required(ticket.priority, { message: 'Priority is required.' });
    },
    {
      submission: {
        // Runs only when the form is valid; invalid submits just show the errors.
        action: async (ticket) => {
          this.submitted.emit(ticket().value());
          return undefined;
        },
      },
    },
  );
}

/** Rejects values that contain only spaces (the built-in required check accepts them). */
function notBlank(value: string, message: string) {
  return value.length > 0 && value.trim() === '' ? { kind: 'blank', message } : undefined;
}
