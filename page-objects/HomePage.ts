import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.loginButton = page.getByRole('link', { name: 'Log In' })
  }

  /**
   * Clicks "Log In", which opens the auth flow in a new browser tab,
   * and returns that popup Page.
   */
  async openLoginPopup(): Promise<Page> {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.loginButton.click(),
    ]);
    await popup.waitForLoadState();
    return popup;
  }
}