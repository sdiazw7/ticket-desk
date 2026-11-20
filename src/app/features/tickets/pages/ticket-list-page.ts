import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ErrorAlert } from '@shared/ui/error-alert';
import { LoadingIndicator } from '@shared/ui/loading-indicator';
import { TicketApi } from '../data-access/ticket-api';
import { TicketPriorityBadge } from '../ui/ticket-priority-badge';
import { TicketStatusBadge } from '../ui/ticket-status-badge';

/** Smart page: loads all tickets and shows them in a table, each linking to its detail page. */
@Component({
  selector: 'app-ticket-list-page',
  imports: [
    DatePipe,
    RouterLink,
    ErrorAlert,
    LoadingIndicator,
    TicketPriorityBadge,
    TicketStatusBadge,
  ],
  templateUrl: './ticket-list-page.html',
  styleUrl: './ticket-list-page.scss',
})
export class TicketListPage {
  private readonly api = inject(TicketApi);

  protected readonly tickets = rxResource({
    stream: () => this.api.list(),
  });
}
