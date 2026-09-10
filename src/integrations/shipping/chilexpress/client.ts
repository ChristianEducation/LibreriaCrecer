import { assertChilexpressEndpoint, assertChilexpressKey, chilexpressConfig, isValidChilexpressRut } from "./config";
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
    .replace(/[̀-ͯ]/g, "")
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

/**
 * `serviceValueDiscount` es el valor final del servicio segun rest-rating-api.json
 * (solo lo devuelve /rates/business). Si no viene o no es un numero valido, cae a
 * `serviceValue`. `effectiveValue` es lo unico que debe leer el resto del sistema.
 */
export function normalizeRateOption(raw: unknown): ChilexpressRateOption | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const option = raw as {
    serviceTypeCode?: string | number;
    serviceDescription?: string;
    serviceValue?: string | number;
    serviceValueDiscount?: string | number | null;
    deliveryType?: number;
    conditions?: string;
  };

  const serviceTypeCode = String(option.serviceTypeCode ?? "").trim();
  const serviceValue = Number(option.serviceValue);

  if (!serviceTypeCode || !Number.isFinite(serviceValue)) {
    return null;
  }

  const parsedDiscount =
    option.serviceValueDiscount !== undefined && option.serviceValueDiscount !== null
      ? Number(option.serviceValueDiscount)
      : NaN;
  const serviceValueDiscount = Number.isFinite(parsedDiscount) && parsedDiscount > 0 ? parsedDiscount : null;

  return {
    serviceTypeCode,
    serviceDescription: option.serviceDescription ?? "",
    serviceValue,
    serviceValueDiscount,
    effectiveValue: serviceValueDiscount ?? serviceValue,
    deliveryType: option.deliveryType,
    conditions: option.conditions,
  };
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
    .map((option) => normalizeRateOption(option))
    .filter((option): option is ChilexpressRateOption => option !== null);
}

/**
 * Detecta el mime type real de `label.labelData` (base64) por su contenido,
 * en vez de asumir un formato fijo. La usa tambien label-storage.ts para
 * decidir la extension del archivo que se sube a Supabase Storage.
 */
export function detectLabelMimeType(base64Data: string): string {
  if (base64Data.startsWith("/9j/")) return "image/jpeg";
  if (base64Data.startsWith("iVBOR")) return "image/png";
  if (base64Data.startsWith("JVBER")) return "application/pdf";
  return "application/octet-stream";
}

type RawTransportOrderDetail = {
  transportOrderNumber?: number | string;
  reference?: string;
  serviceDescription?: string;
  label?: { labelData?: string; labelType?: string } | null;
};

/**
 * No asume que `transportOrderNumber` es siempre string: la API a veces lo
 * entrega numerico. `labelData` se devuelve crudo (base64) — el llamador
 * decide si lo sube a Storage; este cliente no arma data URIs ni persiste
 * nada (integrations/shipping/chilexpress/label-storage.ts se encarga de eso).
 */
export function parseTransportOrderResponse(payload: unknown): ChilexpressShipmentResponse {
  const data =
    payload && typeof payload === "object" && "data" in payload
      ? (payload as { data?: unknown }).data
      : undefined;

  const detailRaw = data && typeof data === "object" ? (data as { detail?: unknown }).detail : undefined;
  const details = Array.isArray(detailRaw) ? detailRaw : detailRaw ? [detailRaw] : [];
  const first = details[0] as RawTransportOrderDetail | undefined;

  if (!first) {
    return { transportOrderNumber: null, reference: null, serviceDescription: null, labelData: null, labelMimeType: null, raw: payload };
  }

  const rawLabelData = first.label?.labelData?.trim();
  // labelType=2 siempre entrega base64 binario. Si llegara una URL (caso no
  // documentado para este labelType), no se puede decodificar como base64:
  // se descarta para no subir basura a Storage.
  const labelData = rawLabelData && rawLabelData.length > 0 && !/^https?:\/\//i.test(rawLabelData) ? rawLabelData : null;

  return {
    transportOrderNumber:
      first.transportOrderNumber !== undefined && first.transportOrderNumber !== null
        ? String(first.transportOrderNumber)
        : null,
    reference: first.reference ?? null,
    serviceDescription: first.serviceDescription ?? null,
    labelData,
    labelMimeType: labelData ? detectLabelMimeType(labelData) : null,
    raw: payload,
  };
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
  assertChilexpressEndpoint(chilexpressConfig.coverageEndpoint, "CHILEXPRESS_COVERAGE_ENDPOINT");

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
    return [area.countyName, area.coverageName].some((name) => {
      return name ? normalizeText(name) === requestedCommune : false;
    });
  });

  return coverage?.countyCode ?? null;
}

