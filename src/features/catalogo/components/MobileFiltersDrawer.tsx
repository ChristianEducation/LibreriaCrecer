"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cx } from "class-variance-authority";

type SortOption = "newest" | "price_asc" | "price_desc" | "name";

export interface MobileFiltersDrawerProps {
  activeFilter: string;
  activeSort: string;
  totalResults: number;
}

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "newest", label: "Recientes" },
  { value: "price_asc", label: "Menor precio" },
  { value: "price_desc", label: "Mayor precio" },
  { value: "name", label: "A–Z" },
];

const filterChips: Array<{ value: string; label: string }> = [
  { value: "nuevo", label: "Nuevos" },
  { value: "oferta", label: "Ofertas" },
  { value: "seleccion", label: "Selección" },
];

export function MobileFiltersDrawer({
  activeFilter,
  activeSort,
  totalResults,
}: MobileFiltersDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sortOpen, setSortOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const sortRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(searchParams.get("search") ?? "");
  }, [searchParams]);

  // Close sort dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    if (sortOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(params.toString() ? `/productos?${params.toString()}` : "/productos");
  }

  function toggleFilter(value: string) {
    updateParam("filter", activeFilter === value ? "" : value);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchInput.trim();
    updateParam("search", trimmed);
    if (!trimmed) setSearchOpen(false);
  }

  function clearSearch() {
    setSearchInput("");
    updateParam("search", "");
    setSearchOpen(false);
  }

  const currentSortLabel = sortOptions.find((o) => o.value === activeSort)?.label ?? "Recientes";
  const hasActiveSearch = !!searchParams.get("search");

  return (
    <div className="lg:hidden" style={{ background: "var(--beige)" }}>
      {/* ── Barra compacta de filtros ── */}
      <div
        className="page-px flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
      >
        {/* Botón buscar */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className={cx(
            "flex shrink-0 items-center justify-center rounded-full border transition-colors",
            hasActiveSearch || searchOpen
              ? "border-moss bg-moss text-white"
              : "border-border bg-white text-text-mid hover:border-moss/40"
          )}
          style={{ width: "34px", height: "34px" }}
          aria-label="Buscar"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>
        </button>

        {/* Separador */}
        <div
          className="shrink-0"
          style={{ width: "1px", height: "20px", background: "var(--border)" }}
        />

        {/* Chips de filtro */}
        {filterChips.map((chip) => {
          const isActive = activeFilter === chip.value;
          return (
            <button
              key={chip.value}
              onClick={() => toggleFilter(chip.value)}
              className={cx(
                "shrink-0 rounded-full border px-3 text-xs font-medium transition-all",
                isActive
                  ? "border-moss bg-moss text-white"
                  : "border-border bg-white text-text-mid hover:border-moss/40 hover:text-text"
              )}
              style={{ height: "34px", letterSpacing: "0.02em" }}
            >
              {chip.label}
            </button>
          );
        })}

        {/* Separador */}
        <div
          className="shrink-0"
          style={{ width: "1px", height: "20px", background: "var(--border)" }}
        />

        {/* Sort dropdown trigger */}
        <div ref={sortRef} className="relative shrink-0">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3 text-xs font-medium text-text-mid transition-colors hover:border-moss/40 hover:text-text"
            style={{ height: "34px" }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 6h18M6 12h12M9 18h6" />
            </svg>
            {currentSortLabel}
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={cx("transition-transform", sortOpen && "rotate-180")}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Sort dropdown menu */}
          {sortOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-2 min-w-[160px] rounded-lg border border-border bg-white shadow-lg"
              style={{ animation: "fadeIn 150ms ease" }}
            >
              {sortOptions.map((opt) => {
                const isActive = activeSort === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      updateParam("sort", opt.value);
                      setSortOpen(false);
                    }}
                    className={cx(
                      "flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs transition-colors first:rounded-t-lg last:rounded-b-lg",
                      isActive
                        ? "bg-beige font-medium text-text"
                        : "text-text-mid hover:bg-beige-warm/50 hover:text-text"
                    )}
                  >
                    {isActive && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    <span className={!isActive ? "ml-5" : ""}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Contador de resultados */}
        <span
          className="ml-auto shrink-0 text-text-light"
          style={{ fontSize: "11px", whiteSpace: "nowrap" }}
        >
          {totalResults}
        </span>
      </div>

      {/* ── Barra de búsqueda expandible ── */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: searchOpen ? "60px" : "0px",
          opacity: searchOpen ? 1 : 0,
        }}
      >
        <form
          onSubmit={handleSearch}
          className="page-px flex items-center gap-2"
          style={{ paddingBottom: "0.75rem" }}
        >
          <div className="relative flex-1">
            <input
              ref={searchInputRef}
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar por título o autor..."
              className="w-full rounded-full border border-border bg-white py-2 pl-4 pr-10 text-sm text-text placeholder:text-text-light/50 focus:border-moss focus:outline-none transition-colors"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light/50 hover:text-text transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-moss text-white transition-colors hover:bg-moss/90"
            aria-label="Buscar"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" />
            </svg>
          </button>
        </form>
      </div>

      {/* Keyframe animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
