import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './header';
import { Nav } from './nav';

/**
 * Layout for every signed-in page: header, side navigation and the page content.
 * Used as a parent route, so pages such as a future login screen can sit outside it.
 */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Nav],
  template: `
    <app-header />
    <div class="body">
      <aside class="sidebar">
        <app-nav />
      </aside>
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .body {
      display: flex;
      flex: 1;
    }
    .sidebar {
      width: 200px;
      border-right: 1px solid var(--color-border);
      background: var(--color-surface-subtle);
    }
    .content {
      flex: 1;
      padding: 24px 32px;
    }
  `,
})
export class Shell {}
