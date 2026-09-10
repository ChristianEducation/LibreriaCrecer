import assert from "node:assert/strict";
import test from "node:test";

import { buildLabelStoragePlan } from "../src/integrations/shipping/chilexpress/label-storage";

test("arma un path predecible por orderNumber/OT y nunca incluye el base64 en el path", () => {
  const plan = buildLabelStoragePlan({
    orderNumber: "ORD-0042",
    transportOrderNumber: "712100833404",
    labelData: "/9j/4AAQSkZJRgABAQ==",
  });

  assert.ok(plan);
  assert.equal(plan?.path, "ORD-0042/712100833404.jpg");
  assert.equal(plan?.mimeType, "image/jpeg");
  // El path nunca debe contener el contenido base64 de la etiqueta.
  assert.ok(!plan?.path.includes("/9j/"));
});

test("detecta la extension correcta segun el mime type real (png, pdf, binario desconocido)", () => {
  const png = buildLabelStoragePlan({
    orderNumber: "ORD-0001",
    transportOrderNumber: "111",
    labelData: "iVBORw0KGgoAAAANSU=",
  });
  assert.equal(png?.path, "ORD-0001/111.png");

  const pdf = buildLabelStoragePlan({
    orderNumber: "ORD-0002",
    transportOrderNumber: "222",
    labelData: "JVBERi0xLjQKJ",
  });
  assert.equal(pdf?.path, "ORD-0002/222.pdf");

  const desconocido = buildLabelStoragePlan({
    orderNumber: "ORD-0003",
    transportOrderNumber: "333",
    labelData: "basura-no-reconocida",
  });
  assert.equal(desconocido?.path, "ORD-0003/333.bin");
});

test("decodifica el base64 a bytes reales (no guarda el string base64 crudo)", () => {
  const plan = buildLabelStoragePlan({
    orderNumber: "ORD-0042",
    transportOrderNumber: "712100833404",
    labelData: Buffer.from("contenido-de-prueba").toString("base64"),
  });

  assert.ok(plan);
  assert.ok(Buffer.isBuffer(plan?.bytes));
  assert.equal(plan?.bytes.toString("utf8"), "contenido-de-prueba");
});

test("devuelve null si Chilexpress no entrego labelData", () => {
  assert.equal(buildLabelStoragePlan({ orderNumber: "ORD-1", transportOrderNumber: "1", labelData: "" }), null);
  assert.equal(buildLabelStoragePlan({ orderNumber: "ORD-1", transportOrderNumber: "1", labelData: "   " }), null);
});

test("reimprimir la misma OT produce el mismo path (upsert idempotente, no acumula archivos)", () => {
  const primeraVez = buildLabelStoragePlan({
    orderNumber: "ORD-0042",
    transportOrderNumber: "712100833404",
    labelData: "/9j/4AAQSkZJRgABAQ==",
  });
  const reintento = buildLabelStoragePlan({
    orderNumber: "ORD-0042",
    transportOrderNumber: "712100833404",
    labelData: "/9j/otroContenidoDeLaMismaEtiqueta==",
  });

  assert.ok(primeraVez && reintento);
  // Mismo orderNumber + mismo OT -> mismo path, sin importar que cambien los
  // bytes exactos: storeChilexpressLabel() sube con upsert:true, por lo que
  // reintentar la recuperacion sobreescribe el mismo objeto en vez de acumular.
  assert.equal(primeraVez?.path, reintento?.path);
});
