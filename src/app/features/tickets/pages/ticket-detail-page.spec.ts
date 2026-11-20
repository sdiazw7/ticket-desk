import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ApiError } from '@core/http/api-error';
import { TicketApi } from '../data-access/ticket-api';
import { buildTicket } from '../testing/ticket.fixtures';
import { TicketDetailPage } from './ticket-detail-page';

describe('TicketDetailPage', () => {
  const ticket = buildTicket();

  const api = { getById: vi.fn() };

  beforeEach(() => {
    api.getById.mockReset();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: TicketApi, useValue: api }],
    });
  });

  async function render(id: string): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(TicketDetailPage);
    fixture.componentRef.setInput('id', id);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('loads the ticket for the id and shows it', async () => {
    api.getById.mockReturnValue(of(ticket));

    const element = await render(ticket.id);

    expect(api.getById).toHaveBeenCalledWith(ticket.id);
    expect(element.querySelector('app-ticket-details')?.textContent).toContain(ticket.title);
  });

  it('explains when the ticket does not exist', async () => {
    api.getById.mockReturnValue(
      throwError(() => new ApiError(404, 'The requested item was not found.')),
    );

    const element = await render('999');

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'This ticket does not exist',
    );
  });

  it('shows the server message for other errors', async () => {
    api.getById.mockReturnValue(throwError(() => new ApiError(0, 'Unable to reach the server.')));

    const element = await render(ticket.id);

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'Unable to reach the server.',
    );
  });
});
