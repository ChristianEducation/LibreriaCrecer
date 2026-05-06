import { and, asc, eq, gte } from "drizzle-orm";

import { getCoverageCode, getRates, createShipment } from "@/integrations/shipping/chilexpress/client";
import { chilexpressConfig } from "@/integrations/shipping/chilexpress/config";
import { db } from "@/integrations/drizzle";
import {
  orderAddresses,
  orderCustomers,
  orderItems,
  orders,
  shippingConfig,
  shippingPackages,
} from "@/integrations/drizzle/schema";
import type { ChilexpressPackage } from "@/integrations/shipping/chilexpress/types";

type ShippingPackageInput = {
  name: string;
  maxWeightGrams: number;
  packageWeightGrams: number;
  heightCm: number;
  widthCm: number;
  lengthCm: number;
  maxItems: number;
  isDefault?: boolean;
  isActive?: boolean;
};

type ShippingConfigInput = {
  originRegion: string;
  originCommune: string;
  originCoverageCode?: string | null;
  estimatedBookWeightGrams: number;
  serviceTypeCode?: string | null;
  declaredWorth: number;
};

const DEFAULT_CONFIG = {
  provider: "chilexpress",
  originRegion: "Antofagasta",
  originCommune: chilexpressConfig.originCommune,
  originCoverageCode: chilexpressConfig.originCoverageCode,
  estimatedBookWeightGrams: 300,
  serviceTypeCode: null,
  declaredWorth: 1000,
};

function mapPackage(row: typeof shippingPackages.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    maxWeightGrams: row.maxWeightGrams,
    packageWeightGrams: row.packageWeightGrams,
    heightCm: row.dimensions.heightCm,
    widthCm: row.dimensions.widthCm,
    lengthCm: row.dimensions.lengthCm,
    maxItems: row.maxItems,
    isDefault: row.isDefault,
    isActive: row.isActive,
  };
}

export async function getShippingConfigAdmin() {
  const [config] = await db
    .select()
    .from(shippingConfig)
    .where(eq(shippingConfig.provider, "chilexpress"))
    .orderBy(asc(shippingConfig.createdAt))
    .limit(1);

  return config ?? DEFAULT_CONFIG;
}

export async function updateShippingConfigAdmin(input: ShippingConfigInput) {
  const [existing] = await db
    .select({ id: shippingConfig.id })
    .from(shippingConfig)
    .where(eq(shippingConfig.provider, "chilexpress"))
    .limit(1);

  const values = {
    provider: "chilexpress",
    originRegion: input.originRegion,
    originCommune: input.originCommune,
    originCoverageCode: input.originCoverageCode || null,
    estimatedBookWeightGrams: input.estimatedBookWeightGrams,
    serviceTypeCode: input.serviceTypeCode || null,
    declaredWorth: input.declaredWorth,
    isActive: true,
    updatedAt: new Date(),
  };

  if (!existing) {
    const [created] = await db.insert(shippingConfig).values(values).returning();
    return created;
  }

  const [updated] = await db
    .update(shippingConfig)
    .set(values)
    .where(eq(shippingConfig.id, existing.id))
    .returning();

  return updated;
}

export async function getShippingPackagesAdmin() {
  const rows = await db
    .select()
    .from(shippingPackages)
    .orderBy(asc(shippingPackages.isActive), asc(shippingPackages.name));

  return rows.map(mapPackage);
}

export async function createShippingPackageAdmin(input: ShippingPackageInput) {
  const [created] = await db
    .insert(shippingPackages)
    .values({
      name: input.name,
      dimensions: {
        weightKg: input.maxWeightGrams / 1000,
        heightCm: input.heightCm,
        widthCm: input.widthCm,
        lengthCm: input.lengthCm,
      },
      maxWeightGrams: input.maxWeightGrams,
      packageWeightGrams: input.packageWeightGrams,
      maxItems: input.maxItems,
      isDefault: input.isDefault ?? false,
      isActive: input.isActive ?? true,
    })
    .returning();

  return mapPackage(created);
}

