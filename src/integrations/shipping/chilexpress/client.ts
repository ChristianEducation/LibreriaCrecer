import { assertChilexpressKey, chilexpressConfig } from "./config";
import type {
  ChilexpressCoverageArea,
  ChilexpressCoverageRequest,
  ChilexpressRateOption,
  ChilexpressRateRequest,
  ChilexpressShipmentRequest,
  ChilexpressShipmentResponse,
} from "./types";

const REQUEST_TIMEOUT_MS = 15_000;

function normalizeEndpoint(endpoint: string, path: string): string {
  return `${endpoint}${path.startsWith("/") ? path : `/${path}`}`;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function getHeaderName(): string {
  return "Ocp-Apim-Subscription-Key";
}

function normalizeRegionCode(regionCode: string | undefined): string {
  const normalized = normalizeText(regionCode ?? "");
  const regionMap: Record<string, string> = {
    "arica y parinacota": "R15",
    tarapaca: "R1",
    antofagasta: "R2",
    atacama: "R3",
    coquimbo: "R4",
    valparaiso: "R5",
    "metropolitana de santiago": "RM",
    metropolitana: "RM",
    "region metropolitana": "RM",
    "o'higgins": "R6",
    ohiggins: "R6",
    maule: "R7",
    nuble: "R16",
    biobio: "R8",
    "la araucania": "R9",
    "los rios": "R14",
    "los lagos": "R10",
    aysen: "R11",
    "magallanes y la antartica chilena": "R12",
    magallanes: "R12",
    "1": "R1",
    "01": "R1",
    r1: "R1",
    "2": "R2",
    "02": "R2",
    r2: "R2",
    "3": "R3",
    "03": "R3",
    r3: "R3",
    "4": "R4",
    "04": "R4",
    r4: "R4",
    "5": "R5",
    "05": "R5",
    r5: "R5",
    "6": "R6",
    "06": "R6",
    r6: "R6",
    "7": "R7",
    "07": "R7",
    r7: "R7",
    "8": "R8",
    "08": "R8",
    r8: "R8",
    "9": "R9",
    "09": "R9",
    r9: "R9",
    "10": "R10",
    r10: "R10",
    "11": "R11",
    r11: "R11",
    "12": "R12",
    r12: "R12",
    "13": "RM",
    rm: "RM",
    "14": "R14",
    r14: "R14",
    "15": "R15",
    r15: "R15",
    "16": "R16",
    r16: "R16",
  };

  return regionMap[normalized] ?? regionCode?.trim() ?? "R2";
}

async function requestChilexpress<TResponse>({
  apiKey,
  endpoint,
  path,
  method,
  body,
}: {
  apiKey: string;
  endpoint: string;
  path: string;
  method: "GET" | "POST";
  body?: Record<string, unknown>;
}): Promise<TResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const url = normalizeEndpoint(endpoint, path);

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        [getHeaderName()]: apiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => ({}))) as TResponse & {
      statusDescription?: string;
      message?: string;
    };

    if (!response.ok) {
      const message =
        payload.statusDescription ??
        payload.message ??
        `Chilexpress request failed with status ${response.status}.`;
      throw new Error(message);
    }

    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

function extractCoverageAreas(payload: unknown): ChilexpressCoverageArea[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const data = "data" in payload ? (payload as { data?: unknown }).data : payload;
  const coverageAreas = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as { coverageAreas?: unknown }).coverageAreas)
      ? (data as { coverageAreas: unknown[] }).coverageAreas
      : [];

  return coverageAreas.filter((item): item is ChilexpressCoverageArea => {
    return Boolean(item && typeof item === "object");
  });
}

function extractRateOptions(payload: unknown): ChilexpressRateOption[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const data = "data" in payload ? (payload as { data?: unknown }).data : payload;
  const options = data && typeof data === "object"
    ? (data as { courierServiceOptions?: unknown }).courierServiceOptions
    : undefined;

  if (!Array.isArray(options)) {
    return [];
  }

  return options
    .map((option) => {
      const raw = option as {
        serviceTypeCode?: string | number;
        serviceDescription?: string;
        serviceValue?: string | number;
        deliveryTypeCode?: string;
        conditions?: string;
      };

      return {
        serviceTypeCode: String(raw.serviceTypeCode ?? ""),
        serviceDescription: raw.serviceDescription ?? "",
        serviceValue: Number(raw.serviceValue ?? 0),
        deliveryTypeCode: raw.deliveryTypeCode,
        conditions: raw.conditions,
      };
    })
    .filter((option) => option.serviceTypeCode && Number.isFinite(option.serviceValue));
}

