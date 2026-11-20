import { Component, input } from '@angular/core';

import { TicketPriority } from '../domain/ticket.model';

@Component({
  selector: 'app-ticket-priority-badge',
  template: `<span class="badge" [class]="priority()">{{ priority() }} priority</span>`,
  styles: `
    .badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 0.8125rem;
      font-weight: 600;
    }
    .High {
      background: var(--color-danger-bg);
      color: var(--color-danger);
    }
    .Medium {
      background: var(--color-warning-bg);
      color: var(--color-warning);
    }
    .Low {
      background: var(--color-neutral-bg);
      color: var(--color-neutral);
    }
  `,
})
export class TicketPriorityBadge {
  readonly priority = input.required<TicketPriority>();
}
