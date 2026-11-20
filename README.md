# TicketDesk

A customer support ticket application built with Angular 22. Support agents can create a ticket and view its details.

The project is intentionally small in scope and deliberately structured as it would be in a larger enterprise codebase: feature-based folders, a clear separation between business rules, data access and presentation, and architecture rules enforced by the linter.

## Features

- Create a ticket with validation (required fields, maximum lengths, whitespace-only input rejected)
- View a ticket with status and priority badges
- Clear loading, not-found and server-error states
- A mock REST API with persistent sample data

## Tech stack

| Area         | Choice                                                                      |
| ------------ | --------------------------------------------------------------------------- |
| Framework    | Angular 22: standalone components, signals, zoneless change detection       |
| Forms        | Signal Forms                                                                |
| Data loading | `HttpClient` with a functional interceptor; `rxResource` on the detail page |
| Testing      | Vitest through the Angular CLI (`ng test`) with `HttpTestingController`     |
| Code quality | ESLint (angular-eslint) and Prettier                                        |
| Mock API     | json-server, seeded from `db.seed.json`                                     |

## Getting started

**Prerequisites:** Node.js 24.15 or later (or Node.js 26), and npm.

```bash
npm install
npm run dev
```

`npm run dev` starts the mock API at http://localhost:3000 and the app at http://localhost:4200.

### Scripts

| Command            | Purpose                                              |
| ------------------ | ---------------------------------------------------- |
| `npm run dev`      | Start the mock API and the app together              |
| `npm start`        | Start only the app (`ng serve`)                      |
| `npm run api`      | Start only the mock API                              |
| `npm run db:reset` | Restore the mock data to the original sample tickets |
| `npm test`         | Run the unit tests                                   |
| `npm run lint`     | Run ESLint, including the architecture rules         |
| `npm run build`    | Production build                                     |

### Mock data

`db.seed.json` holds the sample tickets and is committed. On first run, `npm run api` copies it to `db.json`, which json-server reads and writes. `db.json` is excluded from Git, so tickets created during development do not appear as changes.

## Project structure

```
src/app/
  core/                   App-wide plumbing, used once
    config/               API_BASE_URL injection token
    http/                 Error interceptor and the ApiError type
    logging/              Logger: the single place diagnostics are written
    layout/               Shell (header, navigation, page area)
  shared/                 Reusable, stateless building blocks with no feature knowledge
    ui/                   Badge, ErrorAlert, FieldError, LoadingIndicator
  features/
    tickets/
      domain/             Ticket types and business rules (plain TypeScript)
      data-access/        TicketApi: all HTTP access for tickets
      ui/                 Presentational components: inputs in, outputs out
      pages/              Routed components that connect data to the UI
      testing/            Test data builders shared by the feature's tests
      tickets.routes.ts   Lazy-loaded routes: /tickets/new and /tickets/:id
  app.config.ts           Router, HttpClient and interceptor setup
  app.routes.ts           Shell as the parent route; features lazy-loaded inside it
src/environments/         API address per environment
```

Imports across top-level areas use path aliases: `@core/*`, `@shared/*` and `@env/*`. Imports within a feature stay relative.

## Architecture

### Principles

- **Organized by feature.** Everything about tickets lives in `features/tickets`, so the feature can grow, move or be removed as a unit.
- **Business rules are framework-free.** `domain/` contains plain TypeScript, such as `createTicket()`, which sets the initial status and timestamp. It is unit tested without Angular.
- **One way to reach the server.** Pages call `TicketApi`; no component uses `HttpClient` directly. Replacing the mock API with a real back end only requires changing the environment file.
- **Smart and presentational components.** Components in `ui/` receive data through inputs and report user actions through outputs. Components in `pages/` inject services, load and save data, and decide what happens next. For example, `TicketForm` emits the entered values, and `TicketCreatePage` saves them and navigates to the new ticket.
- **One error shape.** The HTTP interceptor converts every failure into an `ApiError` with a status code and a readable message, and reports it through the `Logger`.
- **Configuration through dependency injection.** `app.config.ts` is the only file that reads the environment. It provides the API address as the `API_BASE_URL` token, which `TicketApi` injects.
- **Logging behind a service.** Code reports problems to `Logger` rather than calling `console` directly, so production monitoring can be added in one place.

### Dependency rules

These rules are enforced by ESLint (`no-restricted-imports` in `eslint.config.js`). A violation fails `npm run lint`.

| Folder                    | Must not import                                      |
| ------------------------- | ---------------------------------------------------- |
| `shared/`                 | `core/` or any feature                               |
| `core/`                   | Any feature                                          |
| `features/*/domain/`      | Angular, RxJS, or any other layer                    |
| `features/*/data-access/` | `ui/`, `pages/` or `shared/`                         |
| `features/*/ui/`          | `data-access/`, `pages/`, `HttpClient` or the router |

The resulting direction within a feature is: `pages` → `ui` and `data-access` → `domain`.

### Key decisions

- **Union types instead of enums** for status and priority. They add no runtime code and match the strings returned by the API.
- **Signal Forms** for the ticket form. Validation rules are declared alongside the form model, and Angular derives attributes such as `maxlength` from them.
- **`rxResource` on the detail page.** It tracks loading, error and value state, and reloads automatically when the route id changes.
- **The shell is a parent route**, so a future login page can sit outside it without the header and navigation, and a single guard on the shell can protect every page.
- **Shared components are created only when a second consumer exists or is planned.** Ticket badges stay inside the tickets feature; the error alert, field error and loading indicator are in `shared/` because the planned login page will reuse them.
- **Ticket defaults are set in the client only because the mock API cannot apply rules.** In production, the server should set the initial status and creation time. See the note in `ticket.factory.ts`.

## Conventions

- **Component files.** A component keeps its template and styles inline only when each fits in about 10 lines (for example, the ticket badges and `ErrorAlert`). Otherwise they live in separate `.html` and `.scss` files next to the component.
- **Design tokens.** Colors, corner radii and the keyboard focus style are defined once in `src/styles.scss` as CSS custom properties. Components use `var(--color-primary)`, `var(--radius-md)` and so on, never raw values.
- **Shared presentation, feature-specific meaning.** `Badge` in `shared/ui` owns the look of a badge. The ticket badges only decide which tone and label a status or priority gets.
- **File names** follow the current Angular style guide: no `.component` or `.service` suffix.

## Testing

```bash
npm test
```

31 unit tests cover:

- Domain rules (`createTicket`)
- Error conversion (`toApiError`) and the error interceptor
- The shared `Badge` component
- `TicketApi` requests, verified with `HttpTestingController`
- The ticket form: validation (including field length limits), emitted values, saving and error states
- Both pages, with `TicketApi` and the router replaced by test doubles

## Possible next steps

- Ticket list with search and filtering by status
- Status changes governed by transition rules in `domain/`
- Authentication: login page, auth guard on the shell and a token interceptor
- End-to-end tests with Playwright, and a CI pipeline running lint, tests and build
- Replace json-server with an ASP.NET Core minimal API backed by a database, moving ticket defaults to the server and adding a DTO mapper in `data-access/`
