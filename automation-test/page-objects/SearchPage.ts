import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  private readonly ditemukanLabel: Locator;
  private readonly categoryBadges: Locator;

  constructor(page: Page) {
    super(page);
    this.ditemukanLabel = page.getByText('Ditemukan');
    this.categoryBadges = page.locator('[data-button-name*="list-searchresultpage"] span.badge.pull-right');
  }

  async getSearchResultText(): Promise<string> {
    return await this.ditemukanLabel.textContent() ?? '';
  }

  async getSearchResultCount(): Promise<number> {
    const text = await this.getSearchResultText();
    return parseInt(text.match(/\d+/)?.[0] ?? '0');
  }

  async getCategoryTotalCount(): Promise<number> {
    // Wait until at least one category badge is rendered before collecting
    await this.categoryBadges.first().waitFor({ state: 'visible' });

    // Resolve all matched badge locators into an array of individual Locators
    const badges = await this.categoryBadges.all();

    // Read each badge's text and parse it as a number in parallel
    const counts = await Promise.all(
      badges.map(async (badge, index) => {
        const text = (await badge.textContent() ?? '').trim();
        const num = parseInt(text, 10);
        // Guard against empty strings or non-numeric text returning NaN
        const value = isNaN(num) ? 0 : num;
        console.log(`Badge [${index}]: "${text}" → ${value}`);
        return value;
      })
    );

    // Sum all category counts into a single total
    const total = counts.reduce((sum, count) => sum + count, 0);
    console.log(`Total: ${total}`);
    return total;
  }
}
