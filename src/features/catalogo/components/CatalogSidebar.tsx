"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cx } from "class-variance-authority";

type SortOption = "newest" | "price_asc" | "price_desc" | "name";

export interface CatalogSidebarProps {
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
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-[100px] flex flex-col gap-8 rounded-2xl bg-white/40 border border-border/50 p-5 shadow-sm backdrop-blur-sm">
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
              className="w-full rounded-lg border border-border bg-white/60 py-2 pl-3 pr-8 text-sm text-text placeholder:text-text-light focus:border-moss focus:bg-white focus:outline-none transition-colors shadow-inner"
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

        {/* Filters */}
        <div>
          <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-text-light">
            Filtros Especiales
          </h3>
          <div className="flex flex-col gap-2">
            {filterOptions.map((opt) => {
              const isActive = activeFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => updateParams("filter", opt.value)}
                  className={cx(
                    "rounded-lg border px-3 py-2 text-sm text-left transition-all",
                    isActive
                      ? "border-moss bg-moss text-white shadow-md shadow-moss/20"
                      : "border-border/50 bg-white/60 text-text hover:bg-white hover:border-border"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort */}
        <div>
          <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-text-light">
            Ordenar por
          </h3>
          <div className="flex flex-col gap-1.5">
            {sortOptions.map((opt) => (
              <label key={opt.value} className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/60 transition-colors text-sm text-text-mid hover:text-text">
                <div className={cx(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                  activeSort === opt.value ? "border-moss" : "border-border/80 group-hover:border-moss/50"
                )}>
                  {activeSort === opt.value && (
                    <div className="h-2 w-2 rounded-full bg-moss" />
                  )}
                </div>
                <input
                  type="radio"
                  name="sort"
                  className="hidden"
                  checked={activeSort === opt.value}
                  onChange={() => updateParams("sort", opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
