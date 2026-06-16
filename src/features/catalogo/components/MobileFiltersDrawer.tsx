"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cx } from "class-variance-authority";

type SortOption = "newest" | "price_asc" | "price_desc" | "name";

export interface MobileFiltersDrawerProps {
  activeFilter: string;
  activeSort: string;
  totalResults: number;
  categories: { id: string; name: string; slug: string }[];
  activeCategory: string;
}

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "newest", label: "Recientes" },
  { value: "price_asc", label: "Menor precio" },
  { value: "price_desc", label: "Mayor precio" },
  { value: "name", label: "A – Z" },
];

const filterOptions: Array<{ value: string; label: string }> = [
  { value: "nuevo", label: "Nuevos" },
  { value: "seleccion", label: "Selección del mes" },
];

export function MobileFiltersDrawer({
  activeFilter,
  activeSort,
  totalResults,
  categories,
  activeCategory,
}: MobileFiltersDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [catOpen, setCatOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const catRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(searchParams.get("search") ?? "");
  }, [searchParams]);

  // Close dropdowns on click outside
  useEffect(() => {
    if (!catOpen && !sortOpen && !filterOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (catOpen && catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
      if (sortOpen && sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
      if (filterOpen && filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [catOpen, sortOpen, filterOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(params.toString() ? `/productos?${params.toString()}` : "/productos");
    },
    [router, searchParams],
  );

  function closeAll() {
    setCatOpen(false);
    setFilterOpen(false);
    setSortOpen(false);
    setSearchOpen(false);
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

  const activeCatLabel = categories.find((c) => c.slug === activeCategory)?.name ?? "Categoría";
  const activeFilterLabel = filterOptions.find((o) => o.value === activeFilter)?.label ?? "Filtro";
  const currentSortLabel = sortOptions.find((o) => o.value === activeSort)?.label ?? "Orden";

  const hasActiveSearch = !!searchParams.get("search");
  const hasAnyFilter = !!activeFilter || hasActiveSearch || !!activeCategory;

  return (
    <div
      className="lg:hidden sticky z-30"
      style={{
        top: "64px",
        background: "var(--beige)",
        borderBottom: "1px solid rgba(115, 96, 2, 0.08)",
      }}
    >
      {/* ── Barra principal ── */}
      <div
        className="page-px flex items-center gap-1.5 overflow-visible"
        style={{ height: "52px" }}
      >
        {/* Botón buscar */}
        <button
          onClick={() => { setSearchOpen(!searchOpen); setCatOpen(false); setSortOpen(false); setFilterOpen(false); }}
          className={cx(
            "flex shrink-0 items-center justify-center rounded-full border transition-all duration-200",
            hasActiveSearch || searchOpen
              ? "border-moss/80 bg-moss text-white shadow-sm"
              : "border-border/80 bg-white/80 text-text-light hover:border-moss/30 hover:text-text-mid",
          )}
          style={{ width: "36px", height: "36px" }}
          aria-label="Buscar"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>
        </button>

        {/* Separador */}
        <div style={{ width: "1px", height: "18px", background: "rgba(115,96,2,0.1)", flexShrink: 0 }} />

        {/* Dropdown de categoría */}
        <div ref={catRef} className="relative shrink-0 flex-1 min-w-0 max-w-[130px]">
          <button
            onClick={() => { setCatOpen(!catOpen); setSortOpen(false); setSearchOpen(false); setFilterOpen(false); }}
            className={cx(
              "w-full flex items-center justify-between gap-1.5 rounded-full border transition-all duration-200",
              activeCategory || catOpen
                ? "border-moss/80 bg-moss text-white shadow-sm"
                : "border-border/80 bg-white/80 text-text-light hover:border-moss/30 hover:text-text-mid",
            )}
            style={{ height: "36px", paddingInline: "12px", fontSize: "12px", fontWeight: 500 }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeCategory ? activeCatLabel : "Categoría"}
            </span>
            <svg
              width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              style={{ flexShrink: 0, transition: "transform 200ms", transform: catOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Category dropdown menu */}
          {catOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setCatOpen(false)} />
              <div
                className="absolute left-0 top-full z-50 overflow-hidden rounded-xl border border-border/60 bg-white shadow-xl"
                style={{
                  marginTop: "8px",
                  minWidth: "200px",
                  maxHeight: "320px",
                  overflowY: "auto",
                  animation: "mobileFilterDropIn 200ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div style={{ padding: "4px" }}>
                  <button
                    onClick={() => { updateParam("cat", ""); setCatOpen(false); }}
                    className="flex w-full items-center gap-2.5 rounded-lg text-left transition-colors duration-150"
                    style={{
                      padding: "10px 14px",
                      fontSize: "13px",
                      fontWeight: !activeCategory ? 600 : 400,
                      color: !activeCategory ? "var(--text)" : "var(--text-mid)",
                      background: !activeCategory ? "var(--beige)" : "transparent",
                    }}
                  >
                    <span style={{ width: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {!activeCategory && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--moss)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    Todas
                  </button>

                  <div style={{ height: "1px", background: "rgba(115,96,2,0.06)", margin: "2px 14px" }} />

                  {categories.map((cat) => {
                    const isActive = activeCategory === cat.slug;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { updateParam("cat", cat.slug); setCatOpen(false); }}
                        className="flex w-full items-center gap-2.5 rounded-lg text-left transition-colors duration-150"
                        style={{
                          padding: "10px 14px",
                          fontSize: "13px",
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? "var(--text)" : "var(--text-mid)",
                          background: isActive ? "var(--beige)" : "transparent",
                        }}
                      >
                        <span style={{ width: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {isActive && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--moss)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Dropdown de Filtro */}
        <div ref={filterRef} className="relative shrink-0 flex-1 min-w-0 max-w-[100px]">
          <button
            onClick={() => { setFilterOpen(!filterOpen); setCatOpen(false); setSortOpen(false); setSearchOpen(false); }}
            className={cx(
              "w-full flex items-center justify-between gap-1.5 rounded-full border transition-all duration-200",
              activeFilter || filterOpen
                ? "border-moss/80 bg-moss text-white shadow-sm"
                : "border-border/80 bg-white/80 text-text-light hover:border-moss/30 hover:text-text-mid",
            )}
            style={{ height: "36px", paddingInline: "12px", fontSize: "12px", fontWeight: 500 }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeFilter ? activeFilterLabel : "Filtro"}
            </span>
            <svg
              width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              style={{ flexShrink: 0, transition: "transform 200ms", transform: filterOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Filter dropdown menu */}
          {filterOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full z-50 overflow-hidden rounded-xl border border-border/60 bg-white shadow-xl"
                style={{ marginTop: "8px", minWidth: "160px", animation: "mobileFilterDropIn 200ms cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                <div style={{ padding: "4px" }}>
                  <button
                    onClick={() => { updateParam("filter", ""); setFilterOpen(false); }}
                    className="flex w-full items-center gap-2.5 rounded-lg text-left transition-colors duration-150"
                    style={{
                      padding: "10px 14px",
                      fontSize: "13px",
                      fontWeight: !activeFilter ? 600 : 400,
                      color: !activeFilter ? "var(--text)" : "var(--text-mid)",
                      background: !activeFilter ? "var(--beige)" : "transparent",
                    }}
                  >
                    <span style={{ width: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {!activeFilter && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--moss)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    Todos
                  </button>

                  <div style={{ height: "1px", background: "rgba(115,96,2,0.06)", margin: "2px 14px" }} />

                  {filterOptions.map((opt) => {
                    const isActive = activeFilter === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => { updateParam("filter", opt.value); setFilterOpen(false); }}
                        className="flex w-full items-center gap-2.5 rounded-lg text-left transition-colors duration-150"
                        style={{
                          padding: "10px 14px",
                          fontSize: "13px",
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? "var(--text)" : "var(--text-mid)",
                          background: isActive ? "var(--beige)" : "transparent",
                        }}
                      >
                        <span style={{ width: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {isActive && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--moss)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sort dropdown */}
        <div ref={sortRef} className="relative shrink-0 flex-1 min-w-0 max-w-[100px]">
          <button
            onClick={() => { setSortOpen(!sortOpen); setCatOpen(false); setFilterOpen(false); setSearchOpen(false); }}
            className={cx(
              "w-full flex items-center justify-between gap-1.5 rounded-full border transition-all duration-200",
              sortOpen
                ? "border-moss/50 bg-white text-text shadow-sm"
                : "border-border/80 bg-white/80 text-text-light hover:border-moss/30 hover:text-text-mid",
            )}
            style={{ height: "36px", paddingInline: "12px", fontSize: "12px", fontWeight: 500 }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeSort ? currentSortLabel : "Orden"}
            </span>
            <svg
              width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              style={{ flexShrink: 0, transition: "transform 200ms", transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Sort dropdown menu */}
          {sortOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
              <div
                className="absolute right-0 top-full z-50 overflow-hidden rounded-xl border border-border/60 bg-white shadow-xl"
                style={{ marginTop: "8px", minWidth: "180px", animation: "mobileFilterDropIn 200ms cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                <div style={{ padding: "4px" }}>
                  {sortOptions.map((opt) => {
                    const isActive = activeSort === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => { updateParam("sort", opt.value); setSortOpen(false); }}
                        className="flex w-full items-center gap-2.5 rounded-lg text-left transition-colors duration-150"
                        style={{
                          padding: "10px 14px",
                          fontSize: "13px",
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? "var(--text)" : "var(--text-mid)",
                          background: isActive ? "var(--beige)" : "transparent",
                        }}
                      >
                        <span style={{ width: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {isActive && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--moss)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Limpiar + Contador */}
        <div className="shrink-0 flex items-center gap-1" style={{ marginLeft: "auto" }}>
          {hasAnyFilter && (
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("filter");
                params.delete("search");
                params.delete("cat");
                params.delete("page");
                router.push(params.toString() ? `/productos?${params.toString()}` : "/productos");
                closeAll();
                setSearchInput("");
              }}
              className="flex items-center justify-center rounded-full text-text-light hover:text-text transition-colors"
              style={{ width: "20px", height: "20px" }}
              aria-label="Limpiar filtros"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          )}
          <span style={{ fontSize: "11px", color: "var(--text-light)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
            {totalResults}
          </span>
        </div>
      </div>

      {/* ── Barra de búsqueda expandible ── */}
      <div
        style={{
          overflow: "hidden",
          transition: "max-height 250ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease",
          maxHeight: searchOpen ? "56px" : "0px",
          opacity: searchOpen ? 1 : 0,
        }}
      >
        <form
          onSubmit={handleSearch}
          className="page-px flex items-center gap-2"
          style={{ paddingBottom: "12px" }}
        >
          <div className="relative flex-1">
            <input
              ref={searchInputRef}
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Título, autor..."
              style={{
                width: "100%",
                height: "38px",
                borderRadius: "999px",
                border: "1px solid rgba(115,96,2,0.12)",
                background: "var(--white)",
                paddingLeft: "16px",
                paddingRight: searchInput ? "36px" : "16px",
                fontSize: "13px",
                color: "var(--text)",
                outline: "none",
                transition: "border-color 200ms",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--moss)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(115,96,2,0.12)"; }}
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ right: "12px", color: "var(--text-light)", opacity: 0.5 }}
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
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "999px",
              background: "var(--moss)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: "none",
              cursor: "pointer",
            }}
            aria-label="Buscar"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" />
            </svg>
          </button>
        </form>
      </div>

      {/* Keyframe for dropdown animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes mobileFilterDropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      ` }} />
    </div>
  );
}
