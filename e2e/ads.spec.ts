import { test, expect } from "@playwright/test";
import { expectNoHorizontalOverflow, failOnConsoleErrors } from "./_helpers";

const slot = "#sim .adsbygoogle";

test("reserves space before the ad resolves", async ({ page }) => {
  await page.goto("/");
  // Unreserved slots are a leading cause of layout shift, so the reservation
  // must be present from first paint.
  await expect(page.locator(slot)).toHaveCSS("min-height", "90px");
});

test("collapses a slot AdSense reports unfilled", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Simulate unfilled" }).click();
  await expect(page.locator(slot)).toBeHidden();
});

/**
 * Regression: unfilled detection used to OR DOM-shape guesses in with
 * AdSense's own verdict, so a filled slot whose iframe has no same-document
 * children was hidden too.
 */
test("leaves a filled slot visible", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Simulate filled" }).click();
  await expect(page.locator(slot)).toBeVisible();
  await expect(page.locator(slot)).toHaveCSS("display", "block");
});

test("releases the reserved height once filled", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Simulate filled" }).click();
  await expect.poll(async () =>
    page.locator(slot).evaluate((el) => (el as HTMLElement).style.minHeight)
  ).toBe("");
});

test("swaps in a fallback instead of an empty gap", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Fallback: off/ }).click();
  await page.getByRole("button", { name: "Simulate unfilled" }).click();
  await expect(page.getByText("No ad to show")).toBeVisible();
});

test("the slot is labelled for assistive technology", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByLabel("Advertisement").first()).toBeAttached();
});

test("no horizontal overflow at any width", async ({ page }) => {
  await page.goto("/");
  await expectNoHorizontalOverflow(page);
});

test("the demo page logs no errors", async ({ page }) => {
  const assertClean = failOnConsoleErrors(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Simulate filled" }).click();
  await page.waitForTimeout(400);
  assertClean();
});
