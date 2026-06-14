import "server-only";

export type CoverCandidate = { url: string; source: "openlibrary" | "googlebooks" | "google_custom_search" };

type GoogleBooksResponse = {
  items?: Array<{
    volumeInfo?: {
      imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
      };
    };
  }>;
};

type OpenLibrarySearchResponse = {
  docs?: Array<{
    cover_i?: number;
  }>;
};

type GoogleCustomSearchResponse = {
  items?: Array<{
    link?: string;
    mime?: string;
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

/**
 * Fuerza HTTPS y elimina &edge=curl de las URLs de Google Books.
 */
function normalizeGoogleBooksImageUrl(url: string): string {
  let normalized = url.replace(/^http:\/\//, "https://");
  normalized = normalized.replace(/&edge=curl/g, "");
  return normalized;
}

/* ---------- Open Library: portada directa por ISBN ---------- */
async function searchOpenLibraryDirect(isbn: string): Promise<CoverCandidate[]> {
  try {
    const checkUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
    const response = await fetch(checkUrl, { method: "HEAD" });
    if (response.ok) {
      return [{
        url: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
        source: "openlibrary",
      }];
    }
  } catch (error) {
    console.warn("Open Library direct cover check failed", error);
  }
  return [];
}

/* ---------- Open Library: Search API (por ISBN, título o autor) ---------- */
async function searchOpenLibrarySearch(params: {
  isbn?: string | null;
  title?: string;
  author?: string;
}): Promise<CoverCandidate[]> {
  try {
    const queryParts: string[] = [];
    if (params.isbn) {
      queryParts.push(`isbn=${encodeURIComponent(params.isbn)}`);
    } else if (params.title) {
      queryParts.push(`title=${encodeURIComponent(params.title)}`);
      if (params.author) {
        queryParts.push(`author=${encodeURIComponent(params.author)}`);
      }
    } else {
      return [];
    }

    const searchUrl = `https://openlibrary.org/search.json?${queryParts.join("&")}&fields=cover_i&limit=4`;
    const response = await fetch(searchUrl);
    if (!response.ok) return [];

    const data = (await response.json()) as OpenLibrarySearchResponse;
    const candidates: CoverCandidate[] = [];
    for (const doc of data.docs ?? []) {
      if (doc.cover_i) {
        candidates.push({
          url: `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`,
          source: "openlibrary",
        });
      }
    }
    return candidates;
  } catch (error) {
    console.warn("Open Library search API failed", error);
    return [];
  }
}

/* ---------- Google Books ---------- */
async function searchGoogleBooks(params: {
  isbn?: string | null;
  title?: string;
  author?: string;
}): Promise<CoverCandidate[]> {
  try {
    let query: string;
    if (params.isbn) {
      query = `isbn:${params.isbn}`;
    } else if (params.title) {
      query = `intitle:${encodeURIComponent(params.title)}`;
      if (params.author) {
        query += `+inauthor:${encodeURIComponent(params.author)}`;
      }
    } else {
      return [];
    }

    const gbUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
    const gbResponse = await fetch(gbUrl);
    if (!gbResponse.ok) return [];

    const data = (await gbResponse.json()) as GoogleBooksResponse;
    const maxItems = params.isbn ? 1 : 3;
    const items = data.items?.slice(0, maxItems) ?? [];
    const candidates: CoverCandidate[] = [];
    for (const item of items) {
      const imageUrl =
        item.volumeInfo?.imageLinks?.thumbnail ??
        item.volumeInfo?.imageLinks?.smallThumbnail;
      if (imageUrl) {
        candidates.push({
          url: normalizeGoogleBooksImageUrl(imageUrl),
          source: "googlebooks",
        });
      }
    }
    return candidates;
  } catch (error) {
    console.warn("Google Books search failed", error);
    return [];
  }
}

/* ---------- Google Custom Search ---------- */
async function searchGoogleCustomSearch(queryText: string): Promise<CoverCandidate[]> {
  try {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !cx || !queryText.trim()) {
      return [];
    }

    const query = encodeURIComponent(queryText.trim());
    const url = `https://customsearch.googleapis.com/customsearch/v1?q=${query}&cx=${cx}&key=${apiKey}&searchType=image&num=4`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Custom Search Error HTTP", response.status, errorText);
      return [];
    }

    const data = (await response.json()) as GoogleCustomSearchResponse;
    // console.log(`Google Custom Search Exito para "${queryText}", items encontrados:`, data.items?.length || 0);

    const candidates: CoverCandidate[] = [];

    for (const item of data.items ?? []) {
      if (item.link) {
        // Ignorar SVG u otros formatos raros si vienen, aunque searchType=image suele limpiar esto
        if (!item.link.endsWith(".svg")) {
           candidates.push({
             url: item.link,
             source: "google_custom_search",
           });
        }
      }
    }

    return candidates;
  } catch (error) {
    console.warn("Google Custom Search failed", error);
    return [];
  }
}

/* ---------- Orquestador principal ---------- */

/**
 * Busca portadas de libros en Google Custom Search, Open Library y Google Books.
 * Ejecuta todas las fuentes en paralelo para máxima velocidad.
 * Nunca lanza — devuelve lo que se haya podido reunir (puede ser []).
 */
export async function searchCovers(input: {
  isbn?: string;
  title?: string;
  author?: string;
}): Promise<CoverCandidate[]> {
  const isbn = input.isbn ? normalizeIsbn(input.isbn) : null;

  // Lanzar todas las búsquedas en paralelo
  const searches: Promise<CoverCandidate[]>[] = [];

  if (isbn) {
    searches.push(searchGoogleCustomSearch(isbn));
    searches.push(searchOpenLibraryDirect(isbn));
    searches.push(searchOpenLibrarySearch({ isbn }));
    searches.push(searchGoogleBooks({ isbn }));
  } 
  
  if (input.title) {
    // Buscar el título entre comillas para que Google sea estricto con la frase
    const titleQuery = input.author ? `"${input.title}" ${input.author}` : `"${input.title}"`;
    searches.push(searchGoogleCustomSearch(titleQuery));
    
    searches.push(searchOpenLibrarySearch({ title: input.title, author: input.author }));
    searches.push(searchGoogleBooks({ title: input.title, author: input.author }));
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
