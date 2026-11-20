import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Badge, BadgeTone } from './badge';

@Component({
  imports: [Badge],
  template: `<app-badge [tone]="tone">Resolved</app-badge>`,
})
class Host {
  tone: BadgeTone = 'success';
}

describe('Badge', () => {
  it('shows the projected text with the tone as a class', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    const badge = (fixture.nativeElement as HTMLElement).querySelector('.badge')!;
    expect(badge.textContent).toBe('Resolved');
    expect(badge.classList).toContain('success');
  });
});
