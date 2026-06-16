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
      <div className="sticky top-[100px] flex flex-col gap-10 py-2">
        {/* Search */}
        <div>
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-text-light/80">
            Buscar
          </h3>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Título, autor..."
              className="w-full border-b border-border/60 bg-transparent py-2 pl-0 pr-8 text-sm text-text placeholder:text-text-light/60 focus:border-moss focus:outline-none transition-colors"
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-text-light/60 hover:text-text transition-colors"
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
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-text-light/80">
            Filtros Especiales
          </h3>
          <div className="flex flex-col gap-3">
            {filterOptions.map((opt) => {
              const isActive = activeFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => updateParams("filter", opt.value)}
                  className="group flex items-center gap-3 text-left transition-all"
                >
                  <div className={cx(
                    "flex h-4 w-8 shrink-0 items-center rounded-full transition-colors duration-300",
                    isActive ? "bg-moss" : "bg-border/60 group-hover:bg-border"
                  )}>
                    <div className={cx(
                      "h-3 w-3 rounded-full bg-white shadow-sm transition-transform duration-300",
                      isActive ? "translate-x-4.5" : "translate-x-0.5"
                    )} />
                  </div>
                  <span className={cx(
                    "text-sm transition-colors duration-300",
                    isActive ? "text-text font-medium" : "text-text-mid group-hover:text-text"
                  )}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort */}
        <div>
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-text-light/80">
            Ordenar por
          </h3>
          <div className="flex flex-col gap-3">
            {sortOptions.map((opt) => {
              const isActive = activeSort === opt.value;
              return (
                <label key={opt.value} className="group flex cursor-pointer items-center gap-3 transition-colors">
                  <div className={cx(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-300",
                    isActive ? "border-moss bg-moss" : "border-border/80 bg-transparent group-hover:border-moss/50"
                  )}>
                    <svg 
                      className={cx("h-2.5 w-2.5 text-white transition-opacity duration-300", isActive ? "opacity-100" : "opacity-0")}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <input
                    type="radio"
                    name="sort"
                    className="hidden"
                    checked={isActive}
                    onChange={() => updateParams("sort", opt.value)}
                  />
                  <span className={cx(
                    "text-sm transition-colors duration-300",
                    isActive ? "text-text font-medium" : "text-text-mid group-hover:text-text"
                  )}>
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
