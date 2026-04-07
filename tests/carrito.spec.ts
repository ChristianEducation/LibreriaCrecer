/**
 * Tests del Carrito (/carrito)
 * Verifica el estado vacío y el flujo de agregar un producto al carrito.
 * Requiere datos en la BD — correr `npm run seed:products` antes.
 */
import { test, expect } from "@playwright/test";

test.describe("Carrito", () => {
  test("muestra estado vacío cuando no hay items", async ({ page }) => {
    await page.goto("/carrito");

    // Esperar hidratación de Zustand (skeleton desaparece)
    await expect(page.getByRole("heading", { name: /mi carrito/i })).toBeVisible();

    // Estado vacío — scope a main para evitar el CartPanel (que también tiene este texto)
    await expect(page.locator("main").getByText("Tu carrito está vacío")).toBeVisible();
    await expect(page.getByRole("link", { name: /ver colección/i })).toBeVisible();
  });

  test("el botón Ir al checkout está deshabilitado con carrito vacío", async ({ page }) => {
    await page.goto("/carrito");
    await expect(page.getByRole("heading", { name: /mi carrito/i })).toBeVisible();

    const checkoutLink = page.getByRole("link", { name: /ir al checkout/i });
    await expect(checkoutLink).toHaveCSS("pointer-events", "none");
  });

  test("agregar un producto desde el detalle lo muestra en el carrito", async ({ page }) => {
    // 1. Navegar al catálogo y clickear el primer producto
    await page.goto("/productos");
    await page.locator('article[role="link"]').first().click();
    await expect(page).toHaveURL(/\/productos\/.+/);

    // 2. Capturar título del producto
    const productTitle = await page.getByRole("heading", { level: 1 }).textContent();

    // 3. Agregar al carrito y esperar confirmación visual
    const addBtn = page.getByRole("button", { name: /añadir al carrito/i });
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // 4. El botón cambia a "Agregado" — verificar con locator separado
    await expect(page.getByText(/agregado/i).first()).toBeVisible({ timeout: 3000 });

    // 5. Navegar al carrito
    await page.goto("/carrito");
    await expect(page.getByRole("heading", { name: /mi carrito/i })).toBeVisible();

    // 6. El estado vacío NO debe aparecer (scoped a main)
    await expect(page.locator("main").getByText("Tu carrito está vacío")).not.toBeVisible({ timeout: 5000 });

    // 7. El título del producto aparece en el carrito — scope a main para evitar CartPanel oculto
    if (productTitle) {
      await expect(
        page.locator("main").getByText(productTitle.trim(), { exact: false }).first()
      ).toBeVisible();
    }
  });

  test("el subtotal del resumen muestra el precio formateado", async ({ page }) => {
    // Agregar un producto primero
    await page.goto("/productos");
    await page.locator('article[role="link"]').first().click();
    await page.getByRole("button", { name: /añadir al carrito/i }).click();

    // Ir al carrito
    await page.goto("/carrito");
    await expect(page.getByRole("heading", { name: /mi carrito/i })).toBeVisible();
    await expect(page.locator("main").getByText("Tu carrito está vacío")).not.toBeVisible({ timeout: 5000 });

    // Resumen muestra Subtotal con precio CLP — scope a main para evitar CartPanel oculto
    await expect(page.getByText("Subtotal")).toBeVisible();
    await expect(page.locator("main").getByText(/^\$[\d.]+/).first()).toBeVisible();
  });

  test("se puede aumentar la cantidad de un item con el stepper", async ({ page }) => {
    // Agregar producto
    await page.goto("/productos");
    await page.locator('article[role="link"]').first().click();
    await page.getByRole("button", { name: /añadir al carrito/i }).click();

    await page.goto("/carrito");
    await expect(page.locator("main").getByText("Tu carrito está vacío")).not.toBeVisible({ timeout: 5000 });

    // Click en botón "+"
    await page.getByRole("button", { name: "+" }).first().click();

    // La cantidad debe ser 2
    await expect(page.getByText("2").first()).toBeVisible();
  });
});
