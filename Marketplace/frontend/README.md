# DevOps-M Marketplace - Frontend

Application React / TypeScript / Vite. All existing routes are preserved.

## Local development

```sh
npm ci
npm run dev
```

Vite serves the frontend at http://localhost:5173. The existing `/api` proxy points to `http://localhost:8080`; the gateway must already be running to display real catalog data. This frontend does not start or change backend services.

## Checks

```sh
npm run build
npm run lint
npm test
```

## Organization

- `src/pages/`: eight existing pages and their page-specific interactions.
- `src/components/`: navigation, footer, icons, headings, empty states and product cards.
- `src/layouts/`: shared shell, document title and focus management on navigation.
- `src/styles/main.css`: design tokens and shared desktop styles, grouped by purpose.
- `src/styles/responsive.css`: tablet/mobile breakpoints and reduced-motion preferences.
- `src/services/catalogApi.ts`: existing catalog HTTP calls.
- `src/types/`: API data contracts.
- `src/utils/`: shared price formatting.

## Routes and data

`/`, `/products`, `/products/:id`, `/cart`, `/orders`, `/seller`, `/notifications`, and the fallback 404 route remain available.

The catalog uses `GET /api/catalog/products` and `GET /api/catalog/products/:id` without changing the API contracts. Search (`q`), category (`category`), sorting (`sort`) and availability (`available`) are kept in URL parameters. Filters and sorting run on the API response. Product images are not provided by the current contract; an explicit neutral placeholder is displayed.

Cart, orders, notifications and seller management were already awaiting service integration. Their redesigned pages explain this status; they do not generate transactions, fabricated history, metrics or replacement catalog data.

## Accessibility and responsive behavior

Keyboard focus states, a skip link, labeled controls, an expandable mobile menu, request status messages, reduced-motion support and route focus management are included. Layouts adapt at 1100, 800, 600 and 360 pixels.

Tests cover existing routes, mobile navigation, catalog filtering/sorting, URL state, API errors and retries, empty catalogs, invalid product IDs, and stale responses during product navigation. Fixtures exist only in test files and never replace production data.

## Verification limitation

Build, lint and automated interaction tests can be run with the commands above. Visual verification in a browser must be completed locally: browser automation was unavailable during this refactor. Check desktop, tablet and mobile widths with the real gateway running.
