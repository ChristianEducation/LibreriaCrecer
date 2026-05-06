import { NextResponse, type NextRequest } from "next/server";

import { getCoverageAreas } from "@/integrations/shipping/chilexpress/client";

function toTitleCase(value: string): string {
  return value
    .toLocaleLowerCase("es-CL")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toLocaleUpperCase("es-CL") + word.slice(1))
    .join(" ");
}

export async function GET(request: NextRequest) {
  const regionCode = request.nextUrl.searchParams.get("regionCode")?.trim();

  if (!regionCode) {
    return NextResponse.json(
      {
        error: "validation_error",
        message: "regionCode is required.",
      },
      { status: 400 },
    );
  }

  try {
    const coverageAreas = await getCoverageAreas(regionCode);
    const data = coverageAreas
      .map((area) => {
        const coverageName = (area as { coverageName?: string }).coverageName;
        const name = coverageName ?? area.countyName;

        if (!name || !area.countyCode) {
          return null;
        }

        return {
          label: toTitleCase(name),
          value: area.countyCode,
          coverageCode: area.countyCode,
        };
      })
      .filter((area): area is { label: string; value: string; coverageCode: string } => area !== null)
      .filter((area) => area.label.toLocaleLowerCase("es-CL") !== "sin cobertura")
      .sort((a, b) => a.label.localeCompare(b.label, "es-CL"));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/shipping/coverage-areas failed", error);
    return NextResponse.json(
      {
        error: "shipping_coverage_unavailable",
        message: "Could not load Chilexpress coverage areas.",
      },
      { status: 500 },
    );
  }
}
