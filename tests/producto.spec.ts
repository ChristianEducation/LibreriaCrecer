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
    // El precio siempre empieza con $ (formatCLP)
    await expect(page.getByText(/^\$[\d.]+/).first()).toBeVisible();
  });

  test("muestra el botón 'Añadir al carrito'", async ({ page }) => {
    const addBtn = page.getByRole("button", { name: /añadir al carrito/i });
    await expect(addBtn).toBeVisible();
  });

  test("el botón 'Añadir al carrito' muestra confirmación al hacer click", async ({ page }) => {
    const addBtn = page.getByRole("button", { name: /añadir al carrito/i });
    await addBtn.click();
    // Cambia a "Agregado" por 2 segundos
    await expect(addBtn).toContainText(/agregado/i, { timeout: 3000 });
  });

  test("muestra la imagen o el placeholder del libro", async ({ page }) => {
    // La galería tiene un botón principal (click abre lightbox)
    const galleryBtn = page.locator("button.group").first();
    await expect(galleryBtn).toBeVisible();
  });

  test("muestra breadcrumb con enlace a Colección", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Colección" })).toBeVisible();
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
