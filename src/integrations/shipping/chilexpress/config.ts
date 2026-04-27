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

const DEFAULTS = {
  coverageEndpoint: "https://testservices.wschilexpress.com/georeference/api/v1.0",
  ratingEndpoint: "https://testservices.wschilexpress.com/rating/api/v1.0",
  shipmentEndpoint: "https://testservices.wschilexpress.com/transport-orders/api/v1.0",
  originRegionCode: "02",
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
  coverageEndpoint: removeTrailingSlash(
    process.env.CHILEXPRESS_COVERAGE_ENDPOINT ?? DEFAULTS.coverageEndpoint,
  ),
  ratingEndpoint: removeTrailingSlash(
    process.env.CHILEXPRESS_RATING_ENDPOINT ?? DEFAULTS.ratingEndpoint,
  ),
  shipmentEndpoint: removeTrailingSlash(
    process.env.CHILEXPRESS_SHIPMENT_ENDPOINT ?? DEFAULTS.shipmentEndpoint,
  ),
  originRegionCode: process.env.CHILEXPRESS_ORIGIN_REGION_CODE ?? DEFAULTS.originRegionCode,
  originCommune: process.env.CHILEXPRESS_ORIGIN_COMMUNE ?? DEFAULTS.originCommune,
  originCoverageCode: getOptionalEnv("CHILEXPRESS_ORIGIN_COVERAGE_CODE") || null,
  tcc: getOptionalEnv("CHILEXPRESS_TCC"),
  senderRut: getOptionalEnv("CHILEXPRESS_SENDER_RUT"),
};

export function assertChilexpressKey(apiKey: string, keyName: string): void {
  if (!apiKey) {
    throw new Error(`${keyName} is required to call Chilexpress.`);
  }
}
