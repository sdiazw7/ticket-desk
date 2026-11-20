import { Component, input, output, signal } from '@angular/core';
import { FormField, FormRoot, form } from '@angular/forms/signals';

import { maxTextLength, requiredText } from '@shared/forms/text-validators';
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
      requiredText(ticket.title, 'Title is required.');
      maxTextLength(ticket.title, titleMaxLength, 'Title');

      requiredText(ticket.customerName, 'Customer name is required.');
      maxTextLength(ticket.customerName, customerNameMaxLength, 'Customer name');

      maxTextLength(ticket.description, descriptionMaxLength, 'Description');
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
