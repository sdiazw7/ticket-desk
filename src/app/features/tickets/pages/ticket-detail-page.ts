import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ApiError } from '@core/http/api-error';
import { ErrorAlert } from '@shared/ui/error-alert';
import { LoadingIndicator } from '@shared/ui/loading-indicator';
import { TicketApi } from '../data-access/ticket-api';
import { TicketDetails } from '../ui/ticket-details';

/** Smart page: loads the ticket for the :id in the URL and shows it. */
@Component({
  selector: 'app-ticket-detail-page',
  imports: [RouterLink, ErrorAlert, LoadingIndicator, TicketDetails],
  template: `
    @if (ticket.isLoading()) {
      <app-loading-indicator label="Loading ticket..." />
    } @else if (errorMessage(); as message) {
      <h1>Ticket #{{ id() }}</h1>
      <app-error-alert [message]="message" />
    } @else if (ticket.value(); as value) {
      <app-ticket-details [ticket]="value" />
    }

    <p class="actions">
      <a routerLink="/tickets/new">Create another ticket</a>
    </p>
  `,
  styles: `
    .actions {
      margin-top: 32px;
    }
  `,
})
export class TicketDetailPage {
  private readonly api = inject(TicketApi);

  /** Filled from the :id route parameter (withComponentInputBinding). */
  readonly id = input.required<string>();

  /** Reloads automatically whenever the id changes. */
  protected readonly ticket = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => this.api.getById(id),
  });

  protected readonly errorMessage = computed(() => {
    const error = this.ticket.error();
    if (!error) {
      return null;
    }
    if (error instanceof ApiError && error.status === 404) {
      return 'This ticket does not exist. It may have been removed, or the link may be wrong.';
    }
    return error.message;
  });
}
