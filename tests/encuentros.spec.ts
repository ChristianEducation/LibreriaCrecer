import { test, expect } from "@playwright/test";

test.describe("Encuentros — Público", () => {
  test("el índice redirige al bloque integrado en Conócenos", async ({ page }) => {
    await page.goto("/encuentros");

    await expect(page).toHaveURL(/\/nosotros#encuentros$/);
    const section = page.locator("#encuentros");
    await expect(section.getByRole("heading", { name: "Encuentros Crecer" })).toBeVisible();
    await expect(section.locator(".encounter-card")).toHaveCount(4);
  });

  test("un slug inexistente devuelve 404", async ({ page }) => {
    const response = await page.goto("/encuentros/este-slug-no-existe-jamasi91283");
    expect(response?.status()).toBe(404);
  });
});
