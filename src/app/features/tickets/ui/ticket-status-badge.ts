import { Component, computed, input } from '@angular/core';

import { Badge, BadgeTone } from '@shared/ui/badge';
import { TicketStatus } from '../domain/ticket.model';

const DISPLAY: Record<TicketStatus, { label: string; tone: BadgeTone }> = {
  Open: { label: 'Open', tone: 'info' },
  InProgress: { label: 'In progress', tone: 'warning' },
  Resolved: { label: 'Resolved', tone: 'success' },
};

/** Maps a ticket status to a label and badge tone. */
@Component({
  selector: 'app-ticket-status-badge',
  imports: [Badge],
  template: `<app-badge [tone]="display().tone">{{ display().label }}</app-badge>`,
})
export class TicketStatusBadge {
  readonly status = input.required<TicketStatus>();
  protected readonly display = computed(() => DISPLAY[this.status()]);
}
