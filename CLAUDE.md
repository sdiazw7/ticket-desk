# CLAUDE.md

Angular 22 customer support ticket app. README.md has the full architecture; this file holds what is needed to work on the code.

## Commands

- `npm run dev`: mock API (json-server, port 3000) and `ng serve` (port 4200) together
- `npm test` or `ng test --watch=false`: Vitest unit tests (all must pass)
- `npm run lint`: ESLint, including architecture rules (must pass)
- `npm run build`: production build (must pass)
- `npm run db:reset`: restore `db.json` from `db.seed.json`

Run build, lint and tests after every change. Format with Prettier (`npx prettier --write src`).

## Structure

- `src/app/core/`: app-wide plumbing (layout shell, HTTP interceptor, `ApiError`, `Logger`, `API_BASE_URL` token)
- `src/app/shared/`: reusable, stateless UI (`ui/`) and Signal Forms rules (`forms/`); no feature knowledge
- `src/app/features/<feature>/`: `domain/` (types, pure rules) · `data-access/` (HTTP) · `ui/` (presentational) · `pages/` (routed, smart) · `testing/` (test data builders) · `<feature>.routes.ts`
- Aliases: `@core/*`, `@shared/*`, `@env/*`. Use relative imports inside a feature.

## Rules (enforced by ESLint `no-restricted-imports` in `eslint.config.js`)

- `shared/` must not import `core/` or features; `core/` must not import features.
- `domain/` imports nothing from Angular, RxJS or other layers.
- `data-access/` must not import `ui/`, `pages/` or `shared/`.
- `ui/` must not import `data-access/`, `pages/`, `@angular/common/http` or `@angular/router`.
- Flat config: a later block for the same files replaces the rule rather than merging, so extend the existing block for a folder instead of adding a second one.

## Conventions

- Standalone components, zoneless, OnPush default. Template-bound state goes in signals; never mutate objects inside a signal.
- `inject()` in field initializers; no constructor injection.
- `input()` / `input.required()` / `output()`; no decorators.
- Pages inject services, load and save data, navigate. `ui/` components only use inputs and outputs.
- All HTTP for a feature goes through its `data-access` service; pages never use `HttpClient`.
- Read data with `rxResource` (keeps HTTP in the service); saves are handled in event handlers.
- Forms use Signal Forms (`form`, `[formField]`, `[formRoot]`) and the helpers in `shared/forms/text-validators.ts`. Do not bind attributes like `maxlength` manually; rules set them (error NG8022).
- Business limits and defaults live in `domain/` (for example `TICKET_LIMITS`, `createTicket()`).
- Errors: the interceptor turns failures into `ApiError` (extends `Error`; keep it that way so resources do not wrap it). Display with `shared/ui/error-alert`.
- Inline `template` / `styles` only when each is about 10 lines or fewer; otherwise separate `.html` / `.scss`.
- Styles use CSS variables from `src/styles.scss` (colors, radii, focus); no raw hex values in components.
- Move code to `shared/` only when a second feature uses it or one is planned.
- Status and priority are string union types, not enums.
- File names have no `.component` / `.service` suffix.
- Update README.md when structure, conventions or the test count change.

## Testing

- Spec files sit next to the code (`*.spec.ts`). Vitest globals are enabled (no imports for `describe`, `it`, `expect`, `vi`).
- Pages: fake services with `{ provide: X, useValue: { method: vi.fn() } }`. Data access: `HttpTestingController`. Components: `componentRef.setInput()`, DOM events, `await fixture.whenStable()`.
- Build test data with `buildTicket()` / `buildNewTicket()` from `features/tickets/testing/ticket.fixtures.ts`; assert against the built object's fields rather than repeating literals.

## Mock API

json-server v1 reads `db.json` (gitignored). It cannot apply business rules, so `createTicket()` sets `status` and `createdAt` client-side; a real API should own those.

## Current state

Done: list all tickets (`/tickets`, not yet in the sidebar), create a ticket (`/tickets/new`) and view one (`/tickets/:id`). Not built: ticket list sidebar link and status filter, status changes, authentication (planned: guard on the `Shell` route, `login` route outside it, token interceptor), end-to-end tests, CI.
