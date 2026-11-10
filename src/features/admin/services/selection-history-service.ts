import { and, asc, desc, eq, inArray } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import {
  featuredProducts,
  landingSectionCopy,
  products,
  selectionSnapshots,
  type SelectionSnapshotItem,
} from "@/integrations/drizzle/schema";
import { MONTHLY_SELECTION_SECTION, MONTHLY_SELECTION_SECTION_ALIASES } from "@/shared/config/landing";

import type {
  CreateSelectionSnapshotInput,
  UpdateSelectionSnapshotInput,
} from "../schemas/selection-schemas";

// Historial y borradores de "Selección Crecer".
// La selección vigente sigue siendo `featured_products` (monthly_selection) + el texto de
// `landing_section_copy` (libros_mes). Aquí solo se guardan copias: nada de esto lo lee la tienda.

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DbExecutor = typeof db | DbTransaction;

export type SelectionServiceResult<T> =
  | { success: true; data: T }
  | { success: false; code: string; message: string };

const COPY_SECTION_KEY = "libros_mes" as const;
const SECTION_ALIASES = [...MONTHLY_SELECTION_SECTION_ALIASES];

function fail(code: string, message: string): { success: false; code: string; message: string } {
  return { success: false, code, message };
}

function cleanText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function dedupeItems(items: SelectionSnapshotItem[]): SelectionSnapshotItem[] {
  const seen = new Set<string>();
  const result: SelectionSnapshotItem[] = [];
  for (const item of items) {
    if (seen.has(item.productId)) continue;
    seen.add(item.productId);
    result.push({ productId: item.productId, description: cleanText(item.description) });
  }
  return result;
}

type SelectionContent = {
  title: string | null;
  body: string | null;
  items: SelectionSnapshotItem[];
};

function sameContent(a: SelectionContent, b: SelectionContent): boolean {
  if (cleanText(a.title) !== cleanText(b.title)) return false;
  if (cleanText(a.body) !== cleanText(b.body)) return false;
  if (a.items.length !== b.items.length) return false;
  return a.items.every(
    (item, index) =>
      item.productId === b.items[index].productId &&
      cleanText(item.description) === cleanText(b.items[index].description),
  );
}

/** La selección que la tienda muestra hoy: texto del bloque + productos activos en su orden. */
async function readCurrentSelection(executor: DbExecutor): Promise<SelectionContent> {
  const [copy] = await executor
    .select({ title: landingSectionCopy.title, body: landingSectionCopy.body })
    .from(landingSectionCopy)
    .where(eq(landingSectionCopy.sectionKey, COPY_SECTION_KEY))
    .limit(1);

  const rows = await executor
    .select({ productId: featuredProducts.productId, description: featuredProducts.description })
    .from(featuredProducts)
    .where(and(inArray(featuredProducts.section, SECTION_ALIASES), eq(featuredProducts.isActive, true)))
    .orderBy(asc(featuredProducts.displayOrder), asc(featuredProducts.createdAt));

  return {
    title: cleanText(copy?.title),
    body: cleanText(copy?.body),
    items: dedupeItems(rows.map((row) => ({ productId: row.productId, description: row.description }))),
  };
}

