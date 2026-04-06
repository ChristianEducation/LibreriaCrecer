/**
 * Tests del Catálogo (/productos)
 * Requiere datos en la BD — correr `npm run seed:products` antes.
 * Verifica carga de la página, filtros, orden y búsqueda.
 */
import { test, expect } from "@playwright/test";

test.describe("Catálogo /productos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/productos");
  });

  test("carga con header y grilla de productos", async ({ page }) => {
    // PageHeader con "Nuestra colección"
    await expect(page.getByRole("heading", { name: /colecci/i }).first()).toBeVisible();
    // FilterBar con label FILTRAR
    await expect(page.getByText("FILTRAR")).toBeVisible();
    // Al menos un producto en la grilla
    await expect(page.locator('article[role="link"]').first()).toBeVisible();
  });

  test("muestra el contador de resultados", async ({ page }) => {
    // FilterBar muestra "N productos"
    await expect(page.getByText(/productos?/)).toBeVisible();
  });

  test("chip 'Nuevos' actualiza la URL con filter=nuevo", async ({ page }) => {
    await page.getByRole("button", { name: "Nuevos" }).first().click();
    await expect(page).toHaveURL(/filter=nuevo/);
  });

  test("chip 'En oferta' actualiza la URL con filter=oferta", async ({ page }) => {
    await page.getByRole("button", { name: "En oferta" }).first().click();
    await expect(page).toHaveURL(/filter=oferta/);
  });

  test("chip 'Todos' limpia el filtro en la URL", async ({ page }) => {
    // Primero aplicar filtro
    await page.goto("/productos?filter=nuevo");
    await page.getByRole("button", { name: "Todos" }).first().click();
    // URL no tiene filter=
    await expect(page).not.toHaveURL(/filter=/);
  });

  test("botón de orden 'Precio: menor a mayor' actualiza URL", async ({ page }) => {
    await page.getByRole("button", { name: /menor a mayor/i }).first().click();
    await expect(page).toHaveURL(/sort=price_asc/);
  });

  test("búsqueda actualiza la URL con el parámetro search", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Buscar...").first();
    await searchInput.fill("biblia");
    await searchInput.press("Enter");
    await expect(page).toHaveURL(/search=biblia/);
  });

  test("buscar un término vacío no agrega search a la URL", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Buscar...").first();
    await searchInput.fill("  ");
    await searchInput.press("Enter");
    await expect(page).not.toHaveURL(/search=/);
  });

  test("hacer click en un producto navega al detalle", async ({ page }) => {
    const firstProduct = page.locator('article[role="link"]').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();
    await expect(page).toHaveURL(/\/productos\/.+/);
  });
});
