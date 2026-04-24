"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
      <div className="filter-bar-layout">
        {/* Izquierda: chips de filtro */}
        <div className="filter-bar-chips-mobile">
          {filterChips.map((chip) => {
            const isActive = chip.value === activeFilter;
            return (
              <button
                key={chip.value || "all"}
                onClick={() => updateFilter(chip.value)}
                type="button"
                style={{
                  borderRadius: "var(--radius-xl)",
                  padding: "6px 16px",
                  fontSize: "12px",
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  border: isActive ? "1px solid var(--moss)" : "1px solid var(--border)",
                  background: isActive ? "var(--moss)" : "transparent",
                  color: isActive ? "white" : "var(--text-mid)",
                  cursor: "pointer",
                  transition: "background 0.15s, color 0.15s, border-color 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Derecha: búsqueda + contador + sort */}
        <div className="filter-bar-controls">
          <form className="filter-bar-search" onSubmit={handleSearch}>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar..."
              style={{
                height: "32px",
                width: "100%",
                padding: "0 32px 0 10px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                fontSize: "12px",
                background: "var(--white)",
                color: "var(--text)",
                outline: "none",
                fontFamily: "var(--font-inter)",
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
                color: "var(--text-light)",
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

          <p className="filter-bar-count" style={{ fontSize: "12px", color: "var(--text-light)", fontFamily: "var(--font-inter)" }}>
            {totalResults} {totalResults === 1 ? "producto" : "productos"}
          </p>

          {/* Sort — desktop */}
          <div className="filter-bar-sort-buttons">
            {sortOptions.map((option) => {
              const isActive = option.value === activeSort;
              return (
                <button
                  key={option.value}
                  onClick={() => updateSort(option.value)}
                  type="button"
                  style={{
                    borderRadius: "var(--radius-xl)",
                    padding: "6px 16px",
                    fontSize: "12px",
                    fontFamily: "var(--font-inter)",
                    fontWeight: 500,
                    border: "1px solid var(--border)",
                    background: isActive ? "var(--beige-warm)" : "transparent",
                    color: "var(--text-mid)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Sort — mobile */}
          <label className="filter-bar-sort-select" style={{ fontSize: "12px", color: "var(--text-light)" }}>
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
    </div>
  );
}
