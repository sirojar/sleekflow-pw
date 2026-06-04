import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  private readonly settingsMenuButton: Locator;
  private readonly getStartedButton: Locator;

  constructor(page: Page) {
    super(page);
    this.settingsMenuButton = page.locator(`//button[@id='settings-menu-button']`);
    this.getStartedButton = page.getByRole("button", { name: "Get started" });
  }

  async clickGetStarted(): Promise<void> {
    await this.getStartedButton.click();
  }

  async assertUserEmail(email: string): Promise<void> {
    await this.settingsMenuButton.click();
    await expect(this.page.getByText(email, { exact: true })).toBeVisible();
  }
}
