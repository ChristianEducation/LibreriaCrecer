"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cx } from "class-variance-authority";

import { useCartSummary } from "@/features/carrito/hooks";
import { useCartHydration } from "@/features/carrito/useCartHydration";

import { CartPanel } from "./CartPanel";
import { Logo } from "./Logo";

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

function HamburgerIcon() {
  return (
    <svg aria-hidden="true" className="size-[22px]" fill="none" viewBox="0 0 24 24">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="size-[20px]" fill="none" viewBox="0 0 24 24">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="size-[14px]"
      fill="none"
      viewBox="0 0 24 24"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
      }}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

const navLinksAfterCategories = [
  { href: "/productos?filter=seleccion", label: "Selección del mes" },
  { href: "/productos?filter=nuevo", label: "Recién llegados" },
] as const;

export interface NavbarProps {
  categories?: { id: string; name: string; slug: string }[];
  variant?: "default" | "checkout";
}

export function Navbar({ categories = [], variant = "default" }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
        setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Scroll lock when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setSearchQuery("");
    setIsMobileMenuOpen(false);
    router.push(`/productos?search=${encodeURIComponent(trimmed)}`);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled && variant === "default";

  return (
    <>
      <header
        className={cx(
          "z-[100] transition-[background-color,box-shadow,border-color] duration-300",
          isHome ? "fixed inset-x-0 top-0" : "sticky top-0",
          isTransparent
            ? "border-b border-transparent bg-transparent"
            : "border-b border-border bg-[color-mix(in_srgb,var(--beige)_95%,transparent)] backdrop-blur-xl",
          isScrolled && !isTransparent ? "shadow-[0_2px_24px_rgba(58,48,1,0.08)]" : "",
        )}
      >
        <div className="page-px flex h-16 items-center justify-between gap-5">
          <Link className="flex shrink-0 items-center gap-[10px]" href="/">
            <Logo size="navbar" />
            <span className="flex flex-col">
              <span
                className={cx(
                  "font-serif text-[18px] font-medium transition-colors",
                  isTransparent ? "text-white" : "text-moss",
                )}
              >
                Crecer Libreria
              </span>
              <span
                className={cx(
                  "text-[9px] uppercase tracking-[0.22em] transition-colors",
                  isTransparent ? "text-white/80" : "text-gold",
                )}
              >
                Libreria cristiana
              </span>
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
              {/* Desktop search */}
              <form
                className="relative hidden flex-1 lg:block"
                style={{ maxWidth: "300px" }}
                onSubmit={handleSearch}
              >
                <input
                  className={cx(
                    "h-10 w-full rounded border py-2 pl-4 pr-10 text-[14px] transition-[border-color,background-color,color] duration-200 focus:outline-none",
                    isTransparent
                      ? "border-white/30 bg-white/10 text-white placeholder:text-white/60 focus:border-white/60 focus:bg-white/15"
                      : "border-border bg-beige-warm text-text placeholder:text-text-light focus:border-gold focus:bg-white",
                  )}
                  placeholder="Buscar libros, autores..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  aria-label="Buscar"
                  className={cx(
                    "absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
                    isTransparent ? "text-white/80 hover:text-white" : "text-text-light hover:text-moss",
                  )}
                  type="submit"
                >
                  <SearchIcon />
                </button>
              </form>

              {/* Desktop nav — hidden on mobile */}
              <nav className="hidden items-center gap-7 lg:flex">
                <Link
                  className={cx(
                    "text-[13px] tracking-[0.04em] transition-colors",
                    isTransparent
                      ? "text-white/85 hover:text-white"
                      : pathname === "/productos" || pathname.startsWith("/productos/")
                        ? "font-medium text-moss"
                        : "text-text-mid hover:text-moss",
                  )}
                  href="/productos"
                >
                  Colección
                </Link>

                <Link
                  className={cx(
                    "text-[13px] tracking-[0.04em] transition-colors",
                    isTransparent
                      ? "text-white/85 hover:text-white"
                      : pathname === "/nosotros"
                        ? "font-medium text-moss"
                        : "text-text-mid hover:text-moss",
                  )}
                  href="/nosotros"
                >
                  Conócenos
                </Link>

                <li
                  style={{ position: "relative", listStyle: "none" }}
                  onMouseEnter={handleCategoriesMouseEnter}
                  onMouseLeave={handleCategoriesMouseLeave}
                  ref={categoriesRef}
                >
                  <button
                    className={cx(
                      "text-[13px] tracking-[0.04em] transition-colors",
                      isTransparent
                        ? "text-white/85 hover:text-white"
                        : pathname.startsWith("/productos")
                          ? "font-medium text-moss"
                          : "text-text-mid hover:text-moss",
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
                        "text-[13px] tracking-[0.04em] transition-colors",
                        isTransparent
                          ? "text-white/85 hover:text-white"
                          : isActive
                            ? "font-medium text-moss"
                            : "text-text-mid hover:text-moss",
                      )}
                      href={link.href}
                      key={link.href}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Right side: cart + hamburger */}
              <div className="flex shrink-0 items-center gap-3">
                <button
                  aria-expanded={isCartOpen}
                  className={cx(
                    "relative flex items-center gap-1.5 transition-opacity hover:opacity-70",
                    isTransparent ? "text-white" : "text-moss",
                  )}
                  onClick={() => setIsCartOpen((current) => !current)}
                  type="button"
                >
                  <CartIcon />
                  {safeTotalItems > 0 && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-gold text-[9px] font-semibold text-white">
                      {safeTotalItems}
                    </span>
                  )}
                </button>

                {/* Hamburger — mobile only */}
                <button
                  aria-expanded={isMobileMenuOpen}
                  aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                  className={cx(
                    "flex items-center justify-center transition-opacity hover:opacity-70 lg:hidden",
                    isTransparent ? "text-white" : "text-moss",
                  )}
                  onClick={() => setIsMobileMenuOpen((current) => !current)}
                  type="button"
                >
                  {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Mobile menu drawer — hidden on desktop */}
      {variant === "default" && (
        <>
          {/* Backdrop */}
          <div
            aria-hidden="true"
            className="lg:hidden"
            onClick={closeMobileMenu}
            style={{
              position: "fixed",
              inset: 0,
              top: "64px",
              zIndex: 98,
              background: "rgba(58,48,1,0.35)",
              backdropFilter: "blur(2px)",
              opacity: isMobileMenuOpen ? 1 : 0,
              visibility: isMobileMenuOpen ? "visible" : "hidden",
              transition: "opacity 0.25s ease, visibility 0.25s ease",
            }}
          />

          {/* Drawer panel */}
          <div
            className="lg:hidden"
            style={{
              position: "fixed",
              top: "64px",
              left: 0,
              right: 0,
              zIndex: 99,
              background: "rgba(245,243,232,0.98)",
              backdropFilter: "blur(16px)",
              borderBottom: "1px solid var(--color-border)",
              boxShadow: "0 12px 40px rgba(58,48,1,0.12)",
              maxHeight: "calc(100vh - 64px)",
              overflowY: "auto",
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? "translateY(0)" : "translateY(-12px)",
              visibility: isMobileMenuOpen ? "visible" : "hidden",
              transition: "opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease",
            }}
          >
            <div style={{ padding: "20px 0 32px" }}>
              {/* Search */}
              <div style={{ padding: "0 20px 20px" }}>
                <form onSubmit={handleSearch} style={{ position: "relative" }}>
                  <input
                    className="w-full rounded border border-border bg-beige-warm py-3 pl-4 pr-10 text-[14px] text-text transition-[border-color,background-color] duration-200 placeholder:text-text-light focus:border-gold focus:bg-white focus:outline-none"
                    placeholder="Buscar libros, autores..."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    aria-label="Buscar"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light transition-colors hover:text-moss"
                    type="submit"
                  >
                    <SearchIcon />
                  </button>
                </form>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "var(--color-border)", marginBottom: "8px" }} />

              {/* Nav links */}
              <nav>
                {/* Colección */}
                <Link
                  href="/productos"
                  onClick={closeMobileMenu}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "14px 20px",
                    fontSize: "15px",
                    color: pathname === "/productos" || pathname.startsWith("/productos/") ? "var(--color-moss)" : "var(--color-text-mid)",
                    fontWeight: pathname === "/productos" || pathname.startsWith("/productos/") ? 500 : 300,
                    textDecoration: "none",
                    borderBottom: "1px solid var(--color-border)",
                    transition: "color 0.15s",
                  }}
                >
                  Colección
                </Link>

                {/* Conócenos */}
                <Link
                  href="/nosotros"
                  onClick={closeMobileMenu}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "14px 20px",
                    fontSize: "15px",
                    color: pathname === "/nosotros" ? "var(--color-moss)" : "var(--color-text-mid)",
                    fontWeight: pathname === "/nosotros" ? 500 : 300,
                    textDecoration: "none",
                    borderBottom: "1px solid var(--color-border)",
                    transition: "color 0.15s",
                  }}
                >
                  Conócenos
                </Link>

                {/* Categorías — accordion */}
                <div style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <button
                    onClick={() => setIsMobileCategoriesOpen((current) => !current)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "14px 20px",
                      fontSize: "15px",
                      color: "var(--color-text-mid)",
                      fontWeight: 300,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    type="button"
                  >
                    <span>Categorías</span>
                    <ChevronDownIcon open={isMobileCategoriesOpen} />
                  </button>

                  {/* Category list */}
                  <div
                    style={{
                      overflow: "hidden",
                      maxHeight: isMobileCategoriesOpen ? "400px" : "0",
                      transition: "max-height 0.3s ease",
                    }}
                  >
                    <Link
                      href="/productos"
                      onClick={closeMobileMenu}
                      style={{
                        display: "block",
                        padding: "11px 20px 11px 36px",
                        fontSize: "13px",
                        color: "var(--color-moss)",
                        textDecoration: "none",
                        borderTop: "1px solid var(--color-border)",
                        fontWeight: 500,
                      }}
                    >
                      Ver toda la colección
                    </Link>
                    {categories.map((category) => (
                      <Link
                        href={`/productos?cat=${category.slug}`}
                        key={category.id}
                        onClick={closeMobileMenu}
                        style={{
                          display: "block",
                          padding: "11px 20px 11px 36px",
                          fontSize: "13px",
                          color: "var(--color-text-mid)",
                          textDecoration: "none",
                          borderTop: "1px solid var(--color-border)",
                        }}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Remaining links */}
                {navLinksAfterCategories.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    onClick={closeMobileMenu}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "14px 20px",
                      fontSize: "15px",
                      color: "var(--color-text-mid)",
                      fontWeight: 300,
                      textDecoration: "none",
                      borderBottom: "1px solid var(--color-border)",
                      transition: "color 0.15s",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}

      {variant === "default" ? <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> : null}
    </>
  );
}
