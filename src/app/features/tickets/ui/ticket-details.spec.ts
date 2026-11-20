import { TestBed } from '@angular/core/testing';

import { Ticket } from '../domain/ticket.model';
import { buildTicket } from '../testing/ticket.fixtures';
import { TicketDetails } from './ticket-details';

describe('TicketDetails', () => {
  async function render(ticket: Ticket): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(TicketDetails);
    fixture.componentRef.setInput('ticket', ticket);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the ticket fields', async () => {
    const ticket = buildTicket();

    const element = await render(ticket);

    expect(element.querySelector('h1')?.textContent).toContain(ticket.title);
    expect(element.textContent).toContain(`#${ticket.id}`);
    expect(element.textContent).toContain(ticket.customerName);
    expect(element.textContent).toContain(ticket.description);
  });

  it('shows readable status and priority labels', async () => {
    const element = await render(buildTicket({ status: 'InProgress', priority: 'High' }));

    expect(element.querySelector('app-ticket-status-badge')?.textContent).toContain('In progress');
    expect(element.querySelector('app-ticket-priority-badge')?.textContent).toContain(
      'High priority',
    );
  });

  it('says when there is no description', async () => {
    const element = await render(buildTicket({ description: '' }));

    expect(element.textContent).toContain('No description provided.');
  });
});
