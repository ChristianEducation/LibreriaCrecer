"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cx } from "class-variance-authority";

type SortOption = "newest" | "price_asc" | "price_desc" | "name";

export interface FilterBarProps {
  totalResults: number;
  activeSort: string;
}

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "newest", label: "Mas recientes" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "name", label: "Orden alfabetico" },
];

export function FilterBar({ totalResults, activeSort }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateSort(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    const query = params.toString();
    router.push(query ? `/productos?${query}` : "/productos");
  }

  return (
    <div className="sticky top-16 z-[90] border-b border-b-border bg-white/95 px-5 backdrop-blur md:px-10 lg:px-14">
      <div className="flex min-h-[52px] flex-col justify-center gap-3 py-3 md:flex-row md:items-center md:justify-between md:py-0">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.22em] text-text-light">Ordenar</span>
          <div className="hidden items-center gap-2 md:flex">
            {sortOptions.map((option) => {
              const isActive = option.value === activeSort;
              return (
                <button
                  className={cx(
                    "rounded-[1px] border px-3 py-[5px] text-[11px] transition-colors",
                    isActive
                      ? "border-transparent bg-moss text-white"
                      : "border-border text-text-mid hover:border-moss hover:text-moss",
                  )}
                  key={option.value}
                  onClick={() => updateSort(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-[12px] text-text-light">
            {totalResults} {totalResults === 1 ? "producto" : "productos"}
          </p>
          <label className="flex items-center gap-2 text-[12px] text-text-light md:hidden">
            <span>Orden</span>
            <select
              className="border-none bg-transparent text-[12px] text-text focus:outline-none"
              onChange={(event) => updateSort(event.target.value)}
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
