import assert from "node:assert/strict";
import test from "node:test";

import { buildLabelReprintRequest, buildTransportOrderPayload, parseTransportOrderResponse } from "../src/integrations/shipping/chilexpress/client";
import type { ChilexpressShipmentRequest } from "../src/integrations/shipping/chilexpress/types";

// 1. Request correcto a POST /transport-orders-labels (TransportOrderLabelRequest)
test("arma el body de reimpresion con transportOrderNumber como number y labelType 2", () => {
  const body = buildLabelReprintRequest("712100833404", 2);

  assert.deepEqual(body, { transportOrderNumber: 712100833404, labelType: 2 });
  // El schema oficial tipa transportOrderNumber como number, no string.
  assert.equal(typeof body.transportOrderNumber, "number");
});

test("rechaza un transportOrderNumber que no sea numerico", () => {
  assert.throws(() => buildLabelReprintRequest("no-es-un-numero", 2));
});

// 2. Parser de la respuesta oficial de GenerateLabelForTO (misma forma que Generar envio)
test("parsea la respuesta oficial de reimpresion y obtiene labelData/mime", () => {
  const response = parseTransportOrderResponse({
    data: {
      header: { certificateNumber: 712100832940, countOfGeneratedOrders: 1 },
      detail: [
        {
          transportOrderNumber: 712100833404,
          reference: "TEST-EOC-17",
          serviceDescription: "CHEX",
          deliveryTypeCode: "EO",
          destinationCoverageAreaName: "(RM)PROVIDENCIA",
          recipient: "Marcela Vera",
          address: "AVENIDA MANUEL MONTT 427 LOCAL 2",
          label: { labelData: "/9j/4AAQSkZJRgABAQ==", labelType: "Binary" },
          statusCode: 0,
          statusDescription: "Extraccion exitosa",
        },
      ],
    },
    statusCode: 0,
    statusDescription: "Extraccion exitosa",
    errors: null,
  });

  assert.equal(response.transportOrderNumber, "712100833404");
  assert.equal(response.labelData, "/9j/4AAQSkZJRgABAQ==");
  assert.equal(response.labelMimeType, "image/jpeg");
});

test("respuesta de reimpresion sin etiqueta (labelData vacio, como en el ejemplo oficial) queda en null", () => {
  const response = parseTransportOrderResponse({
    data: { detail: [{ transportOrderNumber: 712100833404, label: { labelData: "", labelType: "Binary" } }] },
  });

  assert.equal(response.labelData, null);
  assert.equal(response.labelMimeType, null);
});

// 3. La recuperacion NUNCA genera una OT nueva: el body de reimpresion es
// estructuralmente distinto al de creacion de OT (no tiene header/details),
// y ambas funciones pegan a paths distintos dentro de client.ts.
test("el body de reimpresion no tiene la forma de una creacion de OT (sin header ni details)", () => {
  const reprintBody = buildLabelReprintRequest("712100833404", 2);

  assert.ok(!("header" in reprintBody));
  assert.ok(!("details" in reprintBody));
  assert.deepEqual(Object.keys(reprintBody).sort(), ["labelType", "transportOrderNumber"]);
});

test("el body de creacion de OT (buildTransportOrderPayload) sigue siendo header+details — no se confunde con el de reimpresion", () => {
  const request: ChilexpressShipmentRequest = {
    orderNumber: "ORD-0042",
    serviceTypeCode: "3",
    originCoverageCode: "ANTO",
    destinationCoverageCode: "PROV",
    package: { weightKg: 1, heightCm: 8, widthCm: 20, lengthCm: 28 },
    declaredWorth: 15000,
    labelType: 2,
    recipient: { name: "Destinatario", email: "d@d.cl", phone: "1" },
    address: { street: "Calle", number: "1", commune: "PROVIDENCIA" },
    sender: { name: "Crecer", email: "r@r.cl", phone: "2", street: "Calle Origen", number: "2", commune: "Antofagasta" },
  };

  const createBody = buildTransportOrderPayload({
    request,
    customerCardNumber: "18578680",
    marketplaceRut: "96756430",
    sellerRut: "96756430",
    productType: 3,
    declaredContent: 1,
  });

  assert.ok("header" in createBody && "details" in createBody);
  assert.ok(!("transportOrderNumber" in createBody));
});
