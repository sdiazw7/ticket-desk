import { NewTicket, Ticket } from '../domain/ticket.model';

/**
 * Test data builders. Each returns a valid object with sensible defaults;
 * a test overrides only the fields it cares about, so the intent of the test stays visible.
 * When the model gains a field, add its default here once.
 */
export function buildNewTicket(overrides: Partial<NewTicket> = {}): NewTicket {
  return {
    title: 'Cannot log in',
    customerName: 'Maria Lopez',
    description: 'Error after password reset.',
    priority: 'High',
    ...overrides,
  };
}

export function buildTicket(overrides: Partial<Ticket> = {}): Ticket {
  return {
    ...buildNewTicket(),
    id: '42',
    status: 'Open',
    createdAt: '2026-11-19T14:30:00.000Z',
    ...overrides,
  };
}
