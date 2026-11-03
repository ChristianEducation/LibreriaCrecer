"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cx } from "class-variance-authority";

import { useCartSummary } from "@/features/carrito/hooks";
import { useCartHydration } from "@/features/carrito/useCartHydration";
import { getCategoryImage } from "@/shared/config/category-images";

import { CartPanel } from "./CartPanel";
import { NavbarSearch } from "./NavbarSearch";

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
  // `isNew` muestra un puntito dorado de novedad; quitarlo pasadas unas semanas.
  { href: "/regalos", label: "Regalos", isNew: true },
  { href: "/productos?filter=seleccion", label: "Selección del mes" },
  { href: "/productos?filter=nuevo", label: "Recién llegados" },
  { href: "/nosotros", label: "Conócenos" },
] as const;

export interface NavbarProps {
  categories?: { id: string; name: string; slug: string; imageUrl?: string | null }[];
  giftOccasions?: { slug: string; label: string; imageUrl: string | null }[];
  variant?: "default" | "checkout";
}

export function Navbar({ categories = [], giftOccasions = [], variant = "default" }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isGiftsOpen, setIsGiftsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const hydrated = useCartHydration();
  const { totalItems } = useCartSummary();
  const categoriesRef = useRef<HTMLLIElement | null>(null);
  const categoriesCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const giftsRef = useRef<HTMLLIElement | null>(null);
  const giftsCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleGiftsMouseEnter() {
    if (giftsCloseTimeout.current) {
      clearTimeout(giftsCloseTimeout.current);
      giftsCloseTimeout.current = null;
    }
    setIsCategoriesOpen(false);
    setIsGiftsOpen(true);
  }

  function handleGiftsMouseLeave() {
    giftsCloseTimeout.current = setTimeout(() => {
      setIsGiftsOpen(false);
    }, 150);
  }

  function handleCategoriesMouseEnter() {
    if (categoriesCloseTimeout.current) {
      clearTimeout(categoriesCloseTimeout.current);
      categoriesCloseTimeout.current = null;
    }
    setIsGiftsOpen(false);
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
        setIsGiftsOpen(false);
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
      if (!giftsRef.current?.contains(event.target as Node)) {
        setIsGiftsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    setIsCartOpen(false);
    setIsCategoriesOpen(false);
    setIsGiftsOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Scroll lock when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  function handleSearch(query: string) {
    const trimmed = query.trim();
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
        data-solid={!isTransparent}
        className={cx(
          "site-navbar z-[100] sticky top-0 transition-[background-color,box-shadow,border-color] duration-300",
          isTransparent
            ? "border-b border-transparent bg-transparent"
            : "border-b border-border bg-[color-mix(in_srgb,var(--beige)_95%,transparent)] backdrop-blur-xl",
          isScrolled && !isTransparent ? "shadow-[0_2px_24px_rgba(58,48,1,0.08)]" : "",
        )}
      >
        <div className="storefront-container page-px flex h-16 items-center justify-between gap-5">
          <Link className="flex shrink-0 items-center gap-[10px]" href="/">
            <Image
                src="/images/Logo-Crecer.png"
                alt="Crecer Librería"
                width={44}
                height={44}
                style={{ objectFit: "contain" }}
              />
            <span className="flex flex-col">
              <span
                className={cx(
                  "font-serif font-medium transition-colors",
                  isTransparent ? "text-white" : "text-moss",
                )}
                style={{ fontSize: "16px" }}
              >
                Crecer Librería
              </span>
              <span
                className={cx(
                  "uppercase tracking-[0.22em] transition-colors",
                  isTransparent ? "text-white/80" : "text-gold",
                )}
                style={{ fontSize: "11px", textAlign: "center", width: "100%", marginTop: "-2px", fontWeight: 600 }}
              >
                C A T Ó L I C A
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
              <NavbarSearch
                inputClassName={cx(
                    "h-10 w-full border text-[14px] transition-[border-color,background-color,color] duration-200 focus:outline-none",
                    isTransparent
                      ? "border-white/30 bg-white/10 text-white placeholder:text-white/60 focus:border-white/60 focus:bg-white/15"
                      : "border-border bg-beige-warm text-text placeholder:text-text-light focus:border-gold focus:bg-white",
                )}
                inputStyle={{ paddingLeft: "16px", paddingRight: "16px", borderRadius: "var(--radius-xl)" }}
                isTransparent={isTransparent}
                onSearch={handleSearch}
                onValueChange={setSearchQuery}
                value={searchQuery}
              />

              {/* Desktop nav — hidden on mobile */}
              <nav className="hidden items-center gap-5 lg:flex">
                <Link
                  className={cx(
                    "site-nav-link text-[13px] tracking-[0.04em] transition-colors",
                    isTransparent
                      ? "text-white/85 hover:text-white"
                      : pathname === "/productos" || pathname.startsWith("/productos/")
                        ? "font-medium text-moss"
                        : "text-text-mid hover:text-moss",
                  )}
                  data-active={pathname === "/productos" || pathname.startsWith("/productos/")}
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
                      "site-nav-link text-[13px] tracking-[0.04em] transition-colors",
                      isTransparent
                        ? "text-white/85 hover:text-white"
                        : pathname.startsWith("/productos")
                          ? "font-medium text-moss"
                          : "text-text-mid hover:text-moss",
                    )}
                    data-active={isCategoriesOpen}
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
                      width: "max-content",
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 190px)",
                      columnGap: "4px",
                      padding: "10px 8px",
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
                      style={{ display: "block", gridColumn: "1 / -1", padding: "9px 14px", marginBottom: "6px", borderBottom: "1px solid var(--color-border)", fontSize: "13px", color: "var(--color-moss)", textDecoration: "none", transition: "background 0.15s" }}
                      className="hover:bg-beige-warm"
                    >
                      Ver toda la colección
                    </Link>
                    {categories.map((category) => {
                      const thumb = getCategoryImage(category.slug, category.imageUrl);

                      return (
                        <Link
                          href={`/productos?cat=${category.slug}`}
                          key={category.id}
                          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 14px", fontSize: "13px", lineHeight: 1.35, color: "var(--color-moss)", textDecoration: "none", transition: "background 0.15s" }}
                          className="hover:bg-beige-warm"
                        >
                          <span aria-hidden="true" className="nav-category-thumb">
                            {thumb ? (
                              <Image alt="" fill sizes="32px" src={thumb} style={{ objectFit: "cover" }} />
                            ) : null}
                          </span>
                          <span>{category.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </li>

                {navLinksAfterCategories.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                  if (link.href === "/regalos" && giftOccasions.length > 0) {
                    return (
                      <li
                        key={link.href}
                        onMouseEnter={handleGiftsMouseEnter}
                        onMouseLeave={handleGiftsMouseLeave}
                        ref={giftsRef}
                        style={{ position: "relative", listStyle: "none" }}
                      >
                        <Link
                          className={cx(
                            "site-nav-link text-[13px] tracking-[0.04em] transition-colors",
                            isTransparent
                              ? "text-white/85 hover:text-white"
                              : isActive
                                ? "font-medium text-moss"
                                : "text-text-mid hover:text-moss",
                          )}
                          data-active={isActive || isGiftsOpen}
                          href={link.href}
                        >
                          {link.label}
                          {"isNew" in link && link.isNew ? <span aria-hidden="true" className="site-nav-dot" /> : null}
                        </Link>

                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            marginTop: "10px",
                            width: "max-content",
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 190px)",
                            columnGap: "4px",
                            padding: "10px 8px",
                            background: "rgba(242,239,223,0.98)",
                            backdropFilter: "blur(16px)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "2px",
                            boxShadow: "0 16px 40px rgba(58,48,1,0.12)",
                            opacity: isGiftsOpen ? 1 : 0,
                            transform: isGiftsOpen ? "translateY(0)" : "translateY(-8px)",
                            visibility: isGiftsOpen ? "visible" : "hidden",
                            pointerEvents: isGiftsOpen ? "auto" : "none",
                            transition: "opacity 0.2s ease, transform 0.2s ease",
                            zIndex: 10,
                          }}
                        >
                          <Link
                            href="/regalos"
                            style={{ display: "block", gridColumn: "1 / -1", padding: "9px 14px", marginBottom: "6px", borderBottom: "1px solid var(--color-border)", fontSize: "13px", color: "var(--color-moss)", textDecoration: "none", transition: "background 0.15s" }}
                            className="hover:bg-beige-warm"
                          >
                            Ver todos los regalos
                          </Link>
                          {giftOccasions.map((occasion) => (
                            <Link
                              href={`/regalos?ocasion=${occasion.slug}`}
                              key={occasion.slug}
                              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 14px", fontSize: "13px", lineHeight: 1.35, color: "var(--color-moss)", textDecoration: "none", transition: "background 0.15s" }}
                              className="hover:bg-beige-warm"
                            >
                              <span aria-hidden="true" className="nav-category-thumb">
                                {occasion.imageUrl ? (
                                  <Image alt="" fill sizes="32px" src={occasion.imageUrl} style={{ objectFit: "cover" }} />
                                ) : null}
                              </span>
                              <span>{occasion.label}</span>
                            </Link>
                          ))}
                        </div>
                      </li>
                    );
                  }

                  return (
                    <Link
                      className={cx(
                        "site-nav-link text-[13px] tracking-[0.04em] transition-colors",
                        isTransparent
                          ? "text-white/85 hover:text-white"
                          : isActive
                            ? "font-medium text-moss"
                            : "text-text-mid hover:text-moss",
                      )}
                      data-active={isActive}
                      href={link.href}
                      key={link.href}
                    >
                      {link.label}
                      {"isNew" in link && link.isNew ? <span aria-hidden="true" className="site-nav-dot" /> : null}
                    </Link>
                  );
                })}
              </nav>

              {/* Right side: cart + hamburger */}
              <div className="flex shrink-0 items-center gap-3">
                <button
                  aria-expanded={isCartOpen}
                  aria-label="Abrir carrito"
                  className="navbar-cart-btn"
                  onClick={() => setIsCartOpen((current) => !current)}
                  type="button"
                >
                  <CartIcon />
                  {hydrated && totalItems > 0 && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: "white",
                        color: "var(--gold)",
                        fontSize: "9px",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {totalItems}
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
                <NavbarSearch
                  enabled={isMobileMenuOpen}
                  inputClassName="w-full rounded border border-border bg-beige-warm py-3 pl-4 pr-10 text-[14px] text-text transition-[border-color,background-color] duration-200 placeholder:text-text-light focus:border-gold focus:bg-white focus:outline-none"
                  onNavigate={closeMobileMenu}
                  onSearch={handleSearch}
                  onValueChange={setSearchQuery}
                  value={searchQuery}
                  variant="mobile"
                />
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
