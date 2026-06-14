import "server-only";

export type CoverCandidate = { url: string; source: "serper" };

type SerperImageResponse = {
  images?: Array<{
    imageUrl?: string;
    link?: string;
  }>;
};

/**
 * Normaliza un ISBN: extrae el primer bloque de 13 dígitos que empiece en 978/979.
 * Si no encuentra un ISBN-13 válido, retorna null.
 */
function normalizeIsbn(raw: string): string | null {
  const digitsOnly = raw.replace(/\D/g, "");
  const match = digitsOnly.match(/(97[89]\d{10})/);
  return match ? match[1] : null;
}

/* ---------- Serper API (Google Images) ---------- */
async function searchSerperImages(queryText: string): Promise<CoverCandidate[]> {
  try {
    const apiKey = process.env.SERPER_API_KEY;

    if (!apiKey) {
      console.warn("ADVERTENCIA: SERPER_API_KEY no está definida en las variables de entorno.");
      return [];
    }

    if (!queryText.trim()) {
      return [];
    }

    const response = await fetch("https://google.serper.dev/images", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: queryText.trim(),
        num: 10 // Pedimos algunas extra por si hay duplicados o svgs
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Serper API Error HTTP", response.status, errorText);
      return [];
    }

    const data = (await response.json()) as SerperImageResponse;
    const candidates: CoverCandidate[] = [];

    for (const item of data.images ?? []) {
      const imgUrl = item.imageUrl || item.link;
      if (imgUrl && !imgUrl.endsWith(".svg")) {
        candidates.push({
          url: imgUrl,
          source: "serper",
        });
      }
    }

    return candidates;
  } catch (error) {
    console.warn("Serper API search failed", error);
    return [];
  }
}

/* ---------- Orquestador principal ---------- */

/**
 * Busca portadas de libros en Google Imágenes usando Serper API.
 * Nunca lanza — devuelve lo que se haya podido reunir (puede ser []).
 */
export async function searchCovers(input: {
  isbn?: string;
  title?: string;
  author?: string;
}): Promise<CoverCandidate[]> {
  const isbn = input.isbn ? normalizeIsbn(input.isbn) : null;

  // Lanzar todas las búsquedas en paralelo (ISBN y/o Título)
  const searches: Promise<CoverCandidate[]>[] = [];

  if (isbn) {
    searches.push(searchSerperImages(isbn));
  } 
  
  if (input.title) {
    // Buscar el título entre comillas para que Google sea estricto con la frase
    const titleQuery = input.author ? `"${input.title}" ${input.author} libro portada` : `"${input.title}" libro portada`;
    searches.push(searchSerperImages(titleQuery));
  }

  if (searches.length === 0) return [];

  const results = await Promise.all(searches);
  const allCandidates = results.flat();

  // Deduplicar por URL y limitar a 4
  const seen = new Set<string>();
  const unique: CoverCandidate[] = [];
  for (const candidate of allCandidates) {
    if (!seen.has(candidate.url)) {
      seen.add(candidate.url);
      unique.push(candidate);
    }
    if (unique.length >= 4) break;
  }

  return unique;
}
