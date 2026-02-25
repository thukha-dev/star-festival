import { expect, test } from "@playwright/test";

test("renders hero and wish panel", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Star Festival")).toBeVisible();
  await page.getByRole("button", { name: "Make a Wish" }).click();
  await expect(page.getByText("Hang Your Wish")).toBeVisible();
});
