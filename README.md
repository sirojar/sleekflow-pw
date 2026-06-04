# SleekFlow Test Framework

Playwright end-to-end test automation framework for [sleekflow.io](https://sleekflow.io) built with TypeScript and the Page Object Model pattern. Covers the **sign-up** flow (including real email verification via the Mailsac API) and **login** (valid and invalid credentials).

## Tech Stack

- [Playwright](https://playwright.dev/) — browser automation & test runner
- [TypeScript](https://www.typescriptlang.org/) — type safety
- Page Object Model (POM) — test architecture
- [dotenv](https://github.com/motdotla/dotenv) — environment configuration
- [Mailsac API](https://mailsac.com/docs/api) — disposable inbox for email-verification testing

## Project Structure

```
├── page-objects/
│   ├── BasePage.ts          # Abstract base class (holds page, goto helper)
│   ├── HomePage.ts          # Marketing site — opens the Log In popup tab
│   ├── LoginPage.ts         # Login screen — email/password, errors, → SignUpPage/DashboardPage
│   ├── SignUpPage.ts        # Sign-up + onboarding flow (email, terms, company, personal info)
│   └── DashboardPage.ts     # Post-login/sign-up dashboard — user assertions
├── tests/
│   └── test.spec.ts         # Sign-up + login (valid/invalid) test cases
├── utils/
│   ├── env.ts               # getEnv() guards + generateMailsacEmail() (unique test emails)
│   └── apiCall.ts           # generic apiCall() client + getLatestEmailLink() (polls Mailsac)
├── playwright.config.ts     # Runner config (testDir, baseURL, timeouts, reporters)
└── tsconfig.json            # Strict TS + path aliases (@page-objects, @utils, @types-local)
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

| Variable          | Description                                                    |
|-------------------|----------------------------------------------------------------|
| `BASE_URL`        | Target environment (`https://sleekflow.io/`)                   |
| `SIGNUP_PASSWORD` | Password used for newly signed-up accounts                     |
| `MAILSAC_API_KEY` | API key for reading the verification email                     |
| `NAME`            | Personal name used in onboarding                               |
| `PHONE`           | Phone number used in onboarding                                |
| `LOGIN_EMAIL`     | Existing account email for the login tests                     |
| `LOGIN_PASSWORD`  | Existing account password for the login tests                  |

> The sign-up email is **not** configured — it is generated per run by `generateMailsacEmail()` (a unique `@mailsac.com` address), so each run creates a fresh account. The login tests use a pre-existing `LOGIN_EMAIL`/`LOGIN_PASSWORD`.

## Running Tests

```bash
npm test                 # Run all tests
npm run test:headed      # Run with the browser visible
npm run test:debug       # Step-through debug mode
npm run test:ui          # Playwright UI mode
npm run report           # Open the last HTML report
```

## Test Cases

### Scenario 1 — User sign up
Open site → open Login popup → go to Sign up → enter a **freshly generated disposable email** → accept Terms → set password → verify the email via Mailsac → complete onboarding (company + personal info) → assert the account email shows on the dashboard.

### Scenario 2 — Login with valid credentials
Open Login → enter email/password → sign in → assert the email is visible on the dashboard.

### Scenario 3 — Login with wrong password
Open Login → enter email + wrong password → assert the "Wrong username or password" error.

---

# Framework Approach (Q&A)

> **Disclaimer:** The answers in this section reflect the candidate's own experience and opinions. AI was used as a writing aid to help structure and phrase them.

### 1. Project Setup

The project is a standard Node + TypeScript Playwright setup:

- **Test runner & deps** — `@playwright/test` plus `typescript`, `@types/node`, and `dotenv` (see [package.json](package.json)). `npm install && npx playwright install` provisions everything.
- **Runner config** — [playwright.config.ts](playwright.config.ts) sets `testDir: './tests'`, `baseURL` from `process.env.BASE_URL`, a single `chromium` project, HTML + list reporters, `retries: 2` on CI, and diagnostics on failure (`trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`). It also raises `actionTimeout`/`navigationTimeout` for a slow SPA.
- **TypeScript** — [tsconfig.json](tsconfig.json) runs in `strict` mode with path aliases (`@page-objects/*`, `@utils/*`).
- **Environment** — `dotenv.config()` runs in the config, so `.env` values (base URL, credentials, API keys) load before tests. Secrets stay out of source; [.env.example](.env.example) documents the contract.
- **Architecture** — Page Object Model under [page-objects/](page-objects/), shared helpers under [utils/](utils/), with [BasePage.ts](page-objects/BasePage.ts) as the abstract base.

### 2. Test Case Planning

**Sign-up flow** — key elements identified and exercised in [SignUpPage.ts](page-objects/SignUpPage.ts):
- Email input + Terms-of-Service checkbox (required) + Sign-up button
- Password creation
- **Email verification** — the most important real-world step: a verification email is sent, fetched from Mailsac, and the confirm link is opened (`openConfirmationLink`)
- Onboarding: company name, industry, communication type/channel (`inputCompanyDetails`), then personal info (`inputPersonalInformation`), then "Get started" (`DashboardPage.clickGetStarted`)
- **Success assertion** — the account email is shown on the dashboard (`DashboardPage.assertUserEmail`)

**Login validation steps** ([LoginPage.ts](page-objects/LoginPage.ts)):
- "Welcome back" heading is visible (correct screen loaded)
- Email → Continue → Password → Sign in (two-step login)
- **Valid** → lands on dashboard, `DashboardPage.assertUserEmail` confirms the logged-in email
- **Invalid** → `wrongCredentialsError` ("Wrong username or password") is visible

**Valid vs. invalid credentials** — handled as two separate, independent tests in [test.spec.ts](tests/test.spec.ts) (`User login with valid credentials` and `user login with wrong password`). They share the same page objects but assert opposite outcomes (positive: dashboard email; negative: error message). The valid case reads `LOGIN_EMAIL`/`LOGIN_PASSWORD` via `getEnv`; the invalid case keeps the same email but passes a deliberately wrong literal password.

### 3. Locator Strategy

Locators are chosen by resilience, in this order (all defined in the page objects):
- **`getByRole`** (preferred) — semantic and accessible: `getByRole('heading', { name: 'Welcome back' })`, `getByRole('button', { name: 'Sign in' })`, `getByRole('textbox', { name: 'Email or username' })`.
- **`getByText`** — for messages/dynamic content: the verification message, the `wrongCredentialsError`, and the dashboard email assertion use `getByText(email, { exact: true })`.
- **Regex names** — to survive copy quirks like a curly vs. straight apostrophe: `getByRole('heading', { name: /your company name/i })`.
- **CSS** — for stable attributes without a good role: `input[name="personalName"]`, `input[type="tel"]`.
- **XPath / id** — last resort for app-specific hooks: `#terms-of-service`, `//button[@id='settings-menu-button']`.

**Best practices applied:** prefer role/text over brittle selectors; **avoid auto-generated MUI classes** (e.g. `css-46hv3n`) because they change between builds; use `{ exact: true }` when validating exact strings; and `force: true` on the styled (visually hidden) Terms checkbox where normal actionability fails. `data-testid` would be the first choice if the app exposed it.

### 4. Waits and Timing

The framework leans on Playwright's **auto-waiting** rather than fixed sleeps:
- **Web-first assertions** — `expect(locator).toBeVisible()` retries until the element appears (used for headings, errors, and the dashboard email check).
- **Explicit element waits** — `locator.waitFor({ state: 'visible' })` before interacting with inputs (`inputLoginEmail`, `inputSignUpPassword`).
- **Navigation waits** — the email-confirmation step follows a multi-redirect OAuth chain (SendGrid → `sso.sleekflow.io` → `app.sleekflow.io`), so `openConfirmationLink` uses `page.waitForURL(/app\.sleekflow\.io/, { timeout: 30_000 })` then asserts the onboarding heading with an extended timeout — this avoids asserting mid-redirect.
- **Asynchronous external state** — email delivery is polled, not slept on: `getLatestEmailLink` in [utils/apiCall.ts](utils/apiCall.ts) polls the Mailsac inbox until the verification email arrives (default 30s, 2s interval).
- **Global timeouts** — `actionTimeout`/`navigationTimeout` in [playwright.config.ts](playwright.config.ts) bound slow SPA actions, and `trace`/`video`/`screenshot` on failure make timing issues debuggable after the fact.

### 5. Test Data Management

In my experience, the best way to keep the system free of dummy data is to **start from a clean slate on every run**: each test creates the data it needs and tears it down afterwards, so nothing leaks between runs. Even better is to **maintain test data in a separate, dedicated database/environment** that can be seeded and wiped independently of production — tests then stay deterministic and repeatable without ever polluting real data.

To add to that: I'd generate **unique data per run** (e.g. timestamped/random identifiers) so tests never collide and can run in parallel, prefer **API-based setup/teardown** over driving the UI for everything (only exercise the UI for the behaviour actually under test), and run against a **non-production environment**. Where a system can't be fully cleaned (e.g. a third-party service with no delete API), the pragmatic fallback is disposable identities plus whatever teardown the API does allow.

### 6. Reusability

My approach is the **Page Object Model**: each screen is a class that owns its locators and exposes intent-revealing methods (`clickLoginButton`, `inputSignUpEmail`, …), so a step is written once and reused by any test that needs it tests describe *what* happens, the page objects hold *how*.

To add to that, reuse goes a few layers deeper than just having page classes:
- **Keep actions in methods, not tests** — logic lives in the page object so every test calls the same well-tested step.
- **Share cross-page behaviour in a base class** — common actions (navigation, waits, safe clicks) sit in `BasePage` and every page inherits them.
- **Model transitions by returning the next page object** — a click that changes screens returns the page it lands on, so flows compose naturally and type-safely.
- **Extract non-UI helpers to `utils/`** — env access, data generation, API calls are reused without duplication.
- **Use fixtures for shared setup** and cache auth via `storageState` so tests don't repeat the same UI login.

**Example in this framework** — the "open site → open login" steps are identical across all three tests and come from the same methods: `homePage.clickLoginButton()` returns a `LoginPage`, reused by the sign-up, valid-login, and wrong-password tests alike. Page transitions chain through returned objects (`clickLoginButton()` → `LoginPage`, `clickSignUpButton()` → `SignUpPage`, `clickSignInButton()` → `DashboardPage`). And a single assertion method, `DashboardPage.assertUserEmail`, verifies the logged-in user for **both** the sign-up and login success paths — written once, reused everywhere.

### 7. Headless vs Headed

In my experience, **headless** is for cutting execution time — running in a CI pipeline or on another machine where there's no display and speed/resource use matter. **Headed** is more useful while developing and debugging, when you want to watch the browser actually drive the flow and see where it goes wrong.

On debugging specifically: headed gives real-time visibility, but you **don't need headed to debug a failure**. Like I do in this project, capturing a **trace, screenshot, and video on failure** lets you debug a headless CI run after the fact in the trace viewer, which is usually more reliable than rerunning headed and hoping to catch the moment. So the practical split is: **headed while authoring, headless + artifacts for CI.** (This project keeps `trace`/`screenshot`/`video` on failure in [playwright.config.ts](playwright.config.ts) for exactly that, and ships `test:headed`/`test:debug`/`test:ui` scripts for local work.)

### 8. CI Integration

In my experience there are a few scenarios where running automation in the pipeline is most valuable:

1. **Run only the highest-priority scenarios on deployment** — smoke tests and revenue-critical / business-process flows: the things that, if broken, stop the product from making money or block the core user experience. These should **gate the deployment** (fail the pipeline if they fail). If the tests live in a separate repo, run them right **after deployment** against the deployed environment instead.
2. **Use tagging to choose what runs where** — tag scenarios so the pipeline can select them: e.g. a `@smoke` set on every deploy, a heavier `@regression` set on a nightly **schedule**, and a `@post-deploy` set that runs after a release. Different triggers run different tags rather than always running everything. In Playwright this is just `npx playwright test --grep @smoke`.
3. **Make CI runs reliable and debuggable** — install browsers in the pipeline (`npx playwright install --with-deps`, cached), run **headless** with `retries` on CI (already set in [playwright.config.ts](playwright.config.ts)), and **shard/parallelise** to keep the suite fast. Always **publish artifacts** (HTML report, trace, screenshots, video) so a red build can be diagnosed from the trace viewer without re-running locally.
4. **Manage environments and secrets** — point the suite at the right environment via `BASE_URL`, and inject credentials/API keys from the **CI secret store** as env vars (the same contract as `.env`, never committed). Prefer a stable **staging** target over production for anything that creates data.

The practical pipeline shape: **gate every PR/deploy with a fast smoke run, run full regression on a schedule, and always upload artifacts on failure.**

### 9. Error Handling

My preference is to let the runner capture failure artifacts **automatically** rather than sprinkling try/catch around tests. Playwright does this from config, which this project sets in [playwright.config.ts](playwright.config.ts):

- **`screenshot: 'only-on-failure'`** — a screenshot of the page at the moment of failure.
- **`video: 'retain-on-failure'`** — the full run recording, kept only when the test fails.
- **`trace: 'on-first-retry'`** — the richest artifact: DOM snapshots per step, network requests, **console logs**, and the exact action that failed, opened in the trace viewer (`npx playwright show-report`). Playwright also writes an aria/error-context snapshot of the page, which makes "element not found vs. not visible" obvious.

All of these attach to the **HTML report**, so a failure is debuggable after the fact — and in CI you just upload that report/artifacts.

## Viewing Reports

```bash
npm run report
```
