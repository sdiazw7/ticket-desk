export type TicketStatus = 'Open' | 'InProgress' | 'Resolved';

export type TicketPriority = 'Low' | 'Medium' | 'High';

/** Priorities in display order, for drop-downs. */
export const TICKET_PRIORITIES: readonly TicketPriority[] = ['Low', 'Medium', 'High'];

export interface Ticket {
  id: string;
  title: string;
  customerName: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string; // ISO 8601, e.g. "2026-11-19T14:30:00.000Z"
}

/** What a user provides when creating a ticket. */
export type NewTicket = Pick<Ticket, 'title' | 'customerName' | 'description' | 'priority'>;