export async function getRates(params: ChilexpressRateRequest): Promise<ChilexpressRateOption[]> {
  assertChilexpressKey(chilexpressConfig.ratingApiKey, "CHILEXPRESS_RATING_API_KEY");
  assertChilexpressEndpoint(chilexpressConfig.ratingEndpoint, "CHILEXPRESS_RATING_ENDPOINT");

  const payload = await requestChilexpress<unknown>({
    apiKey: chilexpressConfig.ratingApiKey,
    endpoint: chilexpressConfig.ratingEndpoint,
    path: "/rates/business",
    method: "POST",
    // DefinitionRequestBusiness (rest-rating-api.json) tipa package/declaredWorth
    // como string, no numeric — se respeta el contrato tal cual, no lo que
    // "parece razonable".
    body: {
      originCountyCode: params.originCoverageCode,
      destinationCountyCode: params.destinationCoverageCode,
      package: {
        weight: String(params.package.weightKg),
        height: String(params.package.heightCm),
        width: String(params.package.widthCm),
        length: String(params.package.lengthCm),
      },
      productType: params.productType ?? 3,
      contentType: params.contentType ?? 1,
      declaredWorth: String(params.declaredWorth ?? 1000),
      deliveryTime: params.deliveryTime ?? 0,
      // TCC: cuenta empresa de Crecer. Nunca lo manda el frontend.
      customerCardNumber: params.customerCardNumber ?? chilexpressConfig.tcc,
    },
  });

  return extractRateOptions(payload);
}

/**
 * Arma el body oficial de /transport-orders (header + details[].addresses/contacts/packages)
 * segun rest-transport-orders-api.json. Exportado como funcion pura para poder testearlo
 * sin llamar a la red.
 */
export function buildTransportOrderPayload(params: {
  request: ChilexpressShipmentRequest;
  customerCardNumber: string;
  marketplaceRut: string;
  sellerRut: string;
  productType: number;
  declaredContent: number;
}) {
  const { request, customerCardNumber, marketplaceRut, sellerRut, productType, declaredContent } = params;

  return {
    header: {
      certificateNumber: 0,
      customerCardNumber,
      countyOfOriginCoverageCode: request.originCoverageCode,
      labelType: request.labelType,
      marketplaceRut,
      sellerRut,
    },
    details: [
      {
        addresses: [
          {
            addressId: 0,
            countyCoverageCode: request.destinationCoverageCode,
            streetName: request.address.street,
            streetNumber: request.address.number,
            supplement: request.address.apartment ?? "",
            addressType: "DEST",
            deliveryOnCommercialOffice: false,
            observation: request.address.observation ?? "",
          },
          {
            addressId: 0,
            countyCoverageCode: request.originCoverageCode,
            streetName: request.sender.street,
            streetNumber: request.sender.number,
            supplement: request.sender.apartment ?? "",
            addressType: "DEV",
            deliveryOnCommercialOffice: false,
            observation: "",
          },
        ],
        contacts: [
          {
            name: request.sender.name,
            phoneNumber: request.sender.phone,
            mail: request.sender.email,
            contactType: "R",
          },
          {
            name: request.recipient.name,
            phoneNumber: request.recipient.phone,
            mail: request.recipient.email,
            contactType: "D",
          },
        ],
        // Package (rest-transport-orders-api.json) tipa weight/height/width/length,
        // serviceDeliveryCode, productCode, declaredValue y declaredContent como
        // string — se respeta el contrato tal cual.
        packages: [
          {
            weight: String(request.package.weightKg),
            height: String(request.package.heightCm),
            width: String(request.package.widthCm),
            length: String(request.package.lengthCm),
            serviceDeliveryCode: request.serviceTypeCode,
            productCode: String(productType),
            deliveryReference: request.orderNumber,
            groupReference: request.orderNumber,
            declaredValue: String(request.declaredWorth),
            declaredContent: String(declaredContent),
          },
        ],
      },
    ],
  };
}

