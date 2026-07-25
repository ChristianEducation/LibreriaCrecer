import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import sharp from "sharp";

import { db } from "@/integrations/drizzle";
import { encounterImages, encounters } from "@/integrations/drizzle/schema";

type DrivePhoto = {
  id: string;
  name: string;
};

type EncounterImport = {
  coverFileName: string;
  description: string;
  displayOrder: number;
  eventDate: string;
  excerpt: string;
  folderId: string;
  location: string;
  slug: string;
  title: string;
};

const ENCOUNTERS: EncounterImport[] = [
  {
    coverFileName: "IMG_9515.JPG",
    description:
      "El primero de nuestros encuentros: una jornada para compartir libros, conversación, fe y comunidad.",
    displayOrder: 0,
    eventDate: "2026-03-28",
    excerpt: "El inicio de Encuentros Crecer: libros, conversación y comunidad.",
    folderId: "1tpcoUcDHmFbBzbMg-tGe7KILJ0LaP5od",
    location: "Crecer Librería Católica, Antofagasta",
    slug: "primer-encuentro-crecer",
    title: "I Encuentro Crecer",
  },
  {
    coverFileName: "IMG_1206.JPG",
    description:
      "Una jornada para encontrarnos en torno a los libros, compartir conversaciones y seguir construyendo comunidad.",
    displayOrder: 1,
    eventDate: "2026-04-25",
    excerpt: "Libros, conversación y comunidad en una nueva jornada de Encuentros Crecer.",
    folderId: "1Esq3cKmvOfBYKWLrsoHlddXP0adWMDf1",
    location: "Crecer Librería Católica, Antofagasta",
    slug: "segundo-encuentro-crecer",
    title: "II Encuentro Crecer",
  },
  {
    coverFileName: "3º Encuentro Librería Crecer - 1.png.png",
    description:
      "Una tarde para compartir, dialogar y descubrir cómo los libros pueden abrir caminos de encuentro y crecimiento.",
    displayOrder: 2,
    eventDate: "2026-06-20",
    excerpt: "Una nueva experiencia para compartir y seguir creciendo como comunidad.",
    folderId: "15KbuYjyBu2kbDXa9TPGMgT7XhOtd4Jav",
    location: "Crecer Librería Católica, Antofagasta",
    slug: "tercer-encuentro-crecer",
    title: "III Encuentro Crecer",
  },
];

const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const storageKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!storageUrl || !storageKey) {
  throw new Error("Faltan las variables de Supabase necesarias para importar encuentros.");
}

const storage = createClient(storageUrl, storageKey);
const DRIVE_FILE_PATTERN =
  /aria-label="([^"]+\.(?:JPG|JPEG|PNG|WEBP)) Image Shared"[^>]*ssk='[^']*:([A-Za-z0-9_-]+)-0-16'/gi;

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      lastError = new Error(`HTTP ${response.status} al descargar ${url}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, attempt * 800));
  }

  throw lastError;
}

async function getDrivePhotos(folderId: string): Promise<DrivePhoto[]> {
  const response = await fetchWithRetry(`https://drive.google.com/drive/folders/${folderId}`);
  const html = await response.text();
  const photos: DrivePhoto[] = [];
  const seenIds = new Set<string>();

  for (const match of html.matchAll(DRIVE_FILE_PATTERN)) {
    const [, name, id] = match;
    if (seenIds.has(id)) continue;
    seenIds.add(id);
    photos.push({ id, name });
  }

  if (photos.length === 0) {
    throw new Error(`No se encontraron imágenes públicas en la carpeta ${folderId}.`);
  }

  return photos;
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );

  return results;
}

async function preparePhoto(photo: DrivePhoto) {
  const response = await fetchWithRetry(
    `https://drive.google.com/thumbnail?id=${photo.id}&sz=w1600`,
  );
  const source = Buffer.from(await response.arrayBuffer());
  const optimized = await sharp(source)
    .rotate()
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();

  return { ...photo, optimized };
}

