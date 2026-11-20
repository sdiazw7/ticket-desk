import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { Ticket } from '../domain/ticket.model';
import { TicketPriorityBadge } from './ticket-priority-badge';
import { TicketStatusBadge } from './ticket-status-badge';

/** Presentational view of one ticket. */
@Component({
  selector: 'app-ticket-details',
  imports: [DatePipe, TicketStatusBadge, TicketPriorityBadge],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.scss',
})
export class TicketDetails {
  readonly ticket = input.required<Ticket>();
}
