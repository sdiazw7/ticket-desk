import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <header class="header">
      <a routerLink="/" class="brand">TicketDesk</a>
      <!-- later: signed-in user and sign out -->
    </header>
  `,
  styles: `
    .header {
      display: flex;
      align-items: center;
      height: 56px;
      padding: 0 24px;
      background: var(--color-primary);
      color: var(--color-text-inverse);
    }
    .brand {
      color: inherit;
      font-size: 1.25rem;
      font-weight: 600;
      text-decoration: none;
    }
  `,
})
export class Header {}
