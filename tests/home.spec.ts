/**
 * Tests del Home (/)
 * Verifica que la página principal carga con los elementos estructurales esperados.
 */
import { test, expect } from "@playwright/test";

test.describe("Home", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("carga sin errores y muestra la navbar con el logo", async ({ page }) => {
    await expect(page.getByText("Crecer Libreria").first()).toBeVisible();
    await expect(page.getByText("Libreria cristiana").first()).toBeVisible();
  });

  test("muestra el hero con slider", async ({ page }) => {
    const hero = page.locator(".hero-wrapper");
    await expect(hero).toBeVisible();
  });

  test("muestra la sección Libros del mes", async ({ page }) => {
    const section = page.locator("#libros-mes");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
  });

  test("muestra la sección Recién llegados", async ({ page }) => {
    const section = page.locator("#recien-llegados");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
  });

  test("muestra el footer", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
    await expect(footer.getByText("Crecer Libreria")).toBeVisible();
  });

  test("link Colección navega a /productos", async ({ page }) => {
    // Buscar en el nav desktop (visible en viewport ancho)
    await page.getByRole("link", { name: "Colección" }).first().click();
    await expect(page).toHaveURL(/\/productos/);
  });
});
