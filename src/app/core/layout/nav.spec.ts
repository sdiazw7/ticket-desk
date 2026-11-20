import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { Nav } from './nav';

@Component({ template: '' })
class EmptyPage {}

describe('Nav', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'tickets', component: EmptyPage },
          { path: 'tickets/new', component: EmptyPage },
          { path: 'tickets/:id', component: EmptyPage },
        ]),
      ],
    });
  });

  /** Navigates, then returns the text of the links marked as the current page. */
  async function activeLinksAt(url: string): Promise<string[]> {
    const harness = await RouterTestingHarness.create();
    const fixture = TestBed.createComponent(Nav);
    await harness.navigateByUrl(url);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return Array.from(element.querySelectorAll('a[aria-current="page"]'), (a) =>
      a.textContent!.trim(),
    );
  }

  it('marks only "Tickets" as current on the list page', async () => {
    expect(await activeLinksAt('/tickets')).toEqual(['Tickets']);
  });

  it('keeps "Tickets" current when the list has query params', async () => {
    expect(await activeLinksAt('/tickets?status=Open')).toEqual(['Tickets']);
  });

  it('marks only "New ticket" as current on the create page', async () => {
    expect(await activeLinksAt('/tickets/new')).toEqual(['New ticket']);
  });

  it('marks no link as current on a ticket detail page', async () => {
    expect(await activeLinksAt('/tickets/42')).toEqual([]);
  });
});