export async function updateShippingPackageAdmin(id: string, input: Partial<ShippingPackageInput>) {
  const [current] = await db
    .select()
    .from(shippingPackages)
    .where(eq(shippingPackages.id, id))
    .limit(1);

  if (!current) {
    return null;
  }

  const maxWeightGrams = input.maxWeightGrams ?? current.maxWeightGrams;
  const heightCm = input.heightCm ?? current.dimensions.heightCm;
  const widthCm = input.widthCm ?? current.dimensions.widthCm;
  const lengthCm = input.lengthCm ?? current.dimensions.lengthCm;

  const [updated] = await db
    .update(shippingPackages)
    .set({
      name: input.name ?? current.name,
      dimensions: {
        weightKg: maxWeightGrams / 1000,
        heightCm,
        widthCm,
        lengthCm,
      },
      maxWeightGrams,
      packageWeightGrams: input.packageWeightGrams ?? current.packageWeightGrams,
      maxItems: input.maxItems ?? current.maxItems,
      isDefault: input.isDefault ?? current.isDefault,
      isActive: input.isActive ?? current.isActive,
      updatedAt: new Date(),
    })
    .where(eq(shippingPackages.id, id))
    .returning();

  return mapPackage(updated);
}

export async function deleteShippingPackageAdmin(id: string) {
  const [updated] = await db
    .update(shippingPackages)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(shippingPackages.id, id))
    .returning();

  return updated ? mapPackage(updated) : null;
}

async function findCompatiblePackage(totalQuantity: number, estimatedWeightGrams: number) {
  const totalProductWeight = totalQuantity * estimatedWeightGrams;

  const rows = await db
    .select()
    .from(shippingPackages)
    .where(and(eq(shippingPackages.isActive, true), gte(shippingPackages.maxItems, totalQuantity)))
    .orderBy(asc(shippingPackages.maxWeightGrams), asc(shippingPackages.maxItems));

  return rows.find((row) => row.maxWeightGrams >= totalProductWeight + row.packageWeightGrams) ?? rows[0] ?? null;
}

function toChilexpressPackage(row: typeof shippingPackages.$inferSelect, totalQuantity: number, bookWeightGrams: number): ChilexpressPackage {
  const totalWeightGrams = totalQuantity * bookWeightGrams + row.packageWeightGrams;

  return {
    weightKg: Math.max(1, Math.ceil(totalWeightGrams / 1000)),
    heightCm: row.dimensions.heightCm,
    widthCm: row.dimensions.widthCm,
    lengthCm: row.dimensions.lengthCm,
  };
}

