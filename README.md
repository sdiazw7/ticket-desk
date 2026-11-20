# TicketDesk

A customer support ticket application built with Angular 22. Support agents can list tickets, create a ticket and view its details.

The scope is small, but the code is structured as it would be in a larger codebase: feature folders, business rules separated from data access and presentation, and architecture rules enforced by the linter.

## Features

- Ticket list (`/tickets`), newest first, with status and priority badges; each title links to the ticket
- Create a ticket with validation (required fields, maximum lengths, whitespace-only input rejected)
- View a ticket's details
- Loading, empty, not-found and server-error states

**Stack:** Angular 22 (standalone components, signals, zoneless), Signal Forms, `rxResource`, Vitest, ESLint and Prettier, and json-server as a mock API.

## Getting started

Requires Node.js 24.15 or later and npm.

```bash
npm install
npm run dev
```

This starts the mock API at http://localhost:3000 and the app at http://localhost:4200.

| Command            | Purpose                                                        |
| ------------------ | -------------------------------------------------------------- |
| `npm run dev`      | Start the mock API and the app together                        |
| `npm test`         | Run the unit tests                                             |
| `npm run lint`     | Run ESLint, including the architecture rules                   |
| `npm run build`    | Production build                                               |
| `npm run db:reset` | Restore the mock data from `db.seed.json` (the sample tickets) |

json-server reads and writes `db.json`, which is created from `db.seed.json` on first run and is not committed.

## Project structure

```
src/app/
  core/            App-wide plumbing: layout shell, error interceptor, ApiError, Logger, API_BASE_URL
  shared/          Reusable, stateless UI and form validation rules, with no feature knowledge
  features/
    tickets/
      domain/      Ticket types and business rules (plain TypeScript)
      data-access/ TicketApi: all HTTP access for tickets
      ui/          Presentational components: inputs in, outputs out
      pages/       Routed pages (list, create, detail) that connect data to the UI
      testing/     Test data builders
```

## Architecture

- **Organized by feature.** Everything about tickets lives in `features/tickets`, so the feature can grow or move as a unit.
- **Business rules are framework-free.** `domain/` is plain TypeScript, for example `createTicket()`, which sets the initial status and timestamp, so it is tested without Angular.
- **One way to reach the server.** Pages call `TicketApi`; nothing else uses `HttpClient`. The API address comes from the environment file through the `API_BASE_URL` token.
- **Smart pages, presentational components.** `ui/` components only use inputs and outputs. Pages load and save data and navigate: for example, `TicketForm` emits the values and `TicketCreatePage` saves them.
- **One error shape.** The HTTP interceptor turns every failure into an `ApiError` with a status and a readable message.
- **The shell is a parent route**, so a future login page can sit outside it and a single guard can protect every page.

Within a feature, imports flow `pages` → `ui` and `data-access` → `domain`. ESLint (`no-restricted-imports` in `eslint.config.js`) enforces this, as well as `shared/` and `core/` never importing features.

**Note on the mock API:** json-server cannot apply business rules, so the client sets a new ticket's status and creation time. A real API should own these (see `ticket.factory.ts`).

## Possible next steps

- Filter the ticket list by status
- Status changes governed by transition rules in `domain/`
- Authentication: login page, guard on the shell, token interceptor
- End-to-end tests and a CI pipeline
- A real back end (for example ASP.NET Core) instead of json-server
