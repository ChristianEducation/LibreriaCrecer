/**
 * Tests de /regalos
 * Verifica el encabezado, los filtros por ocasión (vía URL) y el estado sin resultados.
 */
import { test, expect } from "@playwright/test";

test.describe("Regalos con intención", () => {
  test("muestra el encabezado y los filtros", async ({ page }) => {
    await page.goto("/regalos");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Regalos con");
    await expect(page.getByRole("group", { name: "Ocasiones" }).getByRole("button", { name: "Bautizo" })).toBeVisible();
  });

  test("llegar con ?ocasion= deja la ocasión ya filtrada", async ({ page }) => {
    await page.goto("/regalos?ocasion=matrimonio");
    await expect(page.locator("main").getByRole("heading", { name: "Matrimonio" })).toBeVisible();
    await expect(
      page.getByRole("group", { name: "Ocasiones" }).getByRole("button", { name: "Matrimonio" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("elegir una ocasión actualiza la URL", async ({ page }) => {
    await page.goto("/regalos");
    await page.getByRole("group", { name: "Ocasiones" }).getByRole("button", { name: "Flores" }).click();
    await expect(page).toHaveURL(/ocasion=flores/);
  });

  test("la ocasión Cualquier ocasión aparece al final", async ({ page }) => {
    await page.goto("/regalos");
    const chips = page.getByRole("group", { name: "Ocasiones" }).getByRole("button");
    await expect(chips.last()).toHaveText("Cualquier ocasión");
  });

  test("Navidad no aparece mientras el interruptor está apagado", async ({ page }) => {
    await page.goto("/regalos?ocasion=navidad");
    await expect(page.getByRole("group", { name: "Ocasiones" }).getByRole("button", { name: "Navidad" })).toHaveCount(0);
  });
});
