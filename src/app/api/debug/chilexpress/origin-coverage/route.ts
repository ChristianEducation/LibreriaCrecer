import { NextResponse } from "next/server";

import { assertChilexpressKey, chilexpressConfig } from "@/integrations/shipping/chilexpress/config";

const REGION_CODE = "02";
const COMMUNE = "Antofagasta";
const REQUEST_TIMEOUT_MS = 15_000;
const DEFAULT_COVERAGE_ENDPOINT = "https://qaservices.wschilexpress.com/georeference/v2/api/V1.0";

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

function extractCoverageAreas(payload: unknown): Array<Record<string, unknown>> {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const data = "data" in payload ? (payload as { data?: unknown }).data : payload;
  const coverageAreas = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as { coverageAreas?: unknown }).coverageAreas)
      ? (data as { coverageAreas: unknown[] }).coverageAreas
      : [];

  return coverageAreas.filter((item): item is Record<string, unknown> => {
    return Boolean(item && typeof item === "object" && !Array.isArray(item));
  });
}

function getStringField(source: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

function findMatchingCoverage(payload: unknown) {
  const requestedCommune = normalizeText(COMMUNE);

  return extractCoverageAreas(payload).find((area) => {
    const countyName = getStringField(area, ["countyName", "CountyName", "coverageName", "commune", "name"]);
    return countyName ? normalizeText(countyName) === requestedCommune : false;
  }) ?? null;
}

function getDebugCoverageEndpoint(): string {
  const configuredEndpoint = process.env.CHILEXPRESS_COVERAGE_ENDPOINT?.trim();
  if (configuredEndpoint) {
    return configuredEndpoint.replace(/\/+$/, "");
  }

  return DEFAULT_COVERAGE_ENDPOINT;
}

function toChilexpressRegionCode(regionCode: string): string {
  const numericRegion = Number(regionCode);
  if (Number.isInteger(numericRegion) && numericRegion > 0) {
    return `R${numericRegion}`;
  }

  return regionCode;
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error: "not_found",
        message: "Debug endpoint is only available outside production.",
      },
      { status: 404 },
    );
  }

  try {
    assertChilexpressKey(chilexpressConfig.coverageApiKey, "CHILEXPRESS_COVERAGE_API_KEY");

    const chilexpressRegionCode = toChilexpressRegionCode(REGION_CODE);
    const query = new URLSearchParams({
      RegionCode: chilexpressRegionCode,
      type: "0",
    });
    const path = `/coverage-areas?${query.toString()}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(normalizeEndpoint(getDebugCoverageEndpoint(), path), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": chilexpressConfig.coverageApiKey,
        },
        signal: controller.signal,
        cache: "no-store",
      });

      const rawChilexpressResponse = (await response.json().catch(() => ({}))) as unknown;
      const matchedCoverage = findMatchingCoverage(rawChilexpressResponse);
      const coverageCode = matchedCoverage
        ? getStringField(matchedCoverage, ["countyCode", "CountyCode", "coverageCode", "code"])
        : null;

      return NextResponse.json(
        {
          query: {
            regionCode: REGION_CODE,
            chilexpressRegionCode,
            commune: COMMUNE,
          },
          found: {
            coverageCode,
            matchedCoverage,
          },
          chilexpress: {
            status: response.status,
            ok: response.ok,
            rawResponse: rawChilexpressResponse,
          },
        },
        { status: response.ok ? 200 : 502 },
      );
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("GET /api/debug/chilexpress/origin-coverage failed", error);
    return NextResponse.json(
      {
        error: "chilexpress_debug_failed",
        message: error instanceof Error ? error.message : "Could not resolve Chilexpress origin coverage.",
      },
      { status: 500 },
    );
  }
}
