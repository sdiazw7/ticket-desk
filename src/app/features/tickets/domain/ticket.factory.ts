import { NewTicket, Ticket } from './ticket.model';

/**
 * Applies the business rules for a new ticket:
 * starts as Open, gets a creation timestamp, and trims text input.
 * The id is assigned by the server.
 *
 * Design note: in a production system the server should set status and createdAt,
 * because the browser's clock can be wrong and clients should not decide a record's
 * initial state. They are set here only because the json-server mock cannot apply rules.
 * When a real API exists, move these rules to the server and send only the NewTicket fields.
 */
export function createTicket(input: NewTicket, now: Date = new Date()): Omit<Ticket, 'id'> {
  return {
    title: input.title.trim(),
    customerName: input.customerName.trim(),
    description: input.description.trim(),
    priority: input.priority,
    status: 'Open',
    createdAt: now.toISOString(),
  };
}
