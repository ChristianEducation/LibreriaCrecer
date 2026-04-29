"use client";

import type { CSSProperties, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cx } from "class-variance-authority";

type ProductSuggestion = {
  id: string;
  title: string;
  slug: string;
};

type ProductsResponse = {
  data?: unknown;
};

export interface NavbarSearchProps {
  enabled?: boolean;
  inputClassName?: string;
  inputStyle?: CSSProperties;
  isTransparent?: boolean;
  onNavigate?: () => void;
  onSearch: (query: string) => void;
  onValueChange: (value: string) => void;
  placeholder?: string;
  value: string;
  variant?: "desktop" | "mobile";
}

function SearchIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m16 16 4.25 4.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function isProductSuggestion(value: unknown): value is ProductSuggestion {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.slug === "string"
  );
}

function parseProductSuggestions(payload: ProductsResponse): ProductSuggestion[] {
  if (!Array.isArray(payload.data)) return [];

  const seenIds = new Set<string>();
  const suggestions: ProductSuggestion[] = [];

  for (const item of payload.data) {
    if (!isProductSuggestion(item) || seenIds.has(item.id)) continue;
    seenIds.add(item.id);
    suggestions.push({
      id: item.id,
      title: item.title,
      slug: item.slug,
    });
  }

  return suggestions;
}

export function NavbarSearch({
  enabled = true,
  inputClassName,
  inputStyle,
  isTransparent = false,
  onNavigate,
  onSearch,
  onValueChange,
  placeholder = "Buscar libros, autores...",
  value,
  variant = "desktop",
}: NavbarSearchProps) {
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLFormElement | null>(null);
  const trimmedValue = value.trim();
  const shouldSearch = enabled && trimmedValue.length >= 2;
  const isMobile = variant === "mobile";

  useEffect(() => {
    if (!shouldSearch) {
      setSuggestions([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setIsLoading(true);
      setIsOpen(true);

      fetch(`/api/productos?search=${encodeURIComponent(trimmedValue)}&limit=8`, {
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) throw new Error("No se pudo buscar productos.");
          return response.json() as Promise<ProductsResponse>;
        })
        .then((payload) => {
          setSuggestions(parseProductSuggestions(payload));
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          setSuggestions([]);
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        });
    }, 280);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [shouldSearch, trimmedValue]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!trimmedValue) return;
    setIsOpen(false);
    onSearch(trimmedValue);
  }

  function handleSuggestionClick() {
    setIsOpen(false);
    onNavigate?.();
  }

  const hasDropdown = isOpen && shouldSearch;

  return (
    <form
      className={cx("relative", isMobile ? "" : "hidden flex-1 lg:block")}
      onSubmit={handleSubmit}
      ref={searchRef}
      style={isMobile ? { position: "relative" } : { maxWidth: "300px", borderRadius: "var(--radius-xl)" }}
    >
      <input
        className={inputClassName}
        onChange={(event) => onValueChange(event.target.value)}
        onFocus={() => {
          if (shouldSearch) setIsOpen(true);
        }}
        placeholder={placeholder}
        style={inputStyle}
        type="search"
        value={value}
      />
      <button
        aria-label="Buscar"
        className={cx(
          "absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
          isMobile
            ? "text-text-light hover:text-moss"
            : isTransparent
              ? "text-white/80 hover:text-white"
              : "text-text-light hover:text-moss",
        )}
        type="submit"
      >
        <SearchIcon />
      </button>

      <div
        style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          left: 0,
          right: 0,
          minWidth: isMobile ? "100%" : "300px",
          padding: "8px 0",
          background: "rgba(242,239,223,0.98)",
          backdropFilter: "blur(16px)",
          border: "1px solid var(--color-border)",
          borderRadius: "2px",
          boxShadow: "0 16px 40px rgba(58,48,1,0.12)",
          opacity: hasDropdown ? 1 : 0,
          transform: hasDropdown ? "translateY(0)" : "translateY(-8px)",
          visibility: hasDropdown ? "visible" : "hidden",
          pointerEvents: hasDropdown ? "auto" : "none",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          zIndex: 120,
        }}
      >
        {isLoading ? (
          <p style={{ padding: "9px 18px", fontSize: "13px", color: "var(--color-text-light)" }}>
            Buscando...
          </p>
        ) : suggestions.length > 0 ? (
          suggestions.map((product) => (
            <Link
              className="hover:bg-beige-warm"
              href={`/productos/${product.slug}`}
              key={product.id}
              onClick={handleSuggestionClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 18px",
                fontSize: "13px",
                color: "var(--color-moss)",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
            >
              <SearchIcon className="size-[13px] shrink-0" />
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {product.title}
              </span>
            </Link>
          ))
        ) : (
          <p style={{ padding: "9px 18px", fontSize: "13px", color: "var(--color-text-light)" }}>
            Sin resultados
          </p>
        )}
      </div>
    </form>
  );
}
