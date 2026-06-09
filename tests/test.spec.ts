import { expect, test } from "../fixtures/base";
import { SignUpPage } from "../page-objects/SignUpPage";
import { DashboardPage } from "../page-objects/DashboardPage";
import { generateMailsacEmail, getEnv } from "../utils/env";
import { getLatestEmailLink } from "../utils/apiCall";

test("User sign up on sleekflow.io", async ({ loginPage }) => {
  const signUpEmail = generateMailsacEmail();

  let signUpPage: SignUpPage;
  await test.step("Click sign up button", async () => {
    signUpPage = await loginPage.clickSignUpButton();
  });

  await test.step("Input Email", async () => {
    await signUpPage.inputSignUpEmail(signUpEmail);
  });

  await test.step("Check Terms of Service", async () => {
    await signUpPage.checkTermsOfService();
    await expect(signUpPage.termsOfServiceCheckBox).toBeChecked();
  });

  await test.step("Click Sign Up Confirmation Button", async () => {
    await signUpPage.clickSignUpConfirmationButton();
  });

  await test.step("Input Password", async () => {
    await signUpPage.inputSignUpPassword(getEnv("SIGNUP_PASSWORD"));
  });

  await test.step("Click Sign Up Confirmation Button after input password", async () => {
    await signUpPage.clickSignUpConfirmationButton();
    await expect(signUpPage.verificationMessage(signUpEmail)).toBeVisible();
  });

  await test.step("Confirm email from Mailsac", async () => {
    const confirmLink = await getLatestEmailLink(signUpEmail);
    await signUpPage.openConfirmationLink(confirmLink);
  });

  await test.step("Input company details", async () => {
    await signUpPage.inputCompanyDetails();
  });

  let dashboardPage: DashboardPage;
  await test.step("Input personal information", async () => {
    dashboardPage = await signUpPage.inputPersonalInformation(getEnv("NAME"), getEnv("PHONE"));
  });

  await test.step("Click Get started", async () => {
    await dashboardPage.clickGetStarted();
  });

  await test.step("Assert Sign Up Successfully", async () => {
    await dashboardPage.assertUserEmail(signUpEmail);
  });
});

test("User login with valid credentials", async ({ loginPage }) => {
  await test.step("Input login email", async () => {
    await loginPage.inputLoginEmail(getEnv("LOGIN_EMAIL"));
  });

  await test.step("Input login password", async () => {
    await loginPage.inputLoginPassword(getEnv("LOGIN_PASSWORD"));
  });

  let dashboardPage: DashboardPage;
  await test.step("Click sign in button", async () => {
    dashboardPage = await loginPage.clickSignInButton();
  });

  await test.step("Assert login successful", async () => {
    await dashboardPage.assertUserEmail(getEnv("LOGIN_EMAIL"));
  });
});

test("user login with wrong password", async ({ loginPage }) => {
  await test.step("Input login email", async () => {
    await loginPage.inputLoginEmail(getEnv("LOGIN_EMAIL"));
  });

  await test.step("Input wrong login password", async () => {
    await loginPage.inputLoginPassword("wrongpassword");
  });

  await test.step("Click sign in button", async () => {
    await loginPage.clickSignInButton();
  });

  await test.step("validate wrong password", async () => {
    await expect(loginPage.wrongCredentialsError).toBeVisible();
  });
});