export async function generateChilexpressOtAdmin(orderId: string) {
  const [order] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      deliveryMethod: orders.deliveryMethod,
      chilexpressTransportOrderNumber: orders.chilexpressTransportOrderNumber,
      chilexpressOriginCoverageCode: orders.chilexpressOriginCoverageCode,
      chilexpressDestinationCoverageCode: orders.chilexpressDestinationCoverageCode,
      shippingCost: orders.shippingCost,
      subtotal: orders.subtotal,
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) {
    return { success: false as const, code: "order_not_found", message: "Pedido no encontrado." };
  }

  if (order.deliveryMethod !== "shipping") {
    return { success: false as const, code: "invalid_delivery", message: "Solo pedidos con despacho pueden generar OT." };
  }

  if (order.status !== "paid" && order.status !== "preparing") {
    return { success: false as const, code: "invalid_status", message: "Solo pedidos pagados o en preparación pueden generar OT." };
  }

  if (order.chilexpressTransportOrderNumber) {
    return { success: false as const, code: "already_exists", message: "Este pedido ya tiene OT Chilexpress." };
  }

  const [customer] = await db
    .select({
      firstName: orderCustomers.firstName,
      lastName: orderCustomers.lastName,
      email: orderCustomers.email,
      phone: orderCustomers.phone,
    })
    .from(orderCustomers)
    .where(eq(orderCustomers.orderId, order.id))
    .limit(1);

  const [address] = await db
    .select()
    .from(orderAddresses)
    .where(eq(orderAddresses.orderId, order.id))
    .limit(1);

  if (!customer || !address) {
    return { success: false as const, code: "missing_data", message: "Faltan datos de cliente o dirección." };
  }

  const items = await db
    .select({ quantity: orderItems.quantity })
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const config = await getShippingConfigAdmin();
  const selectedPackage = await findCompatiblePackage(totalQuantity, config.estimatedBookWeightGrams);

  if (!selectedPackage) {
    return { success: false as const, code: "missing_package", message: "No hay empaques activos compatibles." };
  }

  try {
    const originCoverageCode =
      order.chilexpressOriginCoverageCode ??
      config.originCoverageCode ??
      chilexpressConfig.originCoverageCode ??
      (await getCoverageCode({
        commune: config.originCommune,
        regionCode: config.originRegion,
      }));

    if (!originCoverageCode) {
      return { success: false as const, code: "missing_coverage", message: "No se pudo resolver la cobertura de origen." };
    }

    const destinationCoverageCode =
      order.chilexpressDestinationCoverageCode ??
      (await getCoverageCode({
        commune: address.commune,
        regionCode: address.region,
      }));

    if (!destinationCoverageCode) {
      return { success: false as const, code: "missing_coverage", message: "No se pudo resolver la cobertura de destino." };
    }

    const chilexpressPackage = toChilexpressPackage(selectedPackage, totalQuantity, config.estimatedBookWeightGrams);
    const rates = await getRates({
      originCoverageCode,
      destinationCoverageCode,
      package: chilexpressPackage,
      declaredWorth: Math.max(config.declaredWorth, order.subtotal),
    });
    const selectedRate = rates.reduce<(typeof rates)[number] | undefined>((selected, rate) => {
      if (!selected || rate.serviceValue < selected.serviceValue) {
        return rate;
      }

      return selected;
    }, undefined);
    const serviceTypeCode = config.serviceTypeCode ?? selectedRate?.serviceTypeCode;

    if (!serviceTypeCode) {
      return { success: false as const, code: "missing_rate", message: "No hay servicio Chilexpress disponible para este pedido." };
    }

    const shipment = await createShipment({
      orderNumber: order.orderNumber,
      serviceTypeCode,
      originCoverageCode,
      destinationCoverageCode,
      package: chilexpressPackage,
      recipient: {
        name: `${customer.firstName} ${customer.lastName}`.trim(),
        email: customer.email,
        phone: customer.phone,
      },
      address: {
        street: address.street,
        number: address.number,
        apartment: address.apartment,
        commune: address.commune,
        city: address.city,
        region: address.region,
        zipCode: address.zipCode,
        deliveryInstructions: address.deliveryInstructions,
      },
    });

    const transportOrderNumber = shipment.transportOrderNumber ?? shipment.reference;

    if (!transportOrderNumber) {
      return { success: false as const, code: "shipment_failed", message: "Chilexpress no devolvió número de OT." };
    }

    const [updated] = await db
      .update(orders)
      .set({
        chilexpressTransportOrderNumber: transportOrderNumber,
        chilexpressLabelUrl: shipment.labelUrl ?? null,
        chilexpressServiceTypeCode: serviceTypeCode,
        chilexpressServiceDescription: selectedRate?.serviceDescription ?? null,
        chilexpressOriginCoverageCode: originCoverageCode,
        chilexpressDestinationCoverageCode: destinationCoverageCode,
        shippingCost: selectedRate ? Math.round(selectedRate.serviceValue) : order.shippingCost,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id))
      .returning({
        id: orders.id,
        chilexpressTransportOrderNumber: orders.chilexpressTransportOrderNumber,
        chilexpressLabelUrl: orders.chilexpressLabelUrl,
        shippingCost: orders.shippingCost,
      });

    return { success: true as const, data: updated };
  } catch (error) {
    return {
      success: false as const,
      code: "chilexpress_unavailable",
      message: error instanceof Error ? error.message : "Chilexpress no respondió correctamente.",
    };
  }
}
