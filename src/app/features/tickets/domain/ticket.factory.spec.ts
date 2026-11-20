import { createTicket } from './ticket.factory';
import { NewTicket } from './ticket.model';

describe('createTicket', () => {
  const input: NewTicket = {
    title: '  Cannot log in  ',
    customerName: ' Maria Lopez ',
    description: ' Error after password reset. ',
    priority: 'High',
  };
  const now = new Date('2026-11-19T14:30:00.000Z');

  it('sets status to Open', () => {
    expect(createTicket(input, now).status).toBe('Open');
  });

  it('sets createdAt from the given time', () => {
    expect(createTicket(input, now).createdAt).toBe('2026-11-19T14:30:00.000Z');
  });

  it('trims text fields', () => {
    const ticket = createTicket(input, now);
    expect(ticket.title).toBe('Cannot log in');
    expect(ticket.customerName).toBe('Maria Lopez');
    expect(ticket.description).toBe('Error after password reset.');
  });

  it('keeps the chosen priority', () => {
    expect(createTicket(input, now).priority).toBe('High');
  });

  it('does not assign an id', () => {
    expect(createTicket(input, now)).not.toHaveProperty('id');
  });
});
