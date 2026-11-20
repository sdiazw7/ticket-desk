import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { Ticket } from '../domain/ticket.model';
import { TicketPriorityBadge } from './ticket-priority-badge';
import { TicketStatusBadge } from './ticket-status-badge';

/** Presentational view of one ticket. */
@Component({
  selector: 'app-ticket-details',
  imports: [DatePipe, TicketStatusBadge, TicketPriorityBadge],
  template: `
    <article class="ticket">
      <header>
        <h1>{{ ticket().title }}</h1>
        <div class="badges">
          <app-ticket-status-badge [status]="ticket().status" />
          <app-ticket-priority-badge [priority]="ticket().priority" />
        </div>
      </header>

      <dl>
        <dt>Ticket</dt>
        <dd>#{{ ticket().id }}</dd>
        <dt>Customer</dt>
        <dd>{{ ticket().customerName }}</dd>
        <dt>Created</dt>
        <dd>{{ ticket().createdAt | date: 'medium' }}</dd>
      </dl>

      <section>
        <h2>Description</h2>
        @if (ticket().description) {
          <p class="description">{{ ticket().description }}</p>
        } @else {
          <p class="empty">No description provided.</p>
        }
      </section>
    </article>
  `,
  styles: `
    .ticket {
      max-width: 720px;
    }
    h1 {
      margin: 0 0 8px;
    }
    .badges {
      display: flex;
      gap: 8px;
    }
    dl {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 8px 16px;
      margin: 24px 0;
    }
    dt {
      color: var(--color-text-muted);
    }
    dd {
      margin: 0;
    }
    h2 {
      font-size: 1rem;
      margin: 0 0 8px;
    }
    .description {
      white-space: pre-line;
      margin: 0;
    }
    .empty {
      color: var(--color-text-muted);
      margin: 0;
    }
  `,
})
export class TicketDetails {
  readonly ticket = input.required<Ticket>();
}