function getStringField(source: Record<string, unknown> | undefined, keys: string[]): string | undefined {
  if (!source) {
    return undefined;
  }

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return undefined;
}

export async function getCoverageAreas(regionCode: string | undefined): Promise<ChilexpressCoverageArea[]> {
  assertChilexpressKey(chilexpressConfig.coverageApiKey, "CHILEXPRESS_COVERAGE_API_KEY");

  const query = new URLSearchParams({
    RegionCode: normalizeRegionCode(regionCode),
    type: "0",
  });

  const payload = await requestChilexpress<unknown>({
    apiKey: chilexpressConfig.coverageApiKey,
    endpoint: chilexpressConfig.coverageEndpoint,
    path: `/coverage-areas?${query.toString()}`,
    method: "GET",
  });

  return extractCoverageAreas(payload);
}

export async function getCoverageCode(params: ChilexpressCoverageRequest): Promise<string | null> {
  const coverageAreas = await getCoverageAreas(params.regionCode);
  const requestedCommune = normalizeText(params.commune);
  const coverage = coverageAreas.find((area) => {
    const coverageName = (area as { coverageName?: string }).coverageName;
    return [area.countyName, coverageName].some((name) => {
      return name ? normalizeText(name) === requestedCommune : false;
    });
  });

  return coverage?.countyCode ?? null;
}

export async function getRates(params: ChilexpressRateRequest): Promise<ChilexpressRateOption[]> {
  assertChilexpressKey(chilexpressConfig.ratingApiKey, "CHILEXPRESS_RATING_API_KEY");

  const payload = await requestChilexpress<unknown>({
    apiKey: chilexpressConfig.ratingApiKey,
    endpoint: chilexpressConfig.ratingEndpoint,
    path: "/rates/business",
    method: "POST",
    body: {
      originCountyCode: params.originCoverageCode,
      destinationCountyCode: params.destinationCoverageCode,
      package: {
        weight: params.package.weightKg,
        height: params.package.heightCm,
        width: params.package.widthCm,
        length: params.package.lengthCm,
      },
      productType: params.productType ?? 3,
      contentType: params.contentType ?? 1,
      declaredWorth: params.declaredWorth ?? 1000,
    },
  });

  return extractRateOptions(payload);
}

export async function createShipment(
  params: ChilexpressShipmentRequest,
): Promise<ChilexpressShipmentResponse> {
  assertChilexpressKey(chilexpressConfig.shipmentApiKey, "CHILEXPRESS_SHIPMENT_API_KEY");

  const payload = await requestChilexpress<unknown>({
    apiKey: chilexpressConfig.shipmentApiKey,
    endpoint: chilexpressConfig.shipmentEndpoint,
    path: "/transport-orders",
    method: "POST",
    body: {
      reference: params.orderNumber,
      serviceTypeCode: params.serviceTypeCode,
      originCountyCode: params.originCoverageCode,
      destinationCountyCode: params.destinationCoverageCode,
      package: {
        weight: params.package.weightKg,
        height: params.package.heightCm,
        width: params.package.widthCm,
        length: params.package.lengthCm,
      },
      recipient: params.recipient,
      address: params.address,
    },
  });

  const data = payload && typeof payload === "object" && "data" in payload
    ? (payload as { data?: Record<string, unknown> }).data
    : undefined;
  const labelValue = getStringField(data, ["labelUrl", "labelPdfUrl", "label", "labelBase64"]);
  const labelUrl = labelValue && labelValue.startsWith("JVBER")
    ? `data:application/pdf;base64,${labelValue}`
    : labelValue;

  return {
    transportOrderNumber: getStringField(data, ["transportOrderNumber", "transportOrder", "ot", "trackingNumber"]),
    reference: getStringField(data, ["reference"]) ?? params.orderNumber,
    labelUrl,
    raw: payload,
  };
}
