import { test as base, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';
import { LoginPage } from '../page-objects/LoginPage';

type SleekflowFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<SleekflowFixtures>({
  loginPage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    const loginPage = await homePage.clickLoginButton();
    await expect(loginPage.welcomeBackHeading).toBeVisible();
    await use(loginPage);
  },
});

export { expect } from '@playwright/test';
