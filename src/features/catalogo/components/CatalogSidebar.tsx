"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cx } from "class-variance-authority";

type SortOption = "newest" | "price_asc" | "price_desc" | "name";

export interface CatalogSidebarProps {
  categories: { id: string; name: string; slug: string }[];
  activeCategory: string;
  activeFilter: string;
  activeSort: string;
}

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "newest", label: "Más recientes" },
  { value: "price_asc", label: "Menor a mayor precio" },
  { value: "price_desc", label: "Mayor a menor precio" },
  { value: "name", label: "Orden alfabético" },
];

const filterOptions: Array<{ value: string; label: string }> = [
  { value: "", label: "Todos" },
  { value: "nuevo", label: "Nuevos" },
  { value: "oferta", label: "En oferta" },
  { value: "seleccion", label: "Selección del mes" },
];

export function CatalogSidebar({
  categories,
  activeCategory,
  activeFilter,
  activeSort,
}: CatalogSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    setSearchInput(searchParams.get("search") ?? "");
  }, [searchParams]);

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    if (key !== "page") {
      params.delete("page");
    }
    
    router.push(params.toString() ? `/productos?${params.toString()}` : "/productos");
  }

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    updateParams("search", searchInput.trim());
  }

  return (
    <aside className="hidden lg:block w-56 shrink-0 space-y-8">
      {/* Search */}
      <div>
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-text-light">
          Buscar
        </h3>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Título, autor..."
            className="w-full rounded-md border border-border bg-white py-1.5 pl-3 pr-8 text-sm text-text placeholder:text-text-light focus:border-moss focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-light hover:text-text"
          >
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" className="h-4 w-4">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="m16 16 4.25 4.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
            </svg>
          </button>
        </form>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-text-light">
          Categorías
        </h3>
        <ul className="space-y-1.5">
          <li>
            <button
              onClick={() => updateParams("cat", "")}
              className={cx(
                "text-sm transition-colors",
                !activeCategory ? "font-medium text-text" : "text-text-mid hover:text-text",
              )}
            >
              Todas las categorías
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => updateParams("cat", cat.slug)}
                className={cx(
                  "text-sm transition-colors text-left",
                  activeCategory === cat.slug ? "font-medium text-text" : "text-text-mid hover:text-text",
                )}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Filters */}
      <div>
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-text-light">
          Filtros
        </h3>
        <ul className="space-y-2">
          {filterOptions.map((opt) => (
            <li key={opt.value}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-text-mid hover:text-text transition-colors">
                <input
                  type="radio"
                  name="filter"
                  checked={activeFilter === opt.value}
                  onChange={() => updateParams("filter", opt.value)}
                  className="accent-moss h-3.5 w-3.5"
                />
                {opt.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Sort */}
      <div>
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-text-light">
          Ordenar por
        </h3>
        <ul className="space-y-2">
          {sortOptions.map((opt) => (
            <li key={opt.value}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-text-mid hover:text-text transition-colors">
                <input
                  type="radio"
                  name="sort"
                  checked={activeSort === opt.value}
                  onChange={() => updateParams("sort", opt.value)}
                  className="accent-moss h-3.5 w-3.5"
                />
                {opt.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
