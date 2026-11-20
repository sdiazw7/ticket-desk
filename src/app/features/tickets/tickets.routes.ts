import { Routes } from '@angular/router';

const ticketsRoutes: Routes = [
  {
    path: 'new', // must come before ':id', or "new" would be read as an id
    title: 'New ticket',
    loadComponent: () => import('./pages/ticket-create-page').then((m) => m.TicketCreatePage),
  },
  {
    path: ':id',
    title: 'Ticket details',
    loadComponent: () => import('./pages/ticket-detail-page').then((m) => m.TicketDetailPage),
  },
];

export default ticketsRoutes;
