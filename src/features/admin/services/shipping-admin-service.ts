import { asc, eq } from "drizzle-orm";

import { createShipment, reprintLabel } from "@/integrations/shipping/chilexpress/client";
import { getSignedChilexpressLabelUrl, isLegacyLabelValue, storeChilexpressLabel } from "@/integrations/shipping/chilexpress/label-storage";
import { db } from "@/integrations/drizzle";
import { orderAddresses, orderCustomers, orderItems, orders, shippingConfig, shippingPackages } from "@/integrations/drizzle/schema";
import { calculateShippingCost, getActiveShippingConfig } from "@/features/checkout/services/shipping-service";

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
  originStreet?: string | null;
  originStreetNumber?: string | null;
  originSupplement?: string | null;
  senderName?: string | null;
  senderPhone?: string | null;
  senderEmail?: string | null;
  estimatedBookWeightGrams: number;
  serviceTypeCode?: string | null;
  declaredWorth: number;
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

/** Delega en la unica fuente de verdad de shipping_config (shipping-service.ts). */
export async function getShippingConfigAdmin() {
  return getActiveShippingConfig();
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
    originStreet: input.originStreet || null,
    originStreetNumber: input.originStreetNumber || null,
    originSupplement: input.originSupplement || null,
    senderName: input.senderName || null,
    senderPhone: input.senderPhone || null,
    senderEmail: input.senderEmail || null,
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

export async function generateChilexpressOtAdmin(orderId: string) {
  const [order] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      deliveryMethod: orders.deliveryMethod,
      chilexpressTransportOrderNumber: orders.chilexpressTransportOrderNumber,
      chilexpressServiceTypeCode: orders.chilexpressServiceTypeCode,
      chilexpressServiceDescription: orders.chilexpressServiceDescription,
      chilexpressOriginCoverageCode: orders.chilexpressOriginCoverageCode,
      chilexpressDestinationCoverageCode: orders.chilexpressDestinationCoverageCode,
      chilexpressPackageWeightGrams: orders.chilexpressPackageWeightGrams,
      chilexpressPackageHeightCm: orders.chilexpressPackageHeightCm,
      chilexpressPackageWidthCm: orders.chilexpressPackageWidthCm,
      chilexpressPackageLengthCm: orders.chilexpressPackageLengthCm,
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

  if (order.status !== "paid") {
    return { success: false as const, code: "invalid_status", message: "Solo pedidos pagados pueden generar OT." };
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

  const items = await db.select({ quantity: orderItems.quantity }).from(orderItems).where(eq(orderItems.orderId, order.id));
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const config = await getActiveShippingConfig();

  try {
    let serviceTypeCode = order.chilexpressServiceTypeCode;
    let serviceDescription = order.chilexpressServiceDescription;
    let originCoverageCode = order.chilexpressOriginCoverageCode;
    let destinationCoverageCode = order.chilexpressDestinationCoverageCode;
    let packageWeightKg =
      order.chilexpressPackageWeightGrams !== null
        ? Math.max(0.1, Math.round((order.chilexpressPackageWeightGrams / 1000) * 100) / 100)
        : null;
    let packageHeightCm = order.chilexpressPackageHeightCm;
    let packageWidthCm = order.chilexpressPackageWidthCm;
    let packageLengthCm = order.chilexpressPackageLengthCm;

    const hasCompleteSnapshot =
      serviceTypeCode !== null &&
      originCoverageCode !== null &&
      destinationCoverageCode !== null &&
      packageWeightKg !== null &&
      packageHeightCm !== null &&
      packageWidthCm !== null &&
      packageLengthCm !== null;

    if (!hasCompleteSnapshot) {
      // Pedido creado antes de esta correccion (sin snapshot guardado al
      // pagar): se resuelve una unica vez ahora, con la misma logica que usa
      // el checkout. Para pedidos nuevos esto nunca deberia ejecutarse.
      const quote = await calculateShippingCost({
        destination: { commune: address.commune, regionCode: address.region },
        quantity: totalQuantity,
        declaredWorth: Math.max(config.declaredWorth, order.subtotal),
      });

      if (!quote.success) {
        // Propaga el codigo real (puede ser missing_coverage, rates_unavailable
        // o no_compatible_package) — no se fuerza a un unico codigo generico.
        return { success: false as const, code: quote.code, message: quote.message };
      }

      serviceTypeCode = quote.data.selectedRate.serviceTypeCode;
      serviceDescription = quote.data.selectedRate.serviceDescription;
      originCoverageCode = quote.data.originCoverageCode;
      destinationCoverageCode = quote.data.destinationCoverageCode;
      packageWeightKg = quote.data.package.weightKg;
      packageHeightCm = quote.data.package.heightCm;
      packageWidthCm = quote.data.package.widthCm;
      packageLengthCm = quote.data.package.lengthCm;
    }

    if (!serviceTypeCode || !originCoverageCode || !destinationCoverageCode) {
      return { success: false as const, code: "missing_coverage", message: "Faltan datos de cobertura/servicio para generar la OT." };
    }

    if (!config.senderName || !config.senderPhone || !config.senderEmail || !config.originStreet || !config.originStreetNumber) {
      return {
        success: false as const,
        code: "missing_sender_config",
        message: "Falta completar los datos de remitente y direccion de origen en /admin/envios antes de generar OT.",
      };
    }

    const shipment = await createShipment(
      {
        orderNumber: order.orderNumber,
        serviceTypeCode,
        originCoverageCode,
        destinationCoverageCode,
        package: {
          weightKg: packageWeightKg!,
          heightCm: packageHeightCm!,
          widthCm: packageWidthCm!,
          lengthCm: packageLengthCm!,
        },
        declaredWorth: Math.max(config.declaredWorth, order.subtotal),
        labelType: 2,
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
          observation: address.deliveryInstructions,
        },
        sender: {
          name: config.senderName,
          email: config.senderEmail,
          phone: config.senderPhone,
          street: config.originStreet,
          number: config.originStreetNumber,
          apartment: config.originSupplement,
          commune: config.originCommune,
        },
      },
      { productType: config.productType, declaredContent: config.contentType },
    );

    if (!shipment.transportOrderNumber) {
      return { success: false as const, code: "shipment_failed", message: "Chilexpress no devolvió número de OT." };
    }

    // No se guarda el base64/data URI completo en `orders`: se decodifica y
    // sube al bucket privado, y solo el path queda en chilexpress_label_url.
    let chilexpressLabelUrl: string | null = null;
    if (shipment.labelData) {
      try {
        const stored = await storeChilexpressLabel({
          orderNumber: order.orderNumber,
          transportOrderNumber: shipment.transportOrderNumber,
          labelData: shipment.labelData,
        });
        chilexpressLabelUrl = stored?.path ?? null;
      } catch (error) {
        // La OT ya se genero en Chilexpress y no se puede deshacer: no se
        // bloquea el despacho si falla solo el guardado de la etiqueta. Se
        // guarda sin etiqueta y queda registrado en el log del servidor.
        console.error("No se pudo guardar la etiqueta Chilexpress en Storage", error);
      }
    }

    const [updated] = await db
      .update(orders)
      .set({
        chilexpressTransportOrderNumber: shipment.transportOrderNumber,
        chilexpressLabelUrl,
        chilexpressServiceTypeCode: serviceTypeCode,
        chilexpressServiceDescription: shipment.serviceDescription ?? serviceDescription,
        chilexpressOriginCoverageCode: originCoverageCode,
        chilexpressDestinationCoverageCode: destinationCoverageCode,
        // Generar el ticket es el momento en que el paquete sale de la tienda:
        // el pedido pasa directo a "enviado", sin paso manual intermedio.
        // shippingCost NO se toca aca: es la tarifa que el cliente ya pago.
        status: "shipped",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id))
      .returning({
        id: orders.id,
        status: orders.status,
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

export type ChilexpressLabelAccess = { legacy: boolean; url: string };

/**
 * Resuelve como acceder a la etiqueta de un pedido: pedidos nuevos guardan un
 * path de Storage (se firma una URL temporal), pedidos historicos guardan un
 * data URI/URL completo (se devuelve tal cual, sin firmar). Solo debe
 * llamarse desde una ruta ya protegida por el middleware de admin.
 */
export async function getChilexpressLabelAccess(orderId: string): Promise<ChilexpressLabelAccess | null> {
  const [order] = await db
    .select({ chilexpressLabelUrl: orders.chilexpressLabelUrl })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order?.chilexpressLabelUrl) {
    return null;
  }

  if (isLegacyLabelValue(order.chilexpressLabelUrl)) {
    return { legacy: true, url: order.chilexpressLabelUrl };
  }

  const signedUrl = await getSignedChilexpressLabelUrl(order.chilexpressLabelUrl);
  if (!signedUrl) {
    return null;
  }

  return { legacy: false, url: signedUrl };
}

/**
 * Recupera/reimprime la etiqueta de una OT YA EXISTENTE (POST
 * /transport-orders-labels) y la guarda en el bucket privado. NUNCA crea una
 * OT nueva ni llama a /transport-orders — solo usa reprintLabel(), que pega
 * a un endpoint distinto. No toca shippingCost, serviceTypeCode, coberturas,
 * snapshot del paquete ni status: la OT existente es la unica fuente de
 * verdad, esto solo reobtiene su etiqueta.
 */
export async function reprintChilexpressLabelAdmin(orderId: string) {
  const [order] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      chilexpressTransportOrderNumber: orders.chilexpressTransportOrderNumber,
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) {
    return { success: false as const, code: "order_not_found", message: "Pedido no encontrado." };
  }

  // El numero de OT sale siempre de nuestra BD, nunca de un dato confiado al navegador.
  if (!order.chilexpressTransportOrderNumber) {
    return {
      success: false as const,
      code: "no_transport_order",
      message: "Este pedido todavía no tiene una OT Chilexpress generada.",
    };
  }

  let shipment;
  try {
    shipment = await reprintLabel(order.chilexpressTransportOrderNumber, 2);
  } catch (error) {
    // Info tecnica solo al log del servidor — nunca se expone la API key ni
    // detalles internos al Admin. No se toca la OT ni el pedido.
    console.error("reprintChilexpressLabelAdmin: fallo la reimpresion en Chilexpress", error);
    return {
      success: false as const,
      code: "chilexpress_unavailable",
      message: "Chilexpress no respondió correctamente al solicitar la etiqueta. Puedes intentar nuevamente.",
    };
  }

  if (!shipment.labelData) {
    return {
      success: false as const,
      code: "label_unavailable",
      message: "Chilexpress no devolvió una etiqueta para esta OT.",
    };
  }

  try {
    // Path deterministico por orderNumber/OT + upsert:true en storeChilexpressLabel:
    // reintentar esta operacion siempre sobreescribe el mismo archivo — idempotente.
    const stored = await storeChilexpressLabel({
      orderNumber: order.orderNumber,
      transportOrderNumber: order.chilexpressTransportOrderNumber,
      labelData: shipment.labelData,
    });

    if (!stored) {
      return {
        success: false as const,
        code: "label_unavailable",
        message: "Chilexpress no devolvió una etiqueta válida para esta OT.",
      };
    }

    // Unico campo que se actualiza: la OT existente sigue siendo la fuente
    // de verdad de todo lo demas (servicio, coberturas, paquete, estado).
    const [updated] = await db
      .update(orders)
      .set({ chilexpressLabelUrl: stored.path, updatedAt: new Date() })
      .where(eq(orders.id, order.id))
      .returning({ id: orders.id, chilexpressLabelUrl: orders.chilexpressLabelUrl });

    return { success: true as const, data: updated };
  } catch (error) {
    console.error("reprintChilexpressLabelAdmin: fallo el guardado en Storage", error);
    return {
      success: false as const,
      code: "storage_failed",
      message: "Se obtuvo la etiqueta pero no se pudo guardar. Puedes intentar nuevamente.",
    };
  }
}
