import { test as base } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';
import { ReksaDanaPage } from '../page-objects/ReksaDanaPage';
import { SearchPage } from '../page-objects/SearchPage';

type CermatiFixtures = {
  homePage: HomePage;
  reksaDanaPage: ReksaDanaPage;
  searchPage: SearchPage;
};

export const test = base.extend<CermatiFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  reksaDanaPage: async ({ page }, use) => {
    await use(new ReksaDanaPage(page));
  },

  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
});

export { expect } from '@playwright/test';
