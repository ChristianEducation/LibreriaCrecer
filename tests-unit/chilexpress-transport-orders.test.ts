import assert from "node:assert/strict";
import test from "node:test";

import { buildTransportOrderPayload, parseTransportOrderResponse } from "../src/integrations/shipping/chilexpress/client";
import type { ChilexpressShipmentRequest } from "../src/integrations/shipping/chilexpress/types";

const baseRequest: ChilexpressShipmentRequest = {
  orderNumber: "ORD-0042",
  serviceTypeCode: "3",
  originCoverageCode: "ANTO",
  destinationCoverageCode: "PROV",
  package: { weightKg: 1.5, heightCm: 8, widthCm: 20, lengthCm: 28 },
  declaredWorth: 15000,
  labelType: 2,
  recipient: { name: "Nombre Destinatario", email: "nombreDestinatario@email.cl", phone: "123456789" },
  address: { street: "AVENIDA MANUEL MONTT", number: "427", apartment: "", commune: "PROVIDENCIA", observation: "" },
  sender: {
    name: "Crecer Libreria",
    email: "contacto@crecerlibreria.cl",
    phone: "56981336797",
    street: "Arturo Prat",
    number: "470",
    apartment: null,
    commune: "Antofagasta",
  },
};

test("arma el header con TCC, RUT y labelType segun el contrato oficial", () => {
  const payload = buildTransportOrderPayload({
    request: baseRequest,
    customerCardNumber: "18578680",
    marketplaceRut: "96756430",
    sellerRut: "96756430",
    productType: 3,
    declaredContent: 1,
  });

  assert.deepEqual(payload.header, {
    certificateNumber: 0,
    customerCardNumber: "18578680",
    countyOfOriginCoverageCode: "ANTO",
    labelType: 2,
    marketplaceRut: "96756430",
    sellerRut: "96756430",
  });
});

test("arma direcciones DEST/DEV y contactos D/R en el orden que exige el contrato", () => {
  const payload = buildTransportOrderPayload({
    request: baseRequest,
    customerCardNumber: "18578680",
    marketplaceRut: "96756430",
    sellerRut: "96756430",
    productType: 3,
    declaredContent: 1,
  });

  const [dest, dev] = payload.details[0].addresses;
  assert.equal(dest.addressType, "DEST");
  assert.equal(dest.countyCoverageCode, "PROV");
  assert.equal(dest.streetName, "AVENIDA MANUEL MONTT");
  assert.equal(dev.addressType, "DEV");
  assert.equal(dev.countyCoverageCode, "ANTO");
  assert.equal(dev.streetName, "Arturo Prat");

  const [remitente, destinatario] = payload.details[0].contacts;
  assert.equal(remitente.contactType, "R");
  assert.equal(remitente.name, "Crecer Libreria");
  assert.equal(destinatario.contactType, "D");
  assert.equal(destinatario.name, "Nombre Destinatario");
});

test("arma el paquete con el serviceTypeCode de la cotizacion pagada y sin cobro contra entrega", () => {
  const payload = buildTransportOrderPayload({
    request: baseRequest,
    customerCardNumber: "18578680",
    marketplaceRut: "96756430",
    sellerRut: "96756430",
    productType: 3,
    declaredContent: 1,
  });

  const [pkg] = payload.details[0].packages;
  // Package (rest-transport-orders-api.json) tipa estos campos como string.
  assert.equal(pkg.serviceDeliveryCode, "3");
  assert.equal(pkg.productCode, "3");
  assert.equal(pkg.deliveryReference, "ORD-0042");
  assert.equal(pkg.groupReference, "ORD-0042");
  assert.equal(pkg.declaredValue, "15000");
  assert.equal(pkg.declaredContent, "1");
  assert.ok(!("receivableAmountInDelivery" in pkg));
});

// Fixture: ejemplo real de respuesta 200 de rest-transport-orders-api.json
test("parsea la respuesta oficial de Generar envio y coacciona transportOrderNumber a string", () => {
  const response = parseTransportOrderResponse({
    data: {
      header: { certificateNumber: 712100832940, countOfGeneratedOrders: 1 },
      detail: [
        {
          transportOrderNumber: 712100833404,
          reference: "TEST-EOC-17",
          productDescription: "E",
          serviceDescription: "CHEX",
          serviceDescriptionFull: "EXPRESS",
          destinationCoverageAreaName: "(RM)PROVIDENCIA",
          barcode: "61003033117121008334040",
          recipient: "Marcela Vera",
          address: "AVENIDA MANUEL MONTT 427 LOCAL 2",
          label: { labelData: "", labelType: "Binary" },
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
  assert.equal(typeof response.transportOrderNumber, "string");
  assert.equal(response.reference, "TEST-EOC-17");
  assert.equal(response.serviceDescription, "CHEX");
  // labelData vacio en el fixture -> no hay nada que guardar en Storage.
  assert.equal(response.labelData, null);
  assert.equal(response.labelMimeType, null);
});

test("parsea respuesta con transportOrderNumber ya como string y expone labelData crudo (sin data URI)", () => {
  const response = parseTransportOrderResponse({
    data: {
      detail: [
        {
          transportOrderNumber: "99726299584",
          reference: "27699451457",
          label: { labelData: "/9j/4AAQSkZJRgABAQ==", labelType: "Binary" },
        },
      ],
    },
  });

  assert.equal(response.transportOrderNumber, "99726299584");
  assert.equal(response.reference, "27699451457");
  // labelData debe quedar CRUDO (sin "data:...;base64," embebido) — el
  // llamador es quien decide subirlo a Storage, nunca se arma un data URI aca.
  assert.equal(response.labelData, "/9j/4AAQSkZJRgABAQ==");
  assert.equal(response.labelMimeType, "image/jpeg");
});

test("responde con campos null si la API no devuelve detail", () => {
  const response = parseTransportOrderResponse({ data: { header: {} }, statusCode: -1 });
  assert.equal(response.transportOrderNumber, null);
  assert.equal(response.labelData, null);
  assert.equal(response.labelMimeType, null);
});
