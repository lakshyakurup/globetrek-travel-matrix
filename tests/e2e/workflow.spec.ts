import { expect, test } from "@playwright/test";

test("traveler can open the dashboard and filter trips", async ({ page }) => {
  await page.goto("/dashboard/trips");
  await expect(page.getByRole("heading", { name: "Travel matrix" })).toBeVisible();
  await page.getByPlaceholder("Search trips...").fill("Kyoto");
  await expect(page.getByText("Autumn in Kansai")).toBeVisible();
  await expect(page.getByText("Atlantic loop")).not.toBeVisible();
});
