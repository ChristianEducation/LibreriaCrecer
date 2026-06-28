import { test, expect } from "@playwright/test";

test.describe("Encuentros — Público", () => {
  test("el índice de encuentros carga correctamente", async ({ page }) => {
    await page.goto("/encuentros");
    
    // Debería verse el header de la sección
    await expect(page.locator("h1")).toContainText(/Encuentros/i);
    await expect(page.locator("h1").locator("..")).toContainText(/Crecer/i);
  });

  test("un slug inexistente devuelve 404", async ({ page }) => {
    const response = await page.goto("/encuentros/este-slug-no-existe-jamasi91283");
    expect(response?.status()).toBe(404);
  });
});
