import { expect, test } from "@playwright/test";

test("homepage renders the primary engineer hero and recruiter value proposition", async ({ page }) => {
  await page.goto("/");

  // Check Primary Headline
  await expect(
    page.getByRole("heading", { level: 1 }),
  ).toBeVisible();

  await expect(
    page.getByText("Muhammad Luthfi", { exact: false }),
  ).toBeVisible();

  // Check Navigation and CTA
  await expect(page.getByRole("link", { name: /Jelajahi Portofolio/i })).toBeVisible();
});

test("homepage displays real-world project showcase and STAR case studies", async ({ page }) => {
  await page.goto("/");

  // Verify Project Cards
  await expect(page.getByText("GreenPay E-Wallet", { exact: false })).toBeVisible();
  await expect(page.getByText("Sensei Edu-Sim Suite", { exact: false })).toBeVisible();
});

test("homepage renders multimodal ATS CV Generator section", async ({ page }) => {
  await page.goto("/");

  // Verify ATS Generator Teaser / Section
  await expect(page.getByText(/ATS-Friendly CV Generator/i)).toBeVisible();
});
