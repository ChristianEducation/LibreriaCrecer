"use client";

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
];

export function FilterBar({ totalResults, activeSort, activeFilter = "" }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  return (
    <div
      className="page-px sticky z-[90] border-b border-b-border bg-white/95 backdrop-blur"
      style={{ top: "64px" }}
    >
      <div
        className="flex items-center justify-between"
        style={{ minHeight: "52px", gap: "1rem" }}
      >
        {/* Izquierda: label + chips de filtro */}
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

        {/* Derecha: contador + selector de orden */}
        <div className="flex items-center gap-4">
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
    </div>
  );
}
