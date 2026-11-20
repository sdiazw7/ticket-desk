import { Component, computed, input } from '@angular/core';

import { Badge, BadgeTone } from '@shared/ui/badge';
import { TicketPriority } from '../domain/ticket.model';

const TONES: Record<TicketPriority, BadgeTone> = {
  High: 'danger',
  Medium: 'warning',
  Low: 'neutral',
};

/** Maps a ticket priority to a badge tone. */
@Component({
  selector: 'app-ticket-priority-badge',
  imports: [Badge],
  template: `<app-badge [tone]="tone()">{{ priority() }} priority</app-badge>`,
})
export class TicketPriorityBadge {
  readonly priority = input.required<TicketPriority>();
  protected readonly tone = computed(() => TONES[this.priority()]);
}
