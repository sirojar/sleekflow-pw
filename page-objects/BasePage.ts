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

  /**
   * The Playwright `Page` this object is bound to. Exposed so a test can build
   * another page object for the *same* tab (e.g. the popup) without the
   * navigating method having to return it. Use sparingly — prefer driving
   * screens through page-object methods over raw `page` access.
   */
  get currentPage(): Page {
    return this.page;
  }

  // --- Custom actions (shared across all page objects) ---

  /** Navigate to a path relative to the configured baseURL (defaults to home). */
  async goto(url: string = '/'): Promise<void> {
    await this.page.goto(url);
  }
}
