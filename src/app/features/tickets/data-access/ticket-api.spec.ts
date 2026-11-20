import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '@core/config/api-base-url';
import { Ticket } from '../domain/ticket.model';
import { buildNewTicket, buildTicket } from '../testing/ticket.fixtures';
import { TicketApi } from './ticket-api';

describe('TicketApi', () => {
  const apiUrl = 'http://test-api';
  const baseUrl = `${apiUrl}/tickets`;
  let api: TicketApi;
  let http: HttpTestingController;

  const savedTicket = buildTicket();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: apiUrl },
      ],
    });
    api = TestBed.inject(TicketApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify(); // fails the test if any request was not handled
    vi.useRealTimers();
  });

  it('create() posts the new ticket with creation defaults applied', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-19T14:30:00.000Z'));
    const input = buildNewTicket({ title: ' Cannot log in ' });
    let result: Ticket | undefined;

    api.create(input).subscribe((ticket) => (result = ticket));

    const req = http.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      ...input,
      title: 'Cannot log in', // trimmed
      status: 'Open',
      createdAt: '2026-11-19T14:30:00.000Z',
    });

    req.flush(savedTicket);
    expect(result).toEqual(savedTicket);
  });

  it('getById() requests the ticket by id', () => {
    let result: Ticket | undefined;

    api.getById(savedTicket.id).subscribe((ticket) => (result = ticket));

    const req = http.expectOne(`${baseUrl}/${savedTicket.id}`);
    expect(req.request.method).toBe('GET');

    req.flush(savedTicket);
    expect(result).toEqual(savedTicket);
  });

  it('list() requests all tickets, newest first', () => {
    const tickets = [buildTicket({ id: '2' }), buildTicket({ id: '1' })];
    let result: Ticket[] | undefined;

    api.list().subscribe((list) => (result = list));

    const req = http.expectOne((r) => r.url === baseUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('_sort')).toBe('-createdAt');

    req.flush(tickets);
    expect(result).toEqual(tickets);
  });
});
