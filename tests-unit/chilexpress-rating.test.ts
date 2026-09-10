import assert from "node:assert/strict";
import test from "node:test";

import { detectLabelMimeType, normalizeRateOption } from "../src/integrations/shipping/chilexpress/client";

// Fixture: ejemplo real de rest-rating-api.json (respuesta 200 de /rates/business)
test("usa serviceValueDiscount como valor efectivo cuando existe y es valido", () => {
  const option = normalizeRateOption({
    serviceTypeCode: 2,
    serviceDescription: "PRIORITARIO",
    didUseVolumetricWeight: false,
    finalWeight: "16.00",
    serviceValue: "8569",
    conditions: "",
    deliveryType: 0,
    serviceValueDiscount: "5713",
    additionalServices: [],
  });

  assert.ok(option);
  assert.equal(option?.serviceValue, 8569);
  assert.equal(option?.serviceValueDiscount, 5713);
  assert.equal(option?.effectiveValue, 5713);
});

// Fixture: respuesta de /rates/courier (no incluye serviceValueDiscount)
test("cae a serviceValue cuando no hay serviceValueDiscount", () => {
  const option = normalizeRateOption({
    serviceTypeCode: 3,
    serviceDescription: "DIA HABIL SIGUIENTE",
    didUseVolumetricWeight: false,
    finalWeight: "1.00",
    serviceValue: "8042",
    conditions: "",
    deliveryType: 2,
    additionalServices: [],
  });

  assert.ok(option);
  assert.equal(option?.serviceValueDiscount, null);
  assert.equal(option?.effectiveValue, 8042);
});

test("cae a serviceValue cuando serviceValueDiscount es 0 o invalido", () => {
  const zeroDiscount = normalizeRateOption({
    serviceTypeCode: 2,
    serviceDescription: "PRIORITARIO",
    serviceValue: "8569",
    serviceValueDiscount: "0",
  });
  assert.equal(zeroDiscount?.effectiveValue, 8569);

  const invalidDiscount = normalizeRateOption({
    serviceTypeCode: 2,
    serviceDescription: "PRIORITARIO",
    serviceValue: "8569",
    serviceValueDiscount: "no-es-un-numero",
  });
  assert.equal(invalidDiscount?.effectiveValue, 8569);
});

test("descarta opciones sin serviceTypeCode o serviceValue valido", () => {
  assert.equal(normalizeRateOption({ serviceDescription: "sin codigo" }), null);
  assert.equal(normalizeRateOption({ serviceTypeCode: 2, serviceValue: "no-numero" }), null);
  assert.equal(normalizeRateOption(null), null);
});

test("detectLabelMimeType detecta JPEG, PNG y PDF por su prefijo base64, y octet-stream si no reconoce el formato", () => {
  assert.equal(detectLabelMimeType("/9j/4AAQSkZJRgABAQ=="), "image/jpeg");
  assert.equal(detectLabelMimeType("iVBORw0KGgoAAAANSU="), "image/png");
  assert.equal(detectLabelMimeType("JVBERi0xLjQKJ"), "application/pdf");
  assert.equal(detectLabelMimeType("basura-no-reconocida"), "application/octet-stream");
});
