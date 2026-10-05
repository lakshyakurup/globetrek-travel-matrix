import { expect, test } from "@playwright/test";

test("user can navigate from login to a protected trip workspace", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByText("Travel matrix")).toBeVisible();
  await page.goto("/dashboard/trips");
  await expect(page.getByRole("heading", { name: "Travel matrix" })).toBeVisible();
});
