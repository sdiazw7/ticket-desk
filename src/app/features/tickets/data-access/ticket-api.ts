import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '@core/config/api-base-url';
import { createTicket } from '../domain/ticket.factory';
import { NewTicket, Ticket } from '../domain/ticket.model';

/** All HTTP access for tickets. Pages call this; components never use HttpClient directly. */
@Injectable({ providedIn: 'root' })
export class TicketApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(API_BASE_URL)}/tickets`;

  /** Applies the creation rules, then saves. The server assigns the id. */
  create(newTicket: NewTicket): Observable<Ticket> {
    return this.http.post<Ticket>(this.baseUrl, createTicket(newTicket));
  }

  getById(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.baseUrl}/${encodeURIComponent(id)}`);
  }
}
