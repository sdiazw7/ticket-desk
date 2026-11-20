import { Component, computed, input } from '@angular/core';

import { TicketStatus } from '../domain/ticket.model';

const LABELS: Record<TicketStatus, string> = {
  Open: 'Open',
  InProgress: 'In progress',
  Resolved: 'Resolved',
};

@Component({
  selector: 'app-ticket-status-badge',
  template: `<span class="badge" [class]="status()">{{ label() }}</span>`,
  styles: `
    .badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 0.8125rem;
      font-weight: 600;
    }
    .Open {
      background: var(--color-info-bg);
      color: var(--color-info);
    }
    .InProgress {
      background: var(--color-warning-bg);
      color: var(--color-warning);
    }
    .Resolved {
      background: var(--color-success-bg);
      color: var(--color-success);
    }
  `,
})
export class TicketStatusBadge {
  readonly status = input.required<TicketStatus>();
  protected readonly label = computed(() => LABELS[this.status()]);
}