export async function createShipment(
  request: ChilexpressShipmentRequest,
  options: { productType: number; declaredContent: number },
): Promise<ChilexpressShipmentResponse> {
  assertChilexpressKey(chilexpressConfig.shipmentApiKey, "CHILEXPRESS_SHIPMENT_API_KEY");
  assertChilexpressEndpoint(chilexpressConfig.shipmentEndpoint, "CHILEXPRESS_SHIPMENT_ENDPOINT");
  assertChilexpressKey(chilexpressConfig.tcc, "CHILEXPRESS_TCC");
  assertChilexpressKey(chilexpressConfig.senderRut, "CHILEXPRESS_SENDER_RUT");

  if (!isValidChilexpressRut(chilexpressConfig.senderRut)) {
    throw new Error(
      "CHILEXPRESS_SENDER_RUT invalido: debe ir sin puntos ni digito verificador (solo digitos), tal como lo exige Chilexpress en produccion.",
    );
  }

  const body = buildTransportOrderPayload({
    request,
    customerCardNumber: chilexpressConfig.tcc,
    marketplaceRut: chilexpressConfig.senderRut,
    sellerRut: chilexpressConfig.senderRut,
    productType: options.productType,
    declaredContent: options.declaredContent,
  });

  const payload = await requestChilexpress<unknown>({
    apiKey: chilexpressConfig.shipmentApiKey,
    endpoint: chilexpressConfig.shipmentEndpoint,
    path: "/transport-orders",
    method: "POST",
    body,
  });

  return parseTransportOrderResponse(payload);
}

/**
 * Body de POST /transport-orders-labels (TransportOrderLabelRequest). A
 * diferencia del body de creacion de OT, `transportOrderNumber` va como
 * `number` (no string) segun el schema oficial. Es deliberadamente un
 * objeto plano sin `header`/`details` — no tiene la forma de una creacion
 * de OT, porque no lo es.
 */
export function buildLabelReprintRequest(
  transportOrderNumber: string,
  labelType: 0 | 1 | 2,
): { transportOrderNumber: number; labelType: 0 | 1 | 2 } {
  const parsedOtNumber = Number(transportOrderNumber);

  if (!Number.isFinite(parsedOtNumber)) {
    throw new Error(`transportOrderNumber invalido: "${transportOrderNumber}" no es un numero.`);
  }

  return { transportOrderNumber: parsedOtNumber, labelType };
}

/**
 * Reimpresion/recuperacion de etiqueta para una OT YA EXISTENTE
 * (POST /transport-orders-labels, operationId GenerateLabelForTO). Nunca
 * crea una OT nueva — eso solo lo hace createShipment(). La respuesta tiene
 * exactamente la misma forma que la de creacion, por eso reutiliza
 * parseTransportOrderResponse().
 */
export async function reprintLabel(
  transportOrderNumber: string,
  labelType: 0 | 1 | 2,
): Promise<ChilexpressShipmentResponse> {
  assertChilexpressKey(chilexpressConfig.shipmentApiKey, "CHILEXPRESS_SHIPMENT_API_KEY");
  assertChilexpressEndpoint(chilexpressConfig.shipmentEndpoint, "CHILEXPRESS_SHIPMENT_ENDPOINT");

  const body = buildLabelReprintRequest(transportOrderNumber, labelType);

  const payload = await requestChilexpress<unknown>({
    apiKey: chilexpressConfig.shipmentApiKey,
    endpoint: chilexpressConfig.shipmentEndpoint,
    path: "/transport-orders-labels",
    method: "POST",
    body,
  });

  return parseTransportOrderResponse(payload);
}

// Mantenido por si en el futuro se necesita leer campos crudos de una respuesta
// no estandar sin pasar por el parser tipado.
export function getRawStringField(source: Record<string, unknown> | undefined, keys: string[]): string | undefined {
  return getStringField(source, keys);
}
