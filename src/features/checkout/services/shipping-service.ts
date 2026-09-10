import { and, asc, eq, gte } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { shippingConfig, shippingPackages } from "@/integrations/drizzle/schema";
import { chilexpressConfig } from "@/integrations/shipping/chilexpress/config";
import { getCoverageCode, getRates } from "@/integrations/shipping/chilexpress/client";
import type { ChilexpressPackage, ChilexpressRateOption } from "@/integrations/shipping/chilexpress/types";

export type ShippingConfigRow = {
  originRegion: string;
  originCommune: string;
  originCoverageCode: string | null;
  originStreet: string | null;
  originStreetNumber: string | null;
  originSupplement: string | null;
  senderName: string | null;
  senderPhone: string | null;
  senderEmail: string | null;
  estimatedBookWeightGrams: number;
  serviceTypeCode: string | null;
  productType: number;
  contentType: number;
  declaredWorth: number;
};

const DEFAULT_CONFIG: ShippingConfigRow = {
  originRegion: "Antofagasta",
  originCommune: chilexpressConfig.originCommune,
  originCoverageCode: chilexpressConfig.originCoverageCode,
  originStreet: null,
  originStreetNumber: null,
  originSupplement: null,
  senderName: null,
  senderPhone: null,
  senderEmail: null,
  estimatedBookWeightGrams: 300,
  serviceTypeCode: null,
  productType: 3,
  contentType: 1,
  declaredWorth: 1000,
};

/**
 * Unica fuente de lectura de shipping_config. La usan tanto la cotizacion
 * publica como el admin de envios — no duplicar esta query en otro lado.
 */
export async function getActiveShippingConfig(): Promise<ShippingConfigRow> {
  const [config] = await db
    .select()
    .from(shippingConfig)
    .where(eq(shippingConfig.provider, "chilexpress"))
    .orderBy(asc(shippingConfig.createdAt))
    .limit(1);

  return config ?? DEFAULT_CONFIG;
}

export type ResolvedPackage = ChilexpressPackage & {
  packageId: string | null;
  weightGrams: number;
};

export type ShippingPackageCandidate = {
  id: string;
  maxWeightGrams: number;
  packageWeightGrams: number;
  dimensions: { heightCm: number; widthCm: number; lengthCm: number };
};

/**
 * Logica pura de seleccion de empaque — sin BD, testeable directo. `rows` se
 * asume ya filtrado por `maxItems >= quantity` (lo hace la query en
 * resolveOrderPackage). Elige el primero con `maxWeightGrams` suficiente
 * para el peso total; si ninguno alcanza, o `rows` esta vacio, devuelve
 * `null` — NUNCA "el primero aunque no alcance" ni una caja inventada.
 */
export function selectCompatiblePackage(
  rows: ShippingPackageCandidate[],
  quantity: number,
  estimatedBookWeightGrams: number,
): ResolvedPackage | null {
  const totalProductWeightGrams = quantity * estimatedBookWeightGrams;
  const selected = rows.find((row) => row.maxWeightGrams >= totalProductWeightGrams + row.packageWeightGrams);

  if (!selected) {
    return null;
  }

  const weightGrams = totalProductWeightGrams + selected.packageWeightGrams;

  return {
    packageId: selected.id,
    weightGrams,
    weightKg: Math.max(0.1, Math.round((weightGrams / 1000) * 100) / 100),
    heightCm: selected.dimensions.heightCm,
    widthCm: selected.dimensions.widthCm,
    lengthCm: selected.dimensions.lengthCm,
  };
}

/**
 * Unica fuente de verdad para resolver el paquete (peso/dimensiones) de un
 * carrito/pedido, a partir de shipping_packages + estimatedBookWeightGrams.
 * La usan: cotizacion del checkout, creacion de orden y, via snapshot
 * guardado en la orden, la generacion de OT — nunca recalcular por separado.
 *
 * Resolucion ESTRICTA (ver selectCompatiblePackage): si no existe un
 * empaque activo compatible por cantidad Y peso, devuelve `null`. El
 * llamador debe convertir eso en un error controlado.
 */
export async function resolveOrderPackage(totalQuantity: number): Promise<ResolvedPackage | null> {
  const quantity = Math.max(1, Math.trunc(totalQuantity));
  const config = await getActiveShippingConfig();

  const rows = await db
    .select()
    .from(shippingPackages)
    .where(and(eq(shippingPackages.isActive, true), gte(shippingPackages.maxItems, quantity)))
    .orderBy(asc(shippingPackages.maxWeightGrams), asc(shippingPackages.maxItems));

  return selectCompatiblePackage(rows, quantity, config.estimatedBookWeightGrams);
}

export type CalculateShippingCostInput = {
  destination: {
    commune: string;
    regionCode?: string;
    destinationCoverageCode?: string;
  };
  /** Cantidad total de items del carrito/pedido. El frontend nunca manda peso/dimensiones. */
  quantity: number;
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
        package: ResolvedPackage;
      };
    }
  | {
      success: false;
      code: "missing_coverage" | "rates_unavailable" | "shipping_unavailable" | "no_compatible_package";
      message: string;
    };

function selectLowestEffectiveRate(rates: ChilexpressRateOption[]): ChilexpressRateOption | null {
  return rates.reduce<ChilexpressRateOption | null>((selected, rate) => {
    if (!selected || rate.effectiveValue < selected.effectiveValue) {
      return rate;
    }

    return selected;
  }, null);
}

export async function calculateShippingCost(
  input: CalculateShippingCostInput,
): Promise<CalculateShippingCostResult> {
  try {
    const config = await getActiveShippingConfig();

    const originCoverageCode =
      chilexpressConfig.originCoverageCode ??
      config.originCoverageCode ??
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

    const destinationCoverageCode =
      input.destination.destinationCoverageCode ??
      (await getCoverageCode({
        regionCode: input.destination.regionCode,
        commune: input.destination.commune,
      }));

    if (!destinationCoverageCode) {
      return {
        success: false,
        code: "missing_coverage",
        message: "Could not resolve Chilexpress destination coverage code.",
      };
    }

    const resolvedPackage = await resolveOrderPackage(input.quantity);

    if (!resolvedPackage) {
      return {
        success: false,
        code: "no_compatible_package",
        message: "No hay un empaque configurado en /admin/envios que pueda contener este pedido.",
      };
    }

    const rates = await getRates({
      originCoverageCode,
      destinationCoverageCode,
      package: resolvedPackage,
      productType: config.productType,
      contentType: config.contentType,
      declaredWorth: input.declaredWorth,
    });

    const selectedRate = selectLowestEffectiveRate(rates);

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
        cost: Math.round(selectedRate.effectiveValue),
        currency: "CLP",
        originCoverageCode,
        destinationCoverageCode,
        selectedRate,
        rates,
        package: resolvedPackage,
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
