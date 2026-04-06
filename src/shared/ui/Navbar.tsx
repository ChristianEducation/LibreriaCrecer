"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "class-variance-authority";

import { useCartSummary } from "@/features/carrito/hooks";
import { useCartHydration } from "@/features/carrito/useCartHydration";

import { CartPanel } from "./CartPanel";

function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cx("relative block h-7 w-7", className)}>
      <span className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-gold" />
      <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-gold" />
    </span>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m16 16 4.25 4.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg aria-hidden="true" className="size-[22px]" fill="none" viewBox="0 0 24 24">
      <path
        d="M3.75 5.25h1.7c.39 0 .73.27.82.65l1.48 6.35c.09.38.43.65.82.65h7.82c.39 0 .73-.26.82-.63l1.35-5.41H7.06"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle cx="9.75" cy="18.25" r="1.25" fill="currentColor" />
      <circle cx="17.25" cy="18.25" r="1.25" fill="currentColor" />
    </svg>
  );
}

const navLinksAfterCategories = [
  { href: "/#libros-mes", label: "Selección del mes" },
  { href: "/#recien-llegados", label: "Recién llegados" },
] as const;

export interface NavbarProps {
  categories?: { id: string; name: string; slug: string }[];
  variant?: "default" | "checkout";
}

export function Navbar({ categories = [], variant = "default" }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const hydrated = useCartHydration();
  const { totalItems } = useCartSummary();
  const categoriesRef = useRef<HTMLLIElement | null>(null);
  const categoriesCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safeTotalItems = hydrated ? totalItems : 0;

  function handleCategoriesMouseEnter() {
    if (categoriesCloseTimeout.current) {
      clearTimeout(categoriesCloseTimeout.current);
      categoriesCloseTimeout.current = null;
    }
    setIsCategoriesOpen(true);
  }

  function handleCategoriesMouseLeave() {
    categoriesCloseTimeout.current = setTimeout(() => {
      setIsCategoriesOpen(false);
    }, 150);
  }

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 40);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCategoriesOpen(false);
        setIsCartOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!categoriesRef.current?.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    setIsCartOpen(false);
    setIsCategoriesOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cx(
          "sticky top-0 z-[100] border-b border-border bg-[color-mix(in_srgb,var(--beige)_95%,transparent)] backdrop-blur-xl transition-shadow duration-300",
          isScrolled ? "shadow-[0_2px_24px_rgba(58,48,1,0.08)]" : "",
        )}
      >
        <div className="page-px flex h-16 items-center justify-between gap-5">
          <Link className="flex shrink-0 items-center gap-[10px]" href="/">
            <BrandMark />
            <span className="flex flex-col">
              <span className="font-serif text-[18px] font-medium text-moss">Crecer Libreria</span>
              <span className="text-[9px] uppercase tracking-[0.22em] text-gold">Libreria cristiana</span>
            </span>
          </Link>

          {variant === "checkout" ? (
            <Link
              className="ml-auto text-sm font-light text-text-light transition-colors hover:text-moss"
              href="/carrito"
            >
              ← Volver al carrito
            </Link>
          ) : (
            <>
              <div className="relative hidden w-full max-w-[420px] flex-1 lg:block">
                <input
                  className="h-10 w-full rounded border border-border bg-beige-warm py-2 pl-4 pr-10 text-[14px] text-text transition-[border-color,background-color] duration-200 placeholder:text-text-light focus:border-gold focus:bg-white focus:outline-none"
                  placeholder="Buscar libros, autores..."
                  type="search"
                />
                <button
                  aria-label="Buscar"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light transition-colors hover:text-moss"
                  type="button"
                >
                  <SearchIcon />
                </button>
              </div>

              <nav className="flex items-center gap-7">
                <Link
                  className={cx(
                    "text-[13px] tracking-[0.04em] transition-colors hover:text-moss",
                    pathname === "/productos" || pathname.startsWith("/productos/") ? "font-medium text-moss" : "text-text-mid",
                  )}
                  href="/productos"
                >
                  Colección
                </Link>

                <li
                  style={{ position: "relative", listStyle: "none" }}
                  onMouseEnter={handleCategoriesMouseEnter}
                  onMouseLeave={handleCategoriesMouseLeave}
                  ref={categoriesRef}
                >
                  <button
                    className={cx(
                      "text-[13px] tracking-[0.04em] transition-colors hover:text-moss",
                      pathname.startsWith("/productos") ? "font-medium text-moss" : "text-text-mid",
                    )}
                    onClick={() => setIsCategoriesOpen((current) => !current)}
                    type="button"
                  >
                    Categorías
                  </button>

                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      marginTop: "10px",
                      minWidth: "230px",
                      padding: "10px 0",
                      background: "rgba(242,239,223,0.98)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "2px",
                      boxShadow: "0 16px 40px rgba(58,48,1,0.12)",
                      opacity: isCategoriesOpen ? 1 : 0,
                      transform: isCategoriesOpen ? "translateY(0)" : "translateY(-8px)",
                      visibility: isCategoriesOpen ? "visible" : "hidden",
                      pointerEvents: isCategoriesOpen ? "auto" : "none",
                      transition: "opacity 0.2s ease, transform 0.2s ease",
                      zIndex: 10,
                    }}
                  >
                    <Link
                      href="/productos"
                      style={{ display: "block", padding: "9px 18px", fontSize: "13px", color: "var(--color-moss)", textDecoration: "none", transition: "background 0.15s" }}
                      className="hover:bg-beige-warm"
                    >
                      Ver toda la colección
                    </Link>
                    {categories.map((category) => (
                      <Link
                        href={`/productos?cat=${category.slug}`}
                        key={category.id}
                        style={{ display: "block", padding: "9px 18px", fontSize: "13px", color: "var(--color-moss)", textDecoration: "none", transition: "background 0.15s" }}
                        className="hover:bg-beige-warm"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </li>

                {navLinksAfterCategories.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                  return (
                    <Link
                      className={cx(
                        "text-[13px] tracking-[0.04em] transition-colors hover:text-moss",
                        isActive ? "font-medium text-moss" : "text-text-mid",
                      )}
                      href={link.href}
                      key={link.href}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <button
                aria-expanded={isCartOpen}
                className="relative flex shrink-0 items-center gap-1.5 text-moss transition-opacity hover:opacity-70"
                onClick={() => setIsCartOpen((current) => !current)}
                type="button"
              >
                <CartIcon />
                {safeTotalItems > 0 && (
                  <span
                    className="flex size-4 items-center justify-center rounded-full bg-gold text-[9px] font-semibold text-white"
                  >
                    {safeTotalItems}
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </header>

      {variant === "default" ? <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> : null}
    </>
  );
}