async function uploadPhoto(
  encounterSlug: string,
  photo: Awaited<ReturnType<typeof preparePhoto>>,
  index: number,
) {
  const order = String(index + 1).padStart(3, "0");
  const path = `galeria/${encounterSlug}/${order}-${photo.id}.webp`;
  const { error } = await storage.storage.from("encounters").upload(path, photo.optimized, {
    cacheControl: "31536000",
    contentType: "image/webp",
    upsert: true,
  });

  if (error) {
    throw new Error(`No se pudo subir ${photo.name}: ${error.message}`);
  }

  const { data } = storage.storage.from("encounters").getPublicUrl(path);
  return {
    altText: `${photo.name} · ${encounterSlug.replaceAll("-", " ")}`,
    displayOrder: index,
    name: photo.name,
    url: data.publicUrl,
  };
}

async function uploadCover(
  encounterSlug: string,
  photo: Awaited<ReturnType<typeof preparePhoto>>,
) {
  const path = `portadas/${encounterSlug}.webp`;
  const { error } = await storage.storage.from("encounters").upload(path, photo.optimized, {
    cacheControl: "31536000",
    contentType: "image/webp",
    upsert: true,
  });

  if (error) {
    throw new Error(`No se pudo subir la portada de ${encounterSlug}: ${error.message}`);
  }

  return storage.storage.from("encounters").getPublicUrl(path).data.publicUrl;
}

async function saveEncounter(
  config: EncounterImport,
  coverImageUrl: string,
  images: Awaited<ReturnType<typeof uploadPhoto>>[],
) {
  const [existing] = await db
    .select({ id: encounters.id })
    .from(encounters)
    .where(eq(encounters.slug, config.slug))
    .limit(1);

  const encounterId = await db.transaction(async (tx) => {
    let id = existing?.id;

    if (id) {
      await tx
        .update(encounters)
        .set({
          title: config.title,
          eventDate: config.eventDate,
          excerpt: config.excerpt,
          description: config.description,
          coverImageUrl,
          location: config.location,
          displayOrder: config.displayOrder,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(encounters.id, id));
    } else {
      const [created] = await tx
        .insert(encounters)
        .values({
          slug: config.slug,
          title: config.title,
          eventDate: config.eventDate,
          excerpt: config.excerpt,
          description: config.description,
          coverImageUrl,
          location: config.location,
          displayOrder: config.displayOrder,
          isActive: true,
        })
        .returning({ id: encounters.id });
      id = created.id;
    }

    await tx.delete(encounterImages).where(eq(encounterImages.encounterId, id));
    await tx.insert(encounterImages).values(
      images.map((image) => ({
        encounterId: id,
        url: image.url,
        altText: image.altText,
        displayOrder: image.displayOrder,
      })),
    );

    return id;
  });

  return encounterId;
}

async function importEncounter(config: EncounterImport) {
  console.warn(`Importando ${config.title}...`);
  const drivePhotos = await getDrivePhotos(config.folderId);
  console.warn(`  ${drivePhotos.length} imágenes encontradas.`);

  const prepared = await mapWithConcurrency(drivePhotos, 6, async (photo, index) => {
    const result = await preparePhoto(photo);
    console.warn(`  Optimizada ${index + 1}/${drivePhotos.length}: ${photo.name}`);
    return result;
  });

  const uploaded = await mapWithConcurrency(prepared, 5, async (photo, index) => {
    const result = await uploadPhoto(config.slug, photo, index);
    console.warn(`  Subida ${index + 1}/${prepared.length}: ${photo.name}`);
    return result;
  });

  const cover =
    prepared.find(
      (photo) => photo.name.normalize("NFC") === config.coverFileName.normalize("NFC"),
    ) ?? prepared[0];
  const coverImageUrl = await uploadCover(config.slug, cover);
  const encounterId = await saveEncounter(config, coverImageUrl, uploaded);

  console.warn(`  Publicado ${config.title} (${encounterId}) con ${uploaded.length} imágenes.`);
}

async function main() {
  for (const encounter of ENCOUNTERS) {
    await importEncounter(encounter);
  }

  console.warn("Importación de encuentros completada.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
