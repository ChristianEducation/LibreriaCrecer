import assert from "node:assert/strict";
import test from "node:test";

import { selectCompatiblePackage } from "../src/features/checkout/services/shipping-service";

const cajaS = { id: "pkg-s", maxWeightGrams: 1000, packageWeightGrams: 150, dimensions: { heightCm: 8, widthCm: 20, lengthCm: 25 } };
const cajaM = { id: "pkg-m", maxWeightGrams: 2500, packageWeightGrams: 300, dimensions: { heightCm: 12, widthCm: 25, lengthCm: 35 } };

test("elige el empaque compatible por cantidad y peso", () => {
  // 2 libros * 300g + 150g de la caja = 750g, cabe en cajaS (max 1000g)
  const result = selectCompatiblePackage([cajaS, cajaM], 2, 300);
  assert.ok(result);
  assert.equal(result?.packageId, "pkg-s");
  assert.equal(result?.weightGrams, 750);
});

test("pasa al siguiente empaque si el primero no soporta el peso total", () => {
  // 3 libros * 300g + 150g = 1050g > 1000g de cajaS -> debe usar cajaM
  const result = selectCompatiblePackage([cajaS, cajaM], 3, 300);
  assert.ok(result);
  assert.equal(result?.packageId, "pkg-m");
  assert.equal(result?.weightGrams, 1200);
});

test("devuelve null si ningun empaque soporta el peso — nunca usa el primero igual", () => {
  // 8 libros * 300g + 300g = 2700g > 2500g de cajaM (el mas grande disponible)
  const result = selectCompatiblePackage([cajaS, cajaM], 8, 300);
  assert.equal(result, null);
});

test("devuelve null si no hay ningun empaque activo — nunca inventa una caja 8x20x28", () => {
  const result = selectCompatiblePackage([], 1, 300);
  assert.equal(result, null);
});

test("el peso final es peso de productos + peso de embalaje, redondeado a 2 decimales en kg", () => {
  const result = selectCompatiblePackage([cajaS], 1, 333);
  // 1 * 333 + 150 = 483g -> 0.48kg
  assert.ok(result);
  assert.equal(result?.weightGrams, 483);
  assert.equal(result?.weightKg, 0.48);
});
