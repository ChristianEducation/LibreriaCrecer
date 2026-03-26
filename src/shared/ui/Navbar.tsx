"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

const navLinks = [
  { href: "/productos", label: "Colección" },
  { href: "/#categorias", label: "Categorías" },
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
  const safeTotalItems = hydrated ? totalItems : 0;

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

  const categoriesLabel = useMemo(() => {
    return categories.length > 0 ? "Categorias" : "Coleccion";
  }, [categories.length]);

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
                {navLinks.map((link) => {
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

                <li
                  className="relative list-none"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
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
                    {categoriesLabel}
                  </button>

                  <div
                    className={cx(
                      "absolute top-full mt-[10px] min-w-[230px] translate-y-[-8px] rounded border border-border bg-[color-mix(in_srgb,var(--beige)_98%,transparent)] py-[10px] opacity-0 shadow-[0_16px_40px_rgba(58,48,1,0.12)] backdrop-blur-xl transition-all duration-200",
                      isCategoriesOpen ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none",
                    )}
                  >
                    <Link
                      className="block px-[18px] py-[9px] text-[13px] text-text-mid transition-colors hover:bg-beige-warm hover:text-moss"
                      href="/productos"
                    >
                      Ver toda la coleccion
                    </Link>
                    {categories.map((category) => (
                      <Link
                        className="block px-[18px] py-[9px] text-[13px] text-text-mid transition-colors hover:bg-beige-warm hover:text-moss"
                        href={`/productos?cat=${category.slug}`}
                        key={category.id}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </li>
              </nav>

              <button
                aria-expanded={isCartOpen}
                className="relative flex shrink-0 items-center gap-1.5 text-moss transition-opacity hover:opacity-70"
                onClick={() => setIsCartOpen((current) => !current)}
                type="button"
              >
                <CartIcon />
                <span
                  className="flex size-4 items-center justify-center rounded-full bg-gold text-[9px] font-semibold text-white"
                >
                  {safeTotalItems}
                </span>
              </button>
            </>
          )}
        </div>
      </header>

      {variant === "default" ? <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> : null}
    </>
  );
}
