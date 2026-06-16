"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cx } from "class-variance-authority";

type SortOption = "newest" | "price_asc" | "price_desc" | "name";

export interface MobileFiltersDrawerProps {
  activeFilter: string;
  activeSort: string;
  totalResults: number;
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

export function MobileFiltersDrawer({
  activeFilter,
  activeSort,
  totalResults,
}: MobileFiltersDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

  // Local state for the drawer before applying
  const [localFilter, setLocalFilter] = useState(activeFilter);
  const [localSort, setLocalSort] = useState(activeSort);

  useEffect(() => {
    setSearchInput(searchParams.get("search") ?? "");
    setLocalFilter(activeFilter);
    setLocalSort(activeSort);
  }, [searchParams, activeFilter, activeSort, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleApply() {
    const params = new URLSearchParams(searchParams.toString());
    
    if (localFilter) params.set("filter", localFilter);
    else params.delete("filter");
    
    if (localSort) params.set("sort", localSort);
    else params.delete("sort");

    const trimmedSearch = searchInput.trim();
    if (trimmedSearch) params.set("search", trimmedSearch);
    else params.delete("search");

    params.delete("page");

    router.push(params.toString() ? `/productos?${params.toString()}` : "/productos");
    setIsOpen(false);
  }

  function handleClear() {
    setLocalFilter("");
    setLocalSort("newest");
    setSearchInput("");
  }

  return (
    <div className="lg:hidden sticky z-[90] border-b border-b-border bg-white/95 backdrop-blur flex items-center justify-between px-5 py-3" style={{ top: "64px" }}>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium text-text transition-colors hover:bg-beige-warm"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="18" y2="18" />
          <circle cx="10" cy="12" r="3" fill="none" />
        </svg>
        Filtros
        {(activeFilter || searchInput) && (
          <span className="ml-1 flex h-2 w-2 rounded-full bg-moss"></span>
        )}
      </button>

      <span className="text-sm text-text-light">
        {totalResults} {totalResults === 1 ? "producto" : "productos"}
      </span>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={cx(
          "fixed inset-x-0 bottom-0 z-[101] flex flex-col rounded-t-2xl bg-white transition-transform duration-300 ease-in-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{ maxHeight: "85vh" }}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-medium text-text">Filtros y orden</h2>
          <button onClick={() => setIsOpen(false)} className="rounded-full p-2 text-text-light hover:bg-beige-warm hover:text-text">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
          {/* Buscar */}
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-text-light/80">
              Buscar
            </h3>
            <div className="relative">
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Título, autor..."
                className="w-full border-b border-border/60 bg-transparent py-2 pl-0 pr-8 text-sm text-text placeholder:text-text-light/60 focus:border-moss focus:outline-none transition-colors"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-text-light/60">
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" className="h-4 w-4">
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m16 16 4.25 4.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-text-light/80">
              Filtros Especiales
            </h3>
            <div className="flex flex-col gap-3">
              {filterOptions.map((opt) => {
                const isActive = localFilter === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setLocalFilter(opt.value)}
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

          {/* Ordenar */}
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-text-light/80">
              Ordenar por
            </h3>
            <div className="flex flex-col gap-3">
              {sortOptions.map((opt) => {
                const isActive = localSort === opt.value;
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
                      name="mobile-sort"
                      className="hidden"
                      checked={isActive}
                      onChange={() => setLocalSort(opt.value)}
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

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 border-t border-border bg-white px-5 py-4">
          <button 
            onClick={handleClear}
            className="rounded-full px-4 py-2 text-sm font-medium text-text-light hover:text-text transition-colors"
          >
            Limpiar todo
          </button>
          <button 
            onClick={handleApply}
            className="flex-1 rounded-full bg-moss px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-moss/90"
          >
            Mostrar resultados
          </button>
        </div>
      </div>
    </div>
  );
}
