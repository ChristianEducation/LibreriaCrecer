type ChilexpressConfig = {
  coverageApiKey: string;
  ratingApiKey: string;
  shipmentApiKey: string;
  coverageEndpoint: string;
  ratingEndpoint: string;
  shipmentEndpoint: string;
  originRegionCode: string;
  originCommune: string;
  originCoverageCode: string | null;
  tcc: string;
  senderRut: string;
};

// Defaults de negocio (no sensibles): sirven solo si no hay override en BD/env.
const BUSINESS_DEFAULTS = {
  originRegionCode: "R2",
  originCommune: "Antofagasta",
};

function removeTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function getOptionalEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export const chilexpressConfig: ChilexpressConfig = {
  coverageApiKey: getOptionalEnv("CHILEXPRESS_COVERAGE_API_KEY"),
  ratingApiKey: getOptionalEnv("CHILEXPRESS_RATING_API_KEY"),
  shipmentApiKey: getOptionalEnv("CHILEXPRESS_SHIPMENT_API_KEY"),
  // Sin defaults de host: un endpoint sin configurar debe fallar de forma
  // controlada (assertChilexpressEndpoint) en vez de golpear silenciosamente
  // un ambiente inesperado (QA/test/prod mezclados).
  coverageEndpoint: removeTrailingSlash(getOptionalEnv("CHILEXPRESS_COVERAGE_ENDPOINT")),
  ratingEndpoint: removeTrailingSlash(getOptionalEnv("CHILEXPRESS_RATING_ENDPOINT")),
  shipmentEndpoint: removeTrailingSlash(getOptionalEnv("CHILEXPRESS_SHIPMENT_ENDPOINT")),
  originRegionCode: getOptionalEnv("CHILEXPRESS_ORIGIN_REGION_CODE") || BUSINESS_DEFAULTS.originRegionCode,
  originCommune: getOptionalEnv("CHILEXPRESS_ORIGIN_COMMUNE") || BUSINESS_DEFAULTS.originCommune,
  originCoverageCode: getOptionalEnv("CHILEXPRESS_ORIGIN_COVERAGE_CODE") || null,
  tcc: getOptionalEnv("CHILEXPRESS_TCC"),
  senderRut: getOptionalEnv("CHILEXPRESS_SENDER_RUT"),
};

export function assertChilexpressKey(apiKey: string, keyName: string): void {
  if (!apiKey) {
    throw new Error(`${keyName} is required to call Chilexpress.`);
  }
}

export function assertChilexpressEndpoint(endpoint: string, endpointName: string): void {
  if (!endpoint) {
    throw new Error(
      `${endpointName} is required to call Chilexpress. Set it explicitly (test: testservices.wschilexpress.com, produccion: services.wschilexpress.com) — no hay valor por defecto para evitar llamar a un ambiente inesperado.`,
    );
  }
}

/**
 * RUT sin puntos ni digito verificador, tal como lo exige Chilexpress en
 * produccion (marketplaceRut / sellerRut / rut de tracking). Solo digitos.
 */
export function isValidChilexpressRut(rut: string): boolean {
  return /^\d+$/.test(rut.trim());
}
