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

  test("muestra el CTA de compra ('Añadir al carrito') o de consulta ('Consultar por WhatsApp') según disponibilidad", async ({ page }) => {
    // Un producto es comprable solo si online_sale_enabled=true además de activo/con stock;
    // en modo consulta el CTA de compra se reemplaza por un link a WhatsApp. Ambos son
    // estados válidos según el estado real del producto — se verifica cuál corresponde.
    const addBtn = page.getByRole("button", { name: /añadir al carrito/i });
    // Se filtra por href, no por accesible role/name: el <article role="link"> de las
    // tarjetas relacionadas concatena "Consultar por WhatsApp" en su propio nombre accesible.
    const whatsAppLink = page.locator('a[href^="https://wa.me/"]').first();

    const isPurchasable = await addBtn.isVisible().catch(() => false);
    if (isPurchasable) {
      await expect(addBtn).toBeVisible();
    } else {
      await expect(whatsAppLink).toBeVisible();
      await expect(whatsAppLink).toHaveAttribute("href", /^https:\/\/wa\.me\/56992197121\?text=/);
    }
  });

  test("el botón 'Añadir al carrito' muestra confirmación al hacer click", async ({ page }) => {
    const addBtn = page.getByRole("button", { name: /añadir al carrito/i });
    const isPurchasable = await addBtn.isVisible().catch(() => false);
    test.skip(!isPurchasable, "Producto en modo consulta — no tiene CTA de compra que confirmar.");

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
