"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cx } from "class-variance-authority";

type SortOption = "newest" | "price_asc" | "price_desc" | "name";

export interface FilterBarProps {
  totalResults: number;
  activeSort: string;
  activeFilter?: string;
}

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "newest", label: "Más recientes" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "name", label: "Orden alfabético" },
];

const filterChips: Array<{ value: string; label: string }> = [
  { value: "", label: "Todos" },
  { value: "nuevo", label: "Nuevos" },
  { value: "oferta", label: "En oferta" },
  { value: "destacado", label: "Recomendados" },
  { value: "seleccion", label: "Selección del mes" },
];

export function FilterBar({ totalResults, activeSort, activeFilter = "" }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    setSearchInput(searchParams.get("search") ?? "");
  }, [searchParams]);

  function updateSort(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.push(`/productos?${params.toString()}`);
  }

  function updateFilter(filter: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (filter) {
      params.set("filter", filter);
    } else {
      params.delete("filter");
    }
    router.push(params.toString() ? `/productos?${params.toString()}` : "/productos");
  }

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = searchInput.trim();
    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(params.toString() ? `/productos?${params.toString()}` : "/productos");
  }

  return (
    <div
      className="page-px sticky z-[90] border-b border-b-border bg-white/95 backdrop-blur"
      style={{ top: "64px" }}
    >
      <div
        className="flex items-center justify-between"
        style={{ minHeight: "52px", gap: "1rem" }}
      >
        {/* Izquierda: label + chips de filtro (desktop) */}
        <div className="flex items-center gap-3">
          <span
            className="font-sans uppercase"
            style={{
              fontSize: "10px",
              letterSpacing: "0.22em",
              color: "var(--text-light)",
              whiteSpace: "nowrap",
            }}
          >
            FILTRAR
          </span>
          <div className="hidden items-center gap-2 md:flex">
            {filterChips.map((chip) => {
              const isActive = chip.value === activeFilter;
              return (
                <button
                  className={cx(
                    "rounded-[2px] border transition-colors",
                    isActive
                      ? "border-moss bg-moss text-white"
                      : "border-border text-text-mid hover:border-moss hover:text-moss",
                  )}
                  key={chip.value || "all"}
                  onClick={() => updateFilter(chip.value)}
                  style={{ padding: "5px 12px", fontSize: "11px" }}
                  type="button"
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Derecha: búsqueda + contador + selector de orden */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} style={{ position: "relative" }}>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar..."
              style={{
                height: "32px",
                width: "180px",
                padding: "0 32px 0 10px",
                border: "1px solid var(--color-border)",
                borderRadius: "2px",
                fontSize: "12px",
                background: "var(--color-white)",
                color: "var(--color-text)",
                outline: "none",
                fontFamily: "var(--font-sans)",
              }}
            />
            <button
              type="submit"
              aria-label="Buscar"
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "var(--color-text-light)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" style={{ width: "13px", height: "13px" }}>
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="m16 16 4.25 4.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
              </svg>
            </button>
          </form>

          <p style={{ fontSize: "12px", color: "var(--text-light)", whiteSpace: "nowrap" }}>
            {totalResults} {totalResults === 1 ? "producto" : "productos"}
          </p>

          {/* Orden desktop */}
          <div className="hidden items-center gap-2 md:flex">
            {sortOptions.map((option) => {
              const isActive = option.value === activeSort;
              return (
                <button
                  className={cx(
                    "rounded-[2px] border transition-colors",
                    isActive
                      ? "border-transparent bg-moss text-white"
                      : "border-border text-text-mid hover:border-moss hover:text-moss",
                  )}
                  key={option.value}
                  onClick={() => updateSort(option.value)}
                  style={{ padding: "5px 12px", fontSize: "11px" }}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Orden mobile */}
          <label className="flex items-center gap-2 md:hidden" style={{ fontSize: "12px", color: "var(--text-light)" }}>
            <span>Orden</span>
            <select
              className="border-none bg-transparent focus:outline-none"
              onChange={(event) => updateSort(event.target.value)}
              style={{ fontSize: "12px", color: "var(--text)" }}
              value={activeSort}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Chips de filtro móvil — scroll horizontal, ocultos en desktop */}
      <div className="filter-bar-chips-mobile md:hidden">
        {filterChips.map((chip) => {
          const isActive = chip.value === activeFilter;
          return (
            <button
              className={cx(
                "shrink-0 rounded-[2px] border transition-colors",
                isActive
                  ? "border-moss bg-moss text-white"
                  : "border-border text-text-mid hover:border-moss hover:text-moss",
              )}
              key={chip.value || "all"}
              onClick={() => updateFilter(chip.value)}
              style={{ padding: "5px 12px", fontSize: "11px" }}
              type="button"
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
