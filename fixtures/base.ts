import { test as base, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';
import { LoginPage } from '../page-objects/LoginPage';
import { SignUpPage } from '../page-objects/SignUpPage';
import { DashboardPage } from '../page-objects/DashboardPage';

type SleekflowFixtures = {
  loginPage: LoginPage;
  signUpPage: SignUpPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<SleekflowFixtures>({
  loginPage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    const loginPage = await homePage.clickLoginButton();
    await expect(loginPage.welcomeBackHeading).toBeVisible();
    await use(loginPage);
  },

  // Sign-up, login and dashboard all live in the same popup tab, so every
  // page object is bound to loginPage's page. Tests just request what they
  // need — no `new`, no passing the page around.
  signUpPage: async ({ loginPage }, use) => {
    await use(new SignUpPage(loginPage.currentPage));
  },

  dashboardPage: async ({ loginPage }, use) => {
    await use(new DashboardPage(loginPage.currentPage));
  },
});

export { expect } from '@playwright/test';