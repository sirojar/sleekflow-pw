# Cermati E2E Test Framework

Playwright end-to-end test automation framework for [cermati.com](https://www.cermati.com) built with TypeScript and the Page Object Model pattern.

## Tech Stack

- [Playwright](https://playwright.dev/) — browser automation
- [TypeScript](https://www.typescriptlang.org/) — type safety
- Page Object Model (POM) — test architecture

## Project Structure

```
automation-test/
├── fixtures/
│   └── base.ts              # Fixture definitions (dependency injection)
├── page-objects/
│   ├── BasePage.ts          # Abstract base class for all POMs
│   ├── HomePage.ts          # Home page — nav, Investasi dropdown, search
│   ├── ReksaDanaPage.ts     # Reksa Dana pages — category, filter, comparison
│   └── SearchPage.ts        # Search result page — result count, category counts
└── tests/
    └── CermatiTest.spec.ts  # Test cases
```

## Setup

```bash
npm install
npx playwright install
```

## Configuration

Copy `.env.example` to `.env` and set your values:

```bash
cp .env.example .env
```

| Variable   | Description        | Default                    |
|------------|--------------------|----------------------------|
| `BASE_URL` | Target environment | `https://www.cermati.com`  |

## Running Tests

```bash
# Run all tests
npm test

# Run headed (see the browser)
npm run test:headed

# Run a specific test by name
npx playwright test --grep "User compare reksa dana"

# Debug mode
npm run test:debug

# Open Playwright UI
npm run test:ui
```

## Test Cases

### Scenario 1 — Compare Reksa Dana Pasar Uang Syariah Products
1. Open cermati.com
2. Open Investasi dropdown and verify options are visible
3. Navigate to Reksa Dana → Pasar Uang
4. Filter by Syariah
5. Select 2 products for comparison
6. Verify redirect to `/reksadana/bandingkan`

### Scenario 2 — Validate Search Result and Category Counts
1. Open cermati.com
2. Search for "BCA" and verify the search term appears in the URL
3. Verify the sum of all category counts matches the total search result count

## Viewing Reports

```bash
npm run report
```