export type SelectionSnapshotSummary = {
  id: string;
  status: "draft" | "archived";
  periodLabel: string | null;
  title: string | null;
  itemCount: number;
  /** Libros que hoy siguen activos y con stock. */
  availableCount: number;
  covers: string[];
  autoSaved: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function listSelectionSnapshots(): Promise<{
  drafts: SelectionSnapshotSummary[];
  archived: SelectionSnapshotSummary[];
}> {
  const rows = await db.select().from(selectionSnapshots).orderBy(desc(selectionSnapshots.updatedAt));

  const productIds = [...new Set(rows.flatMap((row) => row.items.map((item) => item.productId)))];
  const productRows = productIds.length
    ? await db
        .select({
          id: products.id,
          isActive: products.isActive,
          inStock: products.inStock,
          mainImageUrl: products.mainImageUrl,
        })
        .from(products)
        .where(inArray(products.id, productIds))
    : [];
  const productById = new Map(productRows.map((row) => [row.id, row]));

  const summaries = rows.map((row): SelectionSnapshotSummary => {
    const resolved = row.items.map((item) => productById.get(item.productId));
    return {
      id: row.id,
      status: row.status,
      periodLabel: row.periodLabel,
      title: row.title,
      itemCount: row.items.length,
      availableCount: resolved.filter((product) => product?.isActive && product.inStock).length,
      covers: resolved
        .map((product) => product?.mainImageUrl ?? null)
        .filter((url): url is string => Boolean(url))
        .slice(0, 4),
      autoSaved: row.autoSaved,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  });

  return {
    drafts: summaries.filter((summary) => summary.status === "draft"),
    archived: summaries.filter((summary) => summary.status === "archived"),
  };
}

export type SelectionSnapshotDetailItem = {
  productId: string;
  description: string | null;
  title: string | null;
  author: string | null;
  imageUrl: string | null;
  price: number | null;
  salePrice: number | null;
  isActive: boolean;
  inStock: boolean;
  /** El producto ya no existe en el catálogo. */
  missing: boolean;
};

export type SelectionSnapshotDetail = {
  id: string;
  status: "draft" | "archived";
  periodLabel: string | null;
  title: string | null;
  body: string | null;
  autoSaved: boolean;
  createdAt: Date;
  updatedAt: Date;
  items: SelectionSnapshotDetailItem[];
};

export async function getSelectionSnapshot(id: string): Promise<SelectionSnapshotDetail | null> {
  const [row] = await db.select().from(selectionSnapshots).where(eq(selectionSnapshots.id, id)).limit(1);
  if (!row) return null;

  const productIds = row.items.map((item) => item.productId);
  const productRows = productIds.length
    ? await db
        .select({
          id: products.id,
          title: products.title,
          author: products.author,
          mainImageUrl: products.mainImageUrl,
          price: products.price,
          salePrice: products.salePrice,
          isActive: products.isActive,
          inStock: products.inStock,
        })
        .from(products)
        .where(inArray(products.id, productIds))
    : [];
  const productById = new Map(productRows.map((product) => [product.id, product]));

  return {
    id: row.id,
    status: row.status,
    periodLabel: row.periodLabel,
    title: row.title,
    body: row.body,
    autoSaved: row.autoSaved,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    items: row.items.map((item) => {
      const product = productById.get(item.productId);
      return {
        productId: item.productId,
        description: cleanText(item.description),
        title: product?.title ?? null,
        author: product?.author ?? null,
        imageUrl: product?.mainImageUrl ?? null,
        price: product?.price ?? null,
        salePrice: product?.salePrice ?? null,
        isActive: product?.isActive ?? false,
        inStock: product?.inStock ?? false,
        missing: !product,
      };
    }),
  };
}

export async function createSelectionSnapshot(
  input: CreateSelectionSnapshotInput,
): Promise<SelectionServiceResult<{ id: string; status: "draft" | "archived" }>> {
  if (input.action === "duplicate") {
    const [source] = await db
      .select()
      .from(selectionSnapshots)
      .where(eq(selectionSnapshots.id, input.sourceId))
      .limit(1);
    if (!source) return fail("not_found", "No se encontró la selección que quieres copiar.");

    const [created] = await db
      .insert(selectionSnapshots)
      .values({
        status: "draft",
        periodLabel: source.periodLabel ? `${source.periodLabel} (copia)` : null,
        title: source.title,
        body: source.body,
        items: source.items,
      })
      .returning({ id: selectionSnapshots.id });
    return { success: true, data: { id: created.id, status: "draft" } };
  }

  const periodLabel = cleanText(input.periodLabel);

  if (input.action === "blank_draft") {
    const [created] = await db
      .insert(selectionSnapshots)
      .values({ status: "draft", periodLabel })
      .returning({ id: selectionSnapshots.id });
    return { success: true, data: { id: created.id, status: "draft" } };
  }

  const current = await readCurrentSelection(db);

  if (input.action === "archive_current") {
    if (current.items.length === 0 && !current.title && !current.body) {
      return fail("empty_selection", "No hay una selección publicada para guardar.");
    }

    const [created] = await db
      .insert(selectionSnapshots)
      .values({ status: "archived", periodLabel, title: current.title, body: current.body, items: current.items })
      .returning({ id: selectionSnapshots.id });
    return { success: true, data: { id: created.id, status: "archived" } };
  }

  const [created] = await db
    .insert(selectionSnapshots)
    .values({ status: "draft", periodLabel, title: current.title, body: current.body, items: current.items })
    .returning({ id: selectionSnapshots.id });
  return { success: true, data: { id: created.id, status: "draft" } };
}

export async function updateSelectionSnapshot(
  id: string,
  data: UpdateSelectionSnapshotInput,
): Promise<SelectionServiceResult<{ id: string }>> {
  const [row] = await db.select().from(selectionSnapshots).where(eq(selectionSnapshots.id, id)).limit(1);
  if (!row) return fail("not_found", "No se encontró la selección.");

  const touchesContent = data.title !== undefined || data.body !== undefined || data.items !== undefined;
  if (row.status === "archived" && touchesContent) {
    return fail(
      "read_only",
      "Una selección del historial no se edita. Cópiala como borrador para modificarla.",
    );
  }

  const updateData: Partial<typeof selectionSnapshots.$inferInsert> = { updatedAt: new Date() };
  if (data.periodLabel !== undefined) updateData.periodLabel = cleanText(data.periodLabel);
  if (data.title !== undefined) updateData.title = cleanText(data.title);
  if (data.body !== undefined) updateData.body = cleanText(data.body);

  if (data.items !== undefined) {
    const items = dedupeItems(
      data.items.map((item) => ({ productId: item.productId, description: item.description })),
    );
    const ids = items.map((item) => item.productId);
    if (ids.length > 0) {
      const found = await db.select({ id: products.id }).from(products).where(inArray(products.id, ids));
      if (found.length !== ids.length) {
        return fail("product_not_found", "Alguno de los libros ya no existe en el catálogo.");
      }
    }
    updateData.items = items;
  }

  await db.update(selectionSnapshots).set(updateData).where(eq(selectionSnapshots.id, id));
  return { success: true, data: { id } };
}

export async function deleteSelectionSnapshot(id: string): Promise<boolean> {
  const deleted = await db
    .delete(selectionSnapshots)
    .where(eq(selectionSnapshots.id, id))
    .returning({ id: selectionSnapshots.id });
  return deleted.length > 0;
}

class PublishAbort extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export type PublishResult = {
  published: number;
  /** Títulos de libros que no se publicaron porque ya no están activos o no existen. */
  skipped: string[];
  /** true si la selección que estaba publicada se guardó sola en el historial. */
  backedUp: boolean;
};

/**
 * Pone una selección (borrador o del historial) como la vigente de la tienda.
 * Antes guarda la actual en el historial si todavía no está guardada igual. Si era un
 * borrador, se elimina (su contenido pasa a ser la selección vigente); si venía del
 * historial, se queda ahí.
 */
export async function publishSelectionSnapshot(id: string): Promise<SelectionServiceResult<PublishResult>> {
  try {
    const result = await db.transaction((tx) => publishWithin(tx, id));
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof PublishAbort) return fail(error.code, error.message);
    throw error;
  }
}

async function publishWithin(tx: DbTransaction, id: string): Promise<PublishResult> {
  const [snapshot] = await tx.select().from(selectionSnapshots).where(eq(selectionSnapshots.id, id)).limit(1);
  if (!snapshot) throw new PublishAbort("not_found", "No se encontró la selección.");

  const ids = snapshot.items.map((item) => item.productId);
  const productRows = ids.length
    ? await tx
        .select({ id: products.id, title: products.title, isActive: products.isActive })
        .from(products)
        .where(inArray(products.id, ids))
    : [];
  const productById = new Map(productRows.map((product) => [product.id, product]));

  const valid: SelectionSnapshotItem[] = [];
  const skipped: string[] = [];
  for (const item of snapshot.items) {
    const product = productById.get(item.productId);
    if (product?.isActive) {
      valid.push(item);
    } else {
      skipped.push(product?.title ?? "Libro eliminado");
    }
  }

  if (valid.length === 0) {
    throw new PublishAbort(
      "no_available_items",
      "Esta selección no tiene libros activos para publicar. Agrega al menos uno.",
    );
  }

  // 1. Respaldo de lo que está publicado, salvo que ya exista igual en el historial.
  const current = await readCurrentSelection(tx);
  let backedUp = false;
  if (current.items.length > 0 || current.title || current.body) {
    const archived = await tx
      .select()
      .from(selectionSnapshots)
      .where(eq(selectionSnapshots.status, "archived"))
      .orderBy(desc(selectionSnapshots.createdAt))
      .limit(200);
    const alreadySaved = archived.some((row) => sameContent(row, current));
    if (!alreadySaved) {
      await tx.insert(selectionSnapshots).values({
        status: "archived",
        title: current.title,
        body: current.body,
        items: current.items,
        autoSaved: true,
      });
      backedUp = true;
    }
  }

  // 2. La selección nueva reemplaza a la vigente (normaliza también secciones antiguas).
  await tx.delete(featuredProducts).where(inArray(featuredProducts.section, SECTION_ALIASES));
  await tx.insert(featuredProducts).values(
    valid.map((item, index) => ({
      productId: item.productId,
      section: MONTHLY_SELECTION_SECTION,
      description: cleanText(item.description),
      displayOrder: index,
      isActive: true,
    })),
  );

  // 3. Título y descripción del bloque.
  const [existingCopy] = await tx
    .select({ id: landingSectionCopy.id })
    .from(landingSectionCopy)
    .where(eq(landingSectionCopy.sectionKey, COPY_SECTION_KEY))
    .limit(1);
  if (existingCopy) {
    await tx
      .update(landingSectionCopy)
      .set({
        title: cleanText(snapshot.title),
        body: cleanText(snapshot.body),
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(landingSectionCopy.id, existingCopy.id));
  } else {
    await tx.insert(landingSectionCopy).values({
      sectionKey: COPY_SECTION_KEY,
      title: cleanText(snapshot.title),
      body: cleanText(snapshot.body),
      isActive: true,
    });
  }

  // 4. Un borrador publicado deja de ser borrador.
  if (snapshot.status === "draft") {
    await tx.delete(selectionSnapshots).where(eq(selectionSnapshots.id, snapshot.id));
  }

  return { published: valid.length, skipped, backedUp };
}
