import { formatDate } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ApiError } from '@core/http/api-error';
import { TicketApi } from '../data-access/ticket-api';
import { buildTicket } from '../testing/ticket.fixtures';
import { TicketListPage } from './ticket-list-page';

describe('TicketListPage', () => {
  const api = { list: vi.fn() };

  beforeEach(() => {
    api.list.mockReset();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: TicketApi, useValue: api }],
    });
  });

  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(TicketListPage);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows one row per ticket, each title linking to its detail page', async () => {
    const tickets = [
      buildTicket({ id: '2', title: 'Refund not received' }),
      buildTicket({ id: '1' }),
    ];
    api.list.mockReturnValue(of(tickets));

    const element = await render();

    const rows = element.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(tickets.length);
    const link = rows[0].querySelector('a');
    expect(link?.textContent).toContain(tickets[0].title);
    expect(link?.getAttribute('href')).toBe(`/tickets/${tickets[0].id}`);
    expect(rows[0].textContent).toContain(tickets[0].customerName);
  });

  it('shows the creation date with hours and minutes', async () => {
    const ticket = buildTicket();
    api.list.mockReturnValue(of([ticket]));

    const element = await render();

    // formatDate uses the same local time zone as the page, so this passes in any time zone.
    const expected = formatDate(ticket.createdAt, 'MMM d, y, h:mm a', 'en-US');
    expect(element.querySelector('td.created')?.textContent?.trim()).toBe(expected);
  });

  it('says so when there are no tickets', async () => {
    api.list.mockReturnValue(of([]));

    const element = await render();

    expect(element.querySelector('table')).toBeNull();
    expect(element.textContent).toContain('No tickets yet.');
  });

  it('shows the error message when loading fails', async () => {
    api.list.mockReturnValue(throwError(() => new ApiError(0, 'Unable to reach the server.')));

    const element = await render();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'Unable to reach the server.',
    );
  });
});
