import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ApiError } from '@core/http/api-error';
import { TicketApi } from '../data-access/ticket-api';
import { buildNewTicket, buildTicket } from '../testing/ticket.fixtures';
import { TicketForm } from '../ui/ticket-form';
import { TicketCreatePage } from './ticket-create-page';

describe('TicketCreatePage', () => {
  const newTicket = buildNewTicket();
  const saved = buildTicket(newTicket);

  const api = { create: vi.fn() };
  const router = { navigate: vi.fn() };

  beforeEach(() => {
    api.create.mockReset();
    router.navigate.mockReset();
    TestBed.configureTestingModule({
      providers: [
        { provide: TicketApi, useValue: api },
        { provide: Router, useValue: router },
      ],
    });
  });

  async function createPage() {
    const fixture = TestBed.createComponent(TicketCreatePage);
    await fixture.whenStable();
    const form = fixture.debugElement.children.find(
      (child) => child.componentInstance instanceof TicketForm,
    )!.componentInstance as TicketForm;
    return { fixture, form };
  }

  it('saves the ticket and opens it', async () => {
    api.create.mockReturnValue(of(saved));
    const { form } = await createPage();

    form.submitted.emit(newTicket);

    expect(api.create).toHaveBeenCalledWith(newTicket);
    expect(router.navigate).toHaveBeenCalledWith(['/tickets', saved.id]);
  });

  it('shows the error and allows retrying when saving fails', async () => {
    const error = new ApiError(500, 'Something went wrong. Please try again.');
    api.create.mockReturnValue(throwError(() => error));
    const { fixture, form } = await createPage();

    form.submitted.emit(newTicket);
    await fixture.whenStable();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(form.saving()).toBe(false);
    expect(form.errorMessage()).toBe(error.message);
  });
});
