import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="nav" aria-label="Main">
      <a routerLink="/tickets/new" routerLinkActive="active" ariaCurrentWhenActive="page">
        New ticket
      </a>
      <!-- later: Tickets (list) -->
    </nav>
  `,
  styles: `
    .nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 16px 8px;
    }
    a {
      padding: 8px 12px;
      border-radius: 6px;
      color: var(--color-primary);
      text-decoration: none;
    }
    a:hover {
      background: var(--color-primary-subtle);
    }
    a.active {
      background: var(--color-primary-muted);
      font-weight: 600;
    }
  `,
})
export class Nav {}
