"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { GIFT_PRICE_RANGES, type GiftOccasion } from "@/shared/config/regalos";

type GiftsFiltersProps = {
  occasions: GiftOccasion[];
  categories: Array<{ slug: string; name: string; count: number }>;
};

const SORT_OPTIONS = [
  { value: "", label: "Selección Crecer" },
  { value: "newest", label: "Más recientes" },
  { value: "price_asc", label: "Menor a mayor precio" },
  { value: "price_desc", label: "Mayor a menor precio" },
  { value: "name", label: "Orden alfabético" },
] as const;

const FILTER_KEYS = ["ocasion", "cat", "precio", "oferta"] as const;

export function useGiftsNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(changes: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(changes)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }

    if (!("page" in changes)) {
      params.delete("page");
    }

    const query = params.toString();
    router.push(query ? `/regalos?${query}` : "/regalos", { scroll: false });
  }

  return { searchParams, update };
}

/** Chips horizontales de ocasión: visibles en todos los tamaños, encima del listado. */
export function GiftsOccasionChips({ occasions }: { occasions: GiftOccasion[] }) {
  const { searchParams, update } = useGiftsNavigation();
  const active = searchParams.get("ocasion") ?? "";

  return (
    <div aria-label="Ocasiones" className="gifts-chips" role="group">
      <button
        aria-pressed={active === ""}
        className="gifts-chip gifts-chip--plain"
        onClick={() => update({ ocasion: null, cat: null })}
        type="button"
      >
        Todas las ocasiones
      </button>
      {occasions.map((occasion) => (
        <button
          aria-pressed={active === occasion.slug}
          className="gifts-chip"
          key={occasion.slug}
          onClick={() => update({ ocasion: occasion.slug, cat: null })}
          type="button"
        >
          {occasion.imageUrl ? (
            <span aria-hidden="true" className="gifts-chip-thumb">
              <Image alt="" fill sizes="32px" src={occasion.imageUrl} style={{ objectFit: "cover" }} />
            </span>
          ) : null}
          {occasion.label}
        </button>
      ))}
    </div>
  );
}

export function GiftsFilters({ occasions, categories }: GiftsFiltersProps) {
  const { searchParams, update } = useGiftsNavigation();
  const [open, setOpen] = useState(false);

  const activeOccasion = searchParams.get("ocasion") ?? "";
  const activeCategory = searchParams.get("cat") ?? "";
  const activePrice = searchParams.get("precio") ?? "";
  const onSale = searchParams.get("oferta") === "1";
  const activeSort = searchParams.get("sort") ?? "";
  const hasFilters = FILTER_KEYS.some((key) => searchParams.get(key));

  return (
    <>
      <button
        aria-controls="gifts-filters-panel"
        aria-expanded={open}
        className="gifts-filters-toggle"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" viewBox="0 0 24 24" width="16">
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
        {open ? "Ocultar filtros" : "Filtrar y ordenar"}
      </button>

      <aside className="gifts-filters" data-open={open} id="gifts-filters-panel">
        <div>
          <h3 className="gifts-filter-title">Ocasión</h3>
          <ul className="gifts-filter-list">
            <li>
              <button
                aria-pressed={activeOccasion === ""}
                className="gifts-filter-option"
                onClick={() => update({ ocasion: null, cat: null })}
                type="button"
              >
                Todas las ocasiones
              </button>
            </li>
            {occasions.map((occasion) => (
              <li key={occasion.slug}>
                <button
                  aria-pressed={activeOccasion === occasion.slug}
                  className="gifts-filter-option"
                  onClick={() => update({ ocasion: occasion.slug, cat: null })}
                  type="button"
                >
                  {occasion.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {categories.length > 0 ? (
          <div>
            <h3 className="gifts-filter-title">Tipo de producto</h3>
            <ul className="gifts-filter-list">
              <li>
                <button
                  aria-pressed={activeCategory === ""}
                  className="gifts-filter-option"
                  onClick={() => update({ cat: null })}
                  type="button"
                >
                  Todos
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.slug}>
                  <button
                    aria-pressed={activeCategory === category.slug}
                    className="gifts-filter-option"
                    onClick={() => update({ cat: category.slug })}
                    type="button"
                  >
                    <span>{category.name}</span>
                    <span className="gifts-filter-count">{category.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <h3 className="gifts-filter-title">Precio</h3>
          <ul className="gifts-filter-list">
            <li>
              <button
                aria-pressed={activePrice === ""}
                className="gifts-filter-option"
                onClick={() => update({ precio: null })}
                type="button"
              >
                Cualquier precio
              </button>
            </li>
            {GIFT_PRICE_RANGES.map((range) => (
              <li key={range.value}>
                <button
                  aria-pressed={activePrice === range.value}
                  className="gifts-filter-option"
                  onClick={() => update({ precio: range.value })}
                  type="button"
                >
                  {range.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="gifts-filter-title">Ofertas</h3>
          <ul className="gifts-filter-list">
            <li>
              <button
                aria-pressed={onSale}
                className="gifts-filter-option"
                onClick={() => update({ oferta: onSale ? null : "1" })}
                type="button"
              >
                Solo productos en oferta
              </button>
            </li>
          </ul>
        </div>

        <div className="lg:hidden">
          <h3 className="gifts-filter-title">Ordenar por</h3>
          <select
            className="gifts-sort"
            onChange={(event) => update({ sort: event.target.value || null })}
            value={activeSort}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {hasFilters ? (
          <button
            className="gifts-clear"
            onClick={() => update({ ocasion: null, cat: null, precio: null, oferta: null })}
            type="button"
          >
            Limpiar filtros
          </button>
        ) : null}
      </aside>
    </>
  );
}

export function GiftsSortSelect() {
  const { searchParams, update } = useGiftsNavigation();
  const activeSort = searchParams.get("sort") ?? "";

  return (
    <select
      aria-label="Ordenar por"
      className="gifts-sort"
      onChange={(event) => update({ sort: event.target.value || null })}
      value={activeSort}
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function GiftsPagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const { update } = useGiftsNavigation();

  if (totalPages <= 1) {
    return null;
  }

  function goTo(page: number) {
    update({ page: page <= 1 ? null : String(page) });
    document.getElementById("regalos-listado")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav aria-label="Paginación" className="gifts-pagination">
      <button disabled={currentPage <= 1} onClick={() => goTo(currentPage - 1)} type="button">
        Anterior
      </button>
      <span>
        Página {currentPage} de {totalPages}
      </span>
      <button disabled={currentPage >= totalPages} onClick={() => goTo(currentPage + 1)} type="button">
        Siguiente
      </button>
    </nav>
  );
}
