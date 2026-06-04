import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { SignUpPage } from "./SignUpPage";
import { DashboardPage } from "./DashboardPage";

export class LoginPage extends BasePage {
  private readonly signUpButton: Locator;
  readonly welcomeBackHeading: Locator;
  private readonly emailTextBox: Locator;
  private readonly continueButton: Locator;
  private readonly passwordTextBox: Locator;
  private readonly signInButton: Locator;
  readonly wrongCredentialsError: Locator;

  constructor(page: Page) {
    super(page);
    this.signUpButton = page.getByRole("link", { name: "Sign up" });
    this.welcomeBackHeading = page.getByRole("heading", {
      name: "Welcome back",
    });
    this.emailTextBox = page.getByRole("textbox", { name: "Email or username" });
    this.continueButton = page.getByRole("button", { name: "Continue", exact: true });
    this.passwordTextBox = page.getByRole("textbox", { name: "Password" });
    this.signInButton = page.getByRole("button", { name: "Sign in" });
    this.wrongCredentialsError = page.getByText("Wrong username or password");
  }

  async inputLoginEmail(email: string): Promise<void> {
    await this.emailTextBox.waitFor({ state: "visible" });
    await this.emailTextBox.click();
    await this.emailTextBox.fill(email);
    await this.continueButton.click();
  }

  async inputLoginPassword(password: string): Promise<void> {
    await this.passwordTextBox.waitFor({ state: "visible" });
    await this.passwordTextBox.click();
    await this.passwordTextBox.fill(password);
  }

  async clickSignInButton(): Promise<DashboardPage> {
    await this.signInButton.click();
    return new DashboardPage(this.page);
  }

  async clickSignUpButton(): Promise<SignUpPage> {
    await this.signUpButton.click();
    return new SignUpPage(this.page);
  }
}
