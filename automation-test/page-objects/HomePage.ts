import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private readonly navInvestasi: Locator;
  readonly emasDigitalButton: Locator;
  private readonly reksaDanaButton: Locator;
  private readonly pencarianButton: Locator;
  private readonly searchBar: Locator;

  constructor(page: Page) {
    super(page);
    this.navInvestasi = page.getByRole('heading', { name: 'Investasi', exact: true });
    this.emasDigitalButton = page.getByRole('heading', { name: 'Emas Digital' })
    this.reksaDanaButton = page.getByRole('heading', { name: 'Reksa Dana' })
    this.pencarianButton = page.getByRole('button', { name: 'Pencarian' })
    this.searchBar = page.getByRole('textbox', { name: 'term' })
    
  }

  async clickInvestasiDropdown(): Promise<void> {
    await this.navInvestasi.click();
    await this.emasDigitalButton.waitFor({ state: 'visible' });
  }

  async clickReksaDana(): Promise<void> {
    await this.reksaDanaButton.click();
    await this.page.waitForURL('**/reksadana**');
  }

  async searchProduct(productName: string): Promise<void> {
    await this.pencarianButton.click();
    await this.searchBar.fill(productName);
    await this.searchBar.press('Enter');
    await this.page.waitForURL(`**/cari?term=*${encodeURIComponent(productName)}*`);
  }
}
