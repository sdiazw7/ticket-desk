import { Routes } from '@angular/router';

import { Shell } from './core/layout/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    // later: canActivate: [authGuard]
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'tickets/new' },
      { path: 'tickets', loadChildren: () => import('./features/tickets/tickets.routes') },
    ],
  },
  // later: { path: 'login', loadComponent: ... } (outside the shell, no header or nav)
  { path: '**', redirectTo: '' },
];
