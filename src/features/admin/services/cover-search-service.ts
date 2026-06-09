import "server-only";

export type CoverCandidate = { url: string; source: "openlibrary" | "googlebooks" };

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

/**
 * Busca portadas de libros en Open Library y Google Books.
 * Nunca lanza — devuelve lo que se haya podido reunir (puede ser []).
 */
export async function searchCovers(input: {
  isbn?: string;
  title?: string;
  author?: string;
}): Promise<CoverCandidate[]> {
  const candidates: CoverCandidate[] = [];
  const isbn = input.isbn ? normalizeIsbn(input.isbn) : null;

  if (isbn) {
    // — Open Library (HEAD check) —
    try {
      const olCheckUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
      const olResponse = await fetch(olCheckUrl, { method: "HEAD" });
      if (olResponse.ok) {
        candidates.push({
          url: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
          source: "openlibrary",
        });
      }
    } catch (error) {
      console.warn("Open Library cover search failed", error);
    }

    // — Google Books por ISBN —
    try {
      const gbUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
      const gbResponse = await fetch(gbUrl);
      if (gbResponse.ok) {
        const data = (await gbResponse.json()) as GoogleBooksResponse;
        const item = data.items?.[0];
        const imageUrl =
          item?.volumeInfo?.imageLinks?.thumbnail ??
          item?.volumeInfo?.imageLinks?.smallThumbnail;
        if (imageUrl) {
          candidates.push({
            url: normalizeGoogleBooksImageUrl(imageUrl),
            source: "googlebooks",
          });
        }
      }
    } catch (error) {
      console.warn("Google Books ISBN search failed", error);
    }
  } else if (input.title) {
    // — Google Books por título + autor —
    try {
      let query = `intitle:${encodeURIComponent(input.title)}`;
      if (input.author) {
        query += `+inauthor:${encodeURIComponent(input.author)}`;
      }
      const gbUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
      const gbResponse = await fetch(gbUrl);
      if (gbResponse.ok) {
        const data = (await gbResponse.json()) as GoogleBooksResponse;
        const items = data.items?.slice(0, 3) ?? [];
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
      }
    } catch (error) {
      console.warn("Google Books title search failed", error);
    }
  }

  // Deduplicar por URL y limitar a 4
  const seen = new Set<string>();
  const unique: CoverCandidate[] = [];
  for (const candidate of candidates) {
    if (!seen.has(candidate.url)) {
      seen.add(candidate.url);
      unique.push(candidate);
    }
    if (unique.length >= 4) break;
  }

  return unique;
}
