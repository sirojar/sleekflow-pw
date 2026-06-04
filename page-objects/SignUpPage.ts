import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { DashboardPage } from "./DashboardPage";

export class SignUpPage extends BasePage {
  private readonly emailTextBox: Locator;
  readonly termsOfServiceCheckBox: Locator;
  private readonly signUpConfirmationButton: Locator;
  private readonly passwordTextBox: Locator;
  readonly confirmationHeading: Locator;
  private readonly companyNameTextBox: Locator;
  private readonly nextButton: Locator;
  private readonly chooseIndustry: Locator;
  private readonly chooseCommunicationType: Locator;
  private readonly chooseCommunicationChannel: Locator;
  private readonly personalNameTextBox: Locator;
  private readonly phoneTextBox: Locator;
  private readonly getStartedButton: Locator;


  constructor(page: Page) {
    super(page);
    this.emailTextBox = page.getByRole("textbox", { name: "Email address" });
    this.passwordTextBox = page.getByRole("textbox", { name: "Password" });
    this.termsOfServiceCheckBox = page.locator("#terms-of-service");
    this.signUpConfirmationButton = page.getByRole("button", {
      name: "Sign up",
    });
    this.confirmationHeading = page.getByRole("heading", { name: /your company name/i });
    this.companyNameTextBox = page.locator("//input[@name='companyName']");
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.chooseIndustry = page.getByRole("button", { name: "Retail and e-commerce" });
    this.chooseCommunicationType = page.getByRole("button", { name: "A shared Inbox for my team" });
    this.chooseCommunicationChannel = page.getByRole("button", { name: "whatsapp WhatsApp" });
    this.personalNameTextBox = page.locator('input[name="personalName"]');
    this.phoneTextBox = page.locator('input[type="tel"]');
    this.getStartedButton = page.getByRole("button", { name: "Get started" });

  }

  verificationMessage(email: string): Locator {
    return this.page.getByText(`We've sent a verification email to ${email}.`, { exact: true });
  }

  async inputSignUpEmail(email: string): Promise<void> {
    await this.emailTextBox.waitFor({ state: "visible" });
    await this.emailTextBox.click();
    await this.emailTextBox.fill(email);
  }

  async checkTermsOfService(): Promise<void> {
    await this.termsOfServiceCheckBox.check({ force: true });
  }

  async clickSignUpConfirmationButton(): Promise<void> {
    await this.signUpConfirmationButton.click();
  }

  async inputSignUpPassword(password: string): Promise<void> {
    await this.passwordTextBox.waitFor({ state: "visible" });
    await this.passwordTextBox.click();
    await this.passwordTextBox.fill(password);
  }

  async openConfirmationLink(confirmLink: string): Promise<void> {
    await this.page.goto(confirmLink);
    await this.page.waitForURL(/app\.sleekflow\.io/, { timeout: 30_000 });
    await expect(this.confirmationHeading).toBeVisible({ timeout: 20_000 });
  }

  async inputCompanyDetails(): Promise<void> {
    await this.companyNameTextBox.waitFor({ state: "visible" });
    await this.nextButton.click();
    await expect(this.chooseIndustry).toBeVisible();
    await this.chooseIndustry.click();
    await this.page.waitForTimeout(2000);
    await expect(this.chooseCommunicationType).toBeVisible();
    await this.chooseCommunicationType.click();
    await expect(this.chooseCommunicationChannel).toBeVisible();
    await this.chooseCommunicationChannel.click();
    await this.nextButton.click();
  }

  async inputPersonalInformation(name: string, phoneNumber: string): Promise<DashboardPage> {
    await this.personalNameTextBox.fill(name);
    await this.phoneTextBox.fill(phoneNumber);
    await this.getStartedButton.click();
    return new DashboardPage(this.page);
  }
}
