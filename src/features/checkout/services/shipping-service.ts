import { chilexpressConfig } from "@/integrations/shipping/chilexpress/config";
import { getCoverageCode, getRates } from "@/integrations/shipping/chilexpress/client";
import type { ChilexpressPackage, ChilexpressRateOption } from "@/integrations/shipping/chilexpress/types";

export type CalculateShippingCostInput = {
  destination: {
    commune: string;
    regionCode?: string;
  };
  package?: ChilexpressPackage;
  declaredWorth?: number;
};

export type CalculateShippingCostResult =
  | {
      success: true;
      data: {
        cost: number;
        currency: "CLP";
        originCoverageCode: string;
        destinationCoverageCode: string;
        selectedRate: ChilexpressRateOption;
        rates: ChilexpressRateOption[];
      };
    }
  | {
      success: false;
      code: "missing_coverage" | "rates_unavailable" | "shipping_unavailable";
      message: string;
    };

const DEFAULT_PACKAGE: ChilexpressPackage = {
  weightKg: 1,
  heightCm: 8,
  widthCm: 20,
  lengthCm: 28,
};

function selectLowestRate(rates: ChilexpressRateOption[]): ChilexpressRateOption | null {
  return rates.reduce<ChilexpressRateOption | null>((selected, rate) => {
    if (!selected || rate.serviceValue < selected.serviceValue) {
      return rate;
    }

    return selected;
  }, null);
}

export async function calculateShippingCost(
  input: CalculateShippingCostInput,
): Promise<CalculateShippingCostResult> {
  try {
    const originCoverageCode =
      chilexpressConfig.originCoverageCode ??
      (await getCoverageCode({
        regionCode: chilexpressConfig.originRegionCode,
        commune: chilexpressConfig.originCommune,
      }));

    if (!originCoverageCode) {
      return {
        success: false,
        code: "missing_coverage",
        message: "Could not resolve Chilexpress origin coverage code.",
      };
    }

    const destinationCoverageCode = await getCoverageCode({
      regionCode: input.destination.regionCode,
      commune: input.destination.commune,
    });

    if (!destinationCoverageCode) {
      return {
        success: false,
        code: "missing_coverage",
        message: "Could not resolve Chilexpress destination coverage code.",
      };
    }

    const rates = await getRates({
      originCoverageCode,
      destinationCoverageCode,
      package: input.package ?? DEFAULT_PACKAGE,
      declaredWorth: input.declaredWorth,
    });

    const selectedRate = selectLowestRate(rates);

    if (!selectedRate) {
      return {
        success: false,
        code: "rates_unavailable",
        message: "Chilexpress returned no available rates for this destination.",
      };
    }

    return {
      success: true,
      data: {
        cost: Math.round(selectedRate.serviceValue),
        currency: "CLP",
        originCoverageCode,
        destinationCoverageCode,
        selectedRate,
        rates,
      },
    };
  } catch (error) {
    return {
      success: false,
      code: "shipping_unavailable",
      message: error instanceof Error ? error.message : "Could not calculate Chilexpress shipping cost.",
    };
  }
}
