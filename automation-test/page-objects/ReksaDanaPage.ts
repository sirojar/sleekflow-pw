import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ReksaDanaPage extends BasePage {
  private readonly reksaDanaPasarUang: Locator;
  private readonly reksaDanaPasarUangSyariah: Locator;
  readonly cagr1Tahun: Locator;
  private readonly filterButton: Locator;
  private readonly syariahCheckBox: Locator;
  private readonly terapkanButton: Locator;
  private readonly bandingkanButton: Locator;
  private readonly bandingkanApplyButton: Locator;

  constructor(page: Page) {
    super(page);
    this.reksaDanaPasarUang = page.getByRole('link', { name: '  Pasar Uang Risiko dan' });
    this.reksaDanaPasarUangSyariah = page.getByText('Expense Ratio');
    this.cagr1Tahun = page.getByText('CAGR 1 Tahun')
    this.filterButton = page.getByRole('button', { name: 'Filter' })
    this.syariahCheckBox = page.getByText('Syariah', { exact: true })
    this.terapkanButton = page.getByRole('button', { name: 'Terapkan' })
    this.bandingkanButton = page.getByRole('button', { name: 'Bandingkan' })
    this.bandingkanApplyButton = page.getByRole('button', { name: 'Bandingkan', exact: true })
  }

  async clickReksaDanaPasarUang(): Promise<void> {
    await this.reksaDanaPasarUang.click();
  }

  async compareReksaDanaPasarUangSyariah(): Promise<void> {
    await this.reksaDanaPasarUangSyariah.first().click();
    await this.reksaDanaPasarUangSyariah.nth(1).click();
  }

  async clickFilterButton(): Promise<void> {
    await this.filterButton.click();
  }

  async clickSyariahCheckBox(): Promise<void> {
    await this.syariahCheckBox.click();
  }

  async clickTerapkanButton(): Promise<void> {
    await this.terapkanButton.click();
  }

  async clickBandingkanButton(): Promise<void> {
    await this.bandingkanButton.click();
  }

  async clickBandingkanApplyButton(): Promise<void> {
    await this.bandingkanApplyButton.click();
  }
}
