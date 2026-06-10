import { test as base, expect, type Page } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';
import { LoginPage } from '../page-objects/LoginPage';
import { SignUpPage } from '../page-objects/SignUpPage';
import { DashboardPage } from '../page-objects/DashboardPage';

type SleekflowFixtures = {
  /** The popup tab the whole auth flow runs in (login → sign-up → dashboard). */
  authTab: Page;
  loginPage: LoginPage;
  signUpPage: SignUpPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<SleekflowFixtures>({
  // Open the auth popup once. Every auth page object binds to this tab,
  // so they depend on `authTab` — not on each other.
  authTab: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    const popup = await homePage.openLoginPopup();
    await use(popup);
  },

  loginPage: async ({ authTab }, use) => {
    const loginPage = new LoginPage(authTab);
    await expect(loginPage.welcomeBackHeading).toBeVisible();
    await use(loginPage);
  },

  signUpPage: async ({ authTab }, use) => {
    await use(new SignUpPage(authTab));
  },

  dashboardPage: async ({ authTab }, use) => {
    await use(new DashboardPage(authTab));
  },
});

export { expect } from '@playwright/test';