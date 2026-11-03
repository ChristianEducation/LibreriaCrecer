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
    await expect(page.getByText("Crecer Librería").first()).toBeVisible();
    await expect(page.getByText("C A T Ó L I C A").first()).toBeVisible();
  });

  test("muestra el hero con slider", async ({ page }) => {
    const hero = page.locator(".hero-full");
    await expect(hero).toBeVisible();
  });

  test("muestra la sección Libros del mes", async ({ page }) => {
    const section = page.locator("#libros-mes");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
  });

  test("muestra la franja de confianza bajo el hero", async ({ page }) => {
    const strip = page.locator(".trust-strip");
    await expect(strip).toBeVisible();
    await expect(strip.getByText("Despacho a todo Chile")).toBeVisible();
  });

  test("muestra las tarjetas de Regalos con intención y llevan a /regalos filtrado", async ({ page }) => {
    const section = page.locator("#regalos");
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator(".gift-card").first()).toBeVisible();
    await expect(section.getByRole("link", { name: /Bautizo/ })).toHaveAttribute(
      "href",
      "/regalos?ocasion=bautizo",
    );
  });

  test("muestra la sección con pestañas Más buscados y Recién llegados", async ({ page }) => {
    const section = page.locator("#mas-buscados");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    await expect(section.getByRole("tab", { name: "Recién llegados" })).toBeVisible();
    await section.getByRole("tab", { name: "Recién llegados" }).click();
    await expect(section.getByRole("tab", { name: "Recién llegados" })).toHaveAttribute("aria-selected", "true");
  });

  test("muestra la suscripción por correo", async ({ page }) => {
    const card = page.locator("#suscripcion");
    await card.scrollIntoViewIfNeeded();
    await expect(card.getByRole("button", { name: "Suscribirme" })).toBeVisible();
  });

  test("muestra el footer", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
    await expect(footer.getByText("Crecer Librería").first()).toBeVisible();
  });

  test("link Colección navega a /productos", async ({ page, isMobile }) => {
    if (isMobile) test.skip();
    // Buscar en el nav desktop (visible en viewport ancho)
    await page.getByRole("link", { name: "Colección" }).first().click();
    await expect(page).toHaveURL(/\/productos/);
  });
});
