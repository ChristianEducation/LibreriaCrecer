/**
 * Tests de página de detalle de producto (/productos/[slug])
 * Requiere datos en la BD — correr `npm run seed:products` antes.
 * Navega desde el catálogo al primer producto y verifica el contenido.
 */
import { test, expect } from "@playwright/test";

test.describe("Detalle de producto", () => {
  // Navegar al primer producto desde el catálogo antes de cada test
  test.beforeEach(async ({ page }) => {
    await page.goto("/productos");
    await page.locator('article[role="link"]').first().click();
    await expect(page).toHaveURL(/\/productos\/.+/);
  });

  test("muestra el título del producto en un h1", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    // El título no debe estar vacío
    const text = await heading.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test("muestra el precio formateado en CLP", async ({ page }) => {
    // Scope a main para evitar el CartPanel oculto que también tiene precios ($0)
    await expect(page.locator("main").getByText(/^\$[\d.]+/).first()).toBeVisible();
  });

  test("muestra el botón 'Añadir al carrito'", async ({ page }) => {
    const addBtn = page.getByRole("button", { name: /añadir al carrito/i });
    await expect(addBtn).toBeVisible();
  });

  test("el botón 'Añadir al carrito' muestra confirmación al hacer click", async ({ page }) => {
    const addBtn = page.getByRole("button", { name: /añadir al carrito/i });
    await addBtn.click();
    // El botón cambia texto a "Agregado" — usar locator separado para evitar stale reference
    await expect(page.getByText(/agregado/i).first()).toBeVisible({ timeout: 3000 });
  });

  test("muestra la imagen o el placeholder del libro", async ({ page }) => {
    // La galería tiene un botón principal (click abre lightbox)
    const galleryBtn = page.locator("button.group").first();
    await expect(galleryBtn).toBeVisible();
  });

  test("muestra breadcrumb con enlace a Colección", async ({ page }) => {
    // Scope a main para evitar el link "Colección" del Navbar
    await expect(page.locator("main").getByRole("link", { name: "Colección" })).toBeVisible();
  });

  test("muestra sección de productos relacionados si existen", async ({ page }) => {
    // La sección podría no existir si no hay relacionados
    const related = page.getByRole("heading", { name: /relacionados/i });
    const count = await related.count();
    if (count > 0) {
      await expect(related).toBeVisible();
    }
  });
});
