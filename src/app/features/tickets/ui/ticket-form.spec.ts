import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TICKET_LIMITS } from '../domain/ticket.limits';
import { NewTicket } from '../domain/ticket.model';
import { TicketForm } from './ticket-form';

describe('TicketForm', () => {
  let fixture: ComponentFixture<TicketForm>;
  let element: HTMLElement;
  let emitted: NewTicket[];

  beforeEach(async () => {
    fixture = TestBed.createComponent(TicketForm);
    element = fixture.nativeElement as HTMLElement;
    emitted = [];
    fixture.componentInstance.submitted.subscribe((value) => emitted.push(value));
    await fixture.whenStable();
  });

  function type(selector: string, value: string): void {
    const field = element.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      selector,
    )!;
    field.value = value;
    field.dispatchEvent(new Event('input'));
    field.dispatchEvent(new Event('change'));
  }

  async function submit(): Promise<void> {
    element.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
  }

  it('does not emit and shows errors when required fields are empty', async () => {
    await submit();

    expect(emitted).toEqual([]);
    expect(element.textContent).toContain('Title is required.');
    expect(element.textContent).toContain('Customer name is required.');
  });

  it('rejects a title that contains only spaces', async () => {
    type('#title', '   ');
    type('#customerName', 'Maria Lopez');
    await submit();

    expect(emitted).toEqual([]);
    expect(element.textContent).toContain('Title is required.');
  });

  it('rejects a title longer than the limit', async () => {
    type('#title', 'a'.repeat(TICKET_LIMITS.titleMaxLength + 1));
    type('#customerName', 'Maria Lopez');
    await submit();

    expect(emitted).toEqual([]);
    expect(element.textContent).toContain(
      `Title must be ${TICKET_LIMITS.titleMaxLength} characters or fewer.`,
    );
  });

  it('emits the entered values when the form is valid', async () => {
    type('#title', 'Cannot log in');
    type('#customerName', 'Maria Lopez');
    type('#priority', 'High');
    type('#description', 'Error after password reset.');
    await submit();

    expect(emitted).toEqual([
      {
        title: 'Cannot log in',
        customerName: 'Maria Lopez',
        priority: 'High',
        description: 'Error after password reset.',
      },
    ]);
  });

  it('disables the button and shows progress while saving', async () => {
    fixture.componentRef.setInput('saving', true);
    await fixture.whenStable();

    const button = element.querySelector('button')!;
    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('Saving...');
  });

  it('shows the error message passed in by the page', async () => {
    fixture.componentRef.setInput('errorMessage', 'Something went wrong. Please try again.');
    await fixture.whenStable();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'Something went wrong. Please try again.',
    );
  });
});
