import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ApiError } from '@core/http/api-error';
import { TicketApi } from '../data-access/ticket-api';
import { NewTicket } from '../domain/ticket.model';
import { TicketForm } from '../ui/ticket-form';

/** Smart page: receives the form values, saves the ticket, then opens it. */
@Component({
  selector: 'app-ticket-create-page',
  imports: [TicketForm],
  template: `
    <h1>New ticket</h1>
    <app-ticket-form
      [saving]="saving()"
      [errorMessage]="errorMessage()"
      (submitted)="create($event)"
    />
  `,
})
export class TicketCreatePage {
  private readonly api = inject(TicketApi);
  private readonly router = inject(Router);

  protected readonly saving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected create(newTicket: NewTicket): void {
    this.saving.set(true);
    this.errorMessage.set(null);

    this.api.create(newTicket).subscribe({
      next: (ticket) => this.router.navigate(['/tickets', ticket.id]),
      error: (error: ApiError) => {
        this.saving.set(false);
        this.errorMessage.set(error.message);
      },
    });
  }
}
