import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginPage } from './LoginPage';

export class HomePage extends BasePage {
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.loginButton = page.getByRole('link', { name: 'Log In' })
  }

  async clickLoginButton(): Promise<LoginPage> {
    const [newPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.loginButton.click(),
    ]);
    await newPage.waitForLoadState();
    return new LoginPage(newPage);
  }
}
