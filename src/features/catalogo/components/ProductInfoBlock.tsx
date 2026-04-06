"use client";

import { useEffect, useState } from "react";

import type { CatalogProductDetail } from "@/features/catalogo/types";
import { useCart } from "@/features/carrito/hooks";
import { Badge } from "@/shared/ui";
import { formatCLP } from "@/shared/utils/formatters";

// Íconos inline SVG
function TruckIcon() {
  return (
    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" style={{ width: "15px", height: "15px", color: "var(--gold)", flexShrink: 0 }} viewBox="0 0 24 24">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
      <rect height="7" rx="1" width="10" x="9" y="11" />
      <circle cx="12" cy="20" r="1" /><circle cx="18" cy="20" r="1" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" style={{ width: "15px", height: "15px", color: "var(--gold)", flexShrink: 0 }} viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" style={{ width: "15px", height: "15px", color: "var(--gold)", flexShrink: 0 }} viewBox="0 0 24 24">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" style={{ width: "16px", height: "16px" }} viewBox="0 0 24 24">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" style={{ width: "15px", height: "15px" }} viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ProductInfoBlock({ product }: { product: CatalogProductDetail }) {
  const { addItem, updateQuantity } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 2000);
    return () => window.clearTimeout(t);
  }, [added]);

  const maxQty = product.inStock ? Math.max(1, product.stockQuantity) : 1;

  function decrement() {
    setQty((q) => Math.max(1, q - 1));
  }
  function increment() {
    setQty((q) => Math.min(maxQty, q + 1));
  }
  function handleQtyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1 && val <= maxQty) setQty(val);
  }

  function handleAddToCart() {
    if (!product.inStock) return;
    addItem({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      author: product.author,
      price: product.effectivePrice,
      originalPrice: product.hasDiscount ? product.price : null,
      imageUrl: product.mainImageUrl ?? null,
      sku: product.sku ?? null,
    });
    if (qty > 1) {
      updateQuantity(product.id, qty);
    }
    setAdded(true);
  }

  const showLowStock = product.inStock && product.stockQuantity > 0 && product.stockQuantity <= 3;

  return (
    <div style={{ paddingTop: "4px" }}>
      {/* Eyebrow — categorías */}
      {product.categories.length > 0 && (
        <p style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ width: "20px", height: "1px", background: "var(--gold)", flexShrink: 0, display: "inline-block" }} />
          {product.categories.map((c) => c.name).join(" · ")}
        </p>
      )}

      {/* Título */}
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3vw,40px)", fontWeight: 400, color: "var(--moss)", lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: "4px" }}>
        {product.title}
      </h1>

      {/* Autor */}
      {product.author && (
        <p style={{ fontSize: "14px", color: "var(--text-light)", marginBottom: "20px", fontWeight: 300 }}>
          por <span style={{ color: "var(--moss)" }}>{product.author}</span>
        </p>
      )}

      {/* Referencia */}
      {(product.sku ?? product.code) && (
        <p style={{ fontSize: "11px", color: "var(--text-light)", letterSpacing: "0.06em", marginBottom: "12px" }}>
          Referencia {product.sku ?? product.code}
        </p>
      )}

      {/* Badge de stock */}
      {showLowStock && (
        <div style={{ marginBottom: "20px" }}>
          <Badge variant="warning">Últimas unidades</Badge>
        </div>
      )}
      {!product.inStock && (
        <div style={{ marginBottom: "20px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "2px", fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", background: "rgba(58,48,1,0.08)", color: "var(--text-mid)", border: "1px solid var(--border)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
            Sin stock
          </span>
        </div>
      )}

      {/* Precio */}
      <div style={{ marginBottom: "24px" }}>
        {product.salePrice && product.salePrice < product.price ? (
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "38px", fontWeight: 500, color: "var(--moss)", letterSpacing: "-0.01em", lineHeight: 1 }}>
              {formatCLP(product.salePrice)}
            </span>
            <span style={{ fontSize: "18px", color: "var(--text-light)", textDecoration: "line-through", fontWeight: 300 }}>
              {formatCLP(product.price)}
            </span>
          </div>
        ) : (
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "38px", fontWeight: 500, color: "var(--moss)", letterSpacing: "-0.01em", lineHeight: 1 }}>
            {formatCLP(product.price)}
          </span>
        )}
        <p style={{ fontSize: "12px", color: "var(--text-light)", marginTop: "4px", fontWeight: 300 }}>
          Impuestos incluidos · Envío calculado al checkout
        </p>
      </div>

      {/* Divider */}
      <div style={{ width: "100%", height: "1px", background: "var(--border)", margin: "24px 0" }} />

      {/* Descripción */}
      {product.description && (
        <div style={{ fontSize: "14px", lineHeight: 1.85, color: "var(--moss)", fontWeight: 300, marginBottom: "20px" }}>
          {product.description}
        </div>
      )}

      {/* Especificaciones */}
      {(product.coverType ?? product.pages) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
          {product.coverType && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--text-mid)" }}>
              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--gold)", flexShrink: 0 }} />
              {product.coverType}
            </div>
          )}
          {product.pages && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--text-mid)" }}>
              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--gold)", flexShrink: 0 }} />
              {product.pages} páginas
            </div>
          )}
        </div>
      )}

      {/* Segundo divider */}
      <div style={{ width: "100%", height: "1px", background: "var(--border)", margin: "0 0 24px" }} />

      {/* Fila agregar al carrito */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        {/* Control de cantidad */}
        <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: "2px", overflow: "hidden", flexShrink: 0 }}>
          <button
            onClick={decrement}
            style={{ width: "36px", height: "48px", background: "var(--beige-warm)", border: "none", fontSize: "18px", color: "var(--text-mid)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            type="button"
          >
            −
          </button>
          <input
            max={maxQty}
            min={1}
            onChange={handleQtyChange}
            style={{ width: "44px", height: "48px", border: "none", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)", textAlign: "center", fontSize: "14px", fontWeight: 500, background: "white", outline: "none", color: "var(--text)" }}
            type="number"
            value={qty}
          />
          <button
            onClick={increment}
            style={{ width: "36px", height: "48px", background: "var(--beige-warm)", border: "none", fontSize: "18px", color: "var(--text-mid)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            type="button"
          >
            +
          </button>
        </div>

        {/* Botón agregar */}
        <button
          disabled={!product.inStock}
          onClick={handleAddToCart}
          style={{
            flex: 1,
            height: "48px",
            background: added ? "var(--moss-mid, #8A7302)" : "var(--moss)",
            color: "white",
            border: "none",
            borderRadius: "2px",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: product.inStock ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            transition: "background 0.22s",
            opacity: product.inStock ? 1 : 0.38,
          }}
          type="button"
        >
          {added ? <><CheckIcon /> Agregado</> : <><CartIcon /> Añadir al carrito</>}
        </button>
      </div>

      {/* Badges de confianza */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", paddingTop: "20px", marginTop: "4px", borderTop: "1px solid var(--border)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "11px", color: "var(--text-light)" }}>
          <TruckIcon /> Envío a todo Chile
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "11px", color: "var(--text-light)" }}>
          <ShieldIcon /> Compra segura
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "11px", color: "var(--text-light)" }}>
          <MapPinIcon /> Retiro en tienda · Antofagasta
        </span>
      </div>
    </div>
  );
}
