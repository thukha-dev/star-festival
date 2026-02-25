import { expect, test } from "@playwright/test";

test("renders hero and wish panel", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Star Festival")).toBeVisible();
  await page.locator("main section button").first().click();
  await expect(page.locator("#wish-text")).toBeVisible();
});
