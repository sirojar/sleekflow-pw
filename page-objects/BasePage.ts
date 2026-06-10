import { Page } from '@playwright/test';

/**
 * Abstract base class for all Page Objects.
 *
 * Holds the shared Playwright `page` and is the home for **custom, reusable
 * actions** — wrappers shared by every page (navigation, scrolling, safe
 * clicks/fills, waiting helpers, etc.). Add cross-page behaviour here so
 * individual Page Objects stay focused on their own screen.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --- Custom actions (shared across all page objects) ---

  /** Navigate to a path relative to the configured baseURL (defaults to home). */
  async goto(url: string = '/'): Promise<void> {
    await this.page.goto(url);
  }
}
