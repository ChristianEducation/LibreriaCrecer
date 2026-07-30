"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { AdminStatusPill, AdminTable, AdminToggle } from "@/features/admin/components";
import { useToast } from "@/shared/hooks";
import { formatCLP } from "@/shared/utils";

type ProductListItem = {
  id: string;
  title: string;
  author: string | null;
  publisher: string | null;
  price: number;
  effectivePrice: number;
  stockQuantity: number;
  inStock: boolean;
  isActive: boolean;
  onlineSaleEnabled: boolean;
  mainImageUrl: string | null;
  categories: Array<{ id: string; name: string }>;
};

type CategoryOption = {
  id: string;
  name: string;
};

type ProductAdminStats = {
  totalProducts: number;
  activeProducts: number;
  totalStock: number;
  potentialSalesValue: number;
  activeCategories: number;
  onlineSaleEnabledProducts: number;
};

const EMPTY_STATS: ProductAdminStats = {
  totalProducts: 0,
  activeProducts: 0,
  totalStock: 0,
  potentialSalesValue: 0,
  activeCategories: 0,
  onlineSaleEnabledProducts: 0,
};

type ProductIconName =
  | "search"
  | "filter"
  | "chev"
  | "dots"
  | "edit"
  | "trash"
  | "toggle"
  | "plus"
  | "arrow-left"
  | "arrow-right";

function ProductIcon({ name, size = 14, strokeWidth = 1.7 }: { name: ProductIconName; size?: number; strokeWidth?: number }) {
  const paths: Record<ProductIconName, string> = {
    search: "M8.5 15a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM17 17l-3.5-3.5",
    filter: "M3 5h14M6 10h8M9 15h2",
    chev: "M5 8l5 5 5-5",
    dots: "M5 10h.01M10 10h.01M15 10h.01",
    edit: "M13 3l4 4-10 10H3v-4L13 3z",
    trash: "M4 6h12M8 6V4h4v2M5 6l1 12h8l1-12",
    toggle: "M4 10a6 4 0 1 0 12 0 6 4 0 0 0-12 0zM14 10h.01",
    plus: "M10 4v12M4 10h12",
    "arrow-left": "M16 10H4M8 14l-4-4 4-4",
    "arrow-right": "M4 10h12M12 6l4 4-4 4",
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={name === "dots" || name === "plus" ? 2 : strokeWidth}
      viewBox="0 0 20 20"
      width={size}
    >
      <path d={paths[name]} />
    </svg>
  );
}

const COVER_PALETTES = [
  ["#6b5b3e", "#c4a97d"],
  ["#3b5e5a", "#7dc4bb"],
  ["#6b3e3e", "#c47d7d"],
  ["#3e4f6b", "#7d9ec4"],
  ["#4a6b3e", "#9dc47d"],
  ["#6b3e6b", "#c47dc4"],
  ["#3e6b5a", "#7dc4a9"],
  ["#6b5e3e", "#c4aa7d"],
  ["#5a3e6b", "#a97dc4"],
  ["#6b3e4a", "#c47d8e"],
  ["#4a5a6b", "#8ea9c4"],
];

function paletteFor(seed: string): readonly [string, string] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % COVER_PALETTES.length;
  const palette = COVER_PALETTES[idx] ?? COVER_PALETTES[0];
  return [palette[0] as string, palette[1] as string] as const;
}

function BookCover({ title, imageUrl }: { title: string; imageUrl: string | null }) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt={title}
        src={imageUrl}
        style={{
          width: 36,
          height: 49,
          borderRadius: 4,
          objectFit: "cover",
          flexShrink: 0,
          boxShadow: "1px 1px 4px rgba(58, 48, 1, 0.18)",
        }}
      />
    );
  }

  const [bg, fg] = paletteFor(title);
  const initials = title
    .replace(/[^A-Za-zÁÉÍÓÚÑÜ ]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      style={{
        width: 36,
        height: 49,
        borderRadius: 4,
        background: bg,
        color: fg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 1,
        boxShadow: "1px 1px 4px rgba(58, 48, 1, 0.22)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: fg,
          opacity: 0.4,
        }}
      />
      <span>{initials || title.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

function StockIndicator({ stock, inStock }: { stock: number; inStock: boolean }) {
  let color = "var(--success)";
  if (!inStock || stock === 0) color = "var(--error)";
  else if (stock < 7) color = "var(--error)";
  else if (stock < 15) color = "var(--gold)";

  const pct = Math.min(100, Math.max(stock > 0 ? 8 : 0, (stock / 30) * 100));

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 82 }}>
      <div
        style={{
          width: 36,
          height: 4,
          borderRadius: 999,
          background: "#e8e5df",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 999,
            transition: "width 0.3s",
          }}
        />
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-mid)" }}>{stock}</span>
    </div>
  );
}

function CategoryPill({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 999,
        background: "rgba(115, 96, 2, 0.07)",
        color: "var(--text-mid)",
        fontSize: 11,
        fontWeight: 500,
        whiteSpace: "nowrap",
        maxWidth: 220,
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {label}
    </span>
  );
}

function ActionMenu({
  product,
  onEdit,
  onToggle,
}: {
  product: ProductListItem;
  onEdit: () => void;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const itemBaseStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "8px 14px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    color: "var(--text)",
    borderRadius: 6,
    textAlign: "left",
    fontFamily: "inherit",
    textDecoration: "none",
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        aria-label="Acciones"
        onClick={() => setOpen((value) => !value)}
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          border: "1px solid #e8e5df",
          background: open ? "#f0ede7" : "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s",
          color: "var(--text-light)",
        }}
        type="button"
      >
        <ProductIcon name="dots" size={16} />
      </button>
      {open ? (
        <div
          role="menu"
          style={{
            position: "absolute",
            right: 0,
            top: 36,
            zIndex: 30,
            width: 200,
            background: "white",
            borderRadius: 10,
            border: "1px solid #e8e5df",
            boxShadow: "0 8px 24px rgba(58, 48, 1, 0.12)",
            padding: 4,
          }}
        >
          <Link
            href={`/admin/productos/${product.id}/editar`}
            onClick={() => setOpen(false)}
            role="menuitem"
            style={itemBaseStyle}
          >
            <span style={{ color: "var(--text-light)", display: "inline-flex" }}>
              <ProductIcon name="edit" size={15} />
            </span>
            Editar producto
          </Link>
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            role="menuitem"
            style={itemBaseStyle}
            type="button"
          >
            <span style={{ color: "var(--text-light)", display: "inline-flex" }}>
              <ProductIcon name="toggle" size={15} />
            </span>
            Vista previa
          </button>
          <div
            aria-hidden="true"
            style={{ height: 1, background: "#f0ede7", margin: "4px 10px" }}
          />
          <button
            onClick={() => {
              onToggle();
              setOpen(false);
            }}
            role="menuitem"
            style={{ ...itemBaseStyle, color: "var(--error)" }}
            type="button"
          >
            <span style={{ color: "var(--error)", display: "inline-flex" }}>
              <ProductIcon name="trash" size={15} />
            </span>
            Desactivar producto
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ----------------------------------------------------------------------
// INLINE EDIT COMPONENTS
// ----------------------------------------------------------------------

function EditablePrice({
  value,
  effectivePrice,
  onSave,
}: {
  value: number;
  effectivePrice: number;
  onSave: (val: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    } else {
      setVal(value);
    }
  }, [isEditing, value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (val !== value) onSave(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleBlur();
    if (e.key === "Escape") {
      setVal(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{
          width: "90px",
          padding: "4px 8px",
          border: "1px solid var(--gold)",
          borderRadius: "4px",
          fontSize: 14,
          fontWeight: 600,
          color: "var(--text)",
          outline: "none",
        }}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      style={{
        cursor: "pointer",
        display: "inline-block",
        padding: "4px 8px",
        margin: "-4px -8px",
        borderRadius: "4px",
        transition: "background 0.2s",
      }}
      className="hover:bg-gold/10"
      title="Clic para editar"
    >
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
        {formatCLP(effectivePrice)}
      </div>
      {effectivePrice !== value ? (
        <div style={{ fontSize: 11, color: "var(--text-light)", textDecoration: "line-through", marginTop: 1 }}>
          {formatCLP(value)}
        </div>
      ) : null}
    </div>
  );
}

function EditableStock({ stock, inStock, onSave }: { stock: number; inStock: boolean; onSave: (val: number) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(stock);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    } else {
      setVal(stock);
    }
  }, [isEditing, stock]);

  const handleBlur = () => {
    setIsEditing(false);
    if (val !== stock) onSave(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleBlur();
    if (e.key === "Escape") {
      setVal(stock);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{
          width: "60px",
          padding: "2px 6px",
          border: "1px solid var(--gold)",
          borderRadius: "4px",
          fontSize: 13,
          fontWeight: 500,
          color: "var(--text-mid)",
          outline: "none",
        }}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      style={{ cursor: "pointer", display: "inline-block", padding: "4px", margin: "-4px", borderRadius: "4px" }}
      className="hover:bg-gold/10"
      title="Clic para editar"
    >
      <StockIndicator inStock={inStock} stock={stock} />
    </div>
  );
}

function EditableStatus({ isActive, onToggle }: { isActive: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{ cursor: "pointer", display: "inline-block", padding: "2px", margin: "-2px", borderRadius: "999px" }}
      className="hover:ring-2 hover:ring-gold/30 hover:opacity-80 transition-all"
      title="Clic para cambiar estado"
    >
      <AdminStatusPill status={isActive ? "active" : "inactive"}>
        {isActive ? "Activo" : "Inactivo"}
      </AdminStatusPill>
    </div>
  );
}

function EditableCategory({
  categories,
  allCategories,
  onSave,
}: {
  categories: Array<{ id: string; name: string }>;
  allCategories: CategoryOption[];
  onSave: (id: string, name: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const mainCategoryId = categories[0]?.id ?? "";

  if (isEditing) {
    return (
      <select
        autoFocus
        value={mainCategoryId}
        onChange={(e) => {
          const selectedId = e.target.value;
          const selectedName = allCategories.find((c) => c.id === selectedId)?.name ?? "";
          onSave(selectedId, selectedName);
          setIsEditing(false);
        }}
        onBlur={() => setIsEditing(false)}
        style={{
          padding: "2px 6px",
          border: "1px solid var(--gold)",
          borderRadius: "4px",
          fontSize: 11,
          outline: "none",
          background: "white",
          maxWidth: "140px",
          cursor: "pointer",
        }}
      >
        <option value="" disabled>Seleccionar...</option>
        {allCategories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      style={{ cursor: "pointer", display: "inline-block", padding: "4px", margin: "-4px", borderRadius: "4px" }}
      className="hover:bg-gold/10"
      title="Clic para cambiar"
    >
      <CategoryPill label={categories.map((c) => c.name).join(", ") || "Sin categoría"} />
    </div>
  );
}

function OnlineSaleToggleCell({
  productTitle,
  checked,
  loading,
  onToggle,
}: {
  productTitle: string;
  checked: boolean;
  loading: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <AdminToggle
        ariaLabel={`Venta web habilitada para ${productTitle}`}
        checked={checked}
        disabled={loading}
        onChange={onToggle}
      />
      <span style={{ fontSize: 11, color: "var(--text-light)", whiteSpace: "nowrap" }}>
        {checked ? "Venta web habilitada" : "Consulta por WhatsApp"}
      </span>
    </div>
  );
}

function BulkVentaWebControl({
  stats,
  loading,
  onBulkAction,
}: {
  stats: ProductAdminStats;
  loading: boolean;
  onBulkAction: (enabled: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointer(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function handleSelect(enabled: boolean) {
    setOpen(false);
    const message = enabled
      ? "¿Habilitar la venta web en todo el catálogo?\n\nLos productos activos y con stock podrán agregarse al carrito."
      : "¿Poner todo el catálogo en modo consulta?\n\nLos productos seguirán visibles, pero el botón de compra será reemplazado por WhatsApp.";
    const confirmed = window.confirm(message);
    if (!confirmed) return;
    onBulkAction(enabled);
  }

  const label = `Venta web: ${stats.onlineSaleEnabledProducts.toLocaleString("es-CL")} de ${stats.totalProducts.toLocaleString("es-CL")} habilitados`;

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        disabled={loading}
        onClick={() => setOpen((value) => !value)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          height: 36,
          padding: "0 14px",
          borderRadius: 10,
          border: "1px solid #e8e5df",
          background: "white",
          color: "var(--text-mid)",
          fontSize: 13,
          fontWeight: 500,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          fontFamily: "inherit",
          whiteSpace: "nowrap",
        }}
        type="button"
      >
        {loading ? "Actualizando…" : label}
        <ProductIcon name="chev" size={12} />
      </button>
      {open ? (
        <div
          role="menu"
          style={{
            position: "absolute",
            left: 0,
            top: 40,
            zIndex: 30,
            width: 260,
            background: "white",
            borderRadius: 10,
            border: "1px solid #e8e5df",
            boxShadow: "0 8px 24px rgba(58, 48, 1, 0.12)",
            padding: 4,
          }}
        >
          <button
            onClick={() => handleSelect(true)}
            role="menuitem"
            style={{
              display: "block",
              width: "100%",
              padding: "10px 14px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              color: "var(--text)",
              borderRadius: 6,
              textAlign: "left",
              fontFamily: "inherit",
            }}
            type="button"
          >
            Habilitar venta en todos
          </button>
          <button
            onClick={() => handleSelect(false)}
            role="menuitem"
            style={{
              display: "block",
              width: "100%",
              padding: "10px 14px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              color: "var(--text)",
              borderRadius: 6,
              textAlign: "left",
              fontFamily: "inherit",
            }}
            type="button"
          >
            Poner todos en modo consulta
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ProductMobileCard({
  product,
  categories,
  onlineSaleLoading,
  onInlineUpdate,
  onToggleOnlineSale,
  onEdit,
  onDelete,
}: {
  product: ProductListItem;
  categories: CategoryOption[];
  onlineSaleLoading: boolean;
  onInlineUpdate: (field: string, value: string | number | boolean, displayValue?: string) => void;
  onToggleOnlineSale: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="admin-card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <BookCover imageUrl={product.mainImageUrl} title={product.title} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", lineHeight: 1.3 }}>{product.title}</p>
          <p style={{ fontSize: 12, color: "var(--text-light)", marginTop: 2 }}>
            {product.author ?? "Autor no informado"}
          </p>
        </div>
        <ActionMenu onEdit={onEdit} onToggle={onDelete} product={product} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <EditablePrice
          effectivePrice={product.effectivePrice}
          onSave={(val) => onInlineUpdate("price", val)}
          value={product.price}
        />
        <EditableStock
          inStock={product.inStock}
          onSave={(val) => onInlineUpdate("stockQuantity", val)}
          stock={product.stockQuantity}
        />
      </div>

      <EditableCategory
        allCategories={categories}
        categories={product.categories}
        onSave={(id, name) => onInlineUpdate("categoryId", id, name)}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          paddingTop: 10,
          borderTop: "1px solid #f2efe8",
        }}
      >
        <EditableStatus
          isActive={product.isActive}
          onToggle={() => onInlineUpdate("isActive", !product.isActive)}
        />
        <OnlineSaleToggleCell
          checked={product.onlineSaleEnabled}
          loading={onlineSaleLoading}
          onToggle={onToggleOnlineSale}
          productTitle={product.title}
        />
      </div>
    </article>
  );
}

export default function AdminProductosPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState("true");
  const [onlineSaleFilter, setOnlineSaleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ProductAdminStats>(EMPTY_STATS);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [rowLoadingIds, setRowLoadingIds] = useState<Set<string>>(new Set());
  const hasFetchedStatsRef = useRef(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categorias", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { data?: CategoryOption[] };
        setCategories(payload.data ?? []);
      } catch {
        // best-effort, no bloquea la UI
      }
    };

    void fetchCategories();
  }, []);

  // Espera una pausa breve despues de que deja de escribir antes de buscar,
  // en vez de disparar una consulta nueva por cada letra tipeada.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Vuelve a la pagina 1 cuando cambia la busqueda o algun filtro (no cuando
  // cambia solo de pagina).
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryId, isActive, onlineSaleFilter]);

  useEffect(() => {
    const controller = new AbortController();
    const isInitialLoad = !hasFetchedStatsRef.current;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: "20",
          // Las estadisticas (stock total, productos activos, etc.) son globales y no
          // dependen de la busqueda/filtros: se piden una sola vez, no en cada consulta.
          includeStats: isInitialLoad ? "true" : "false",
        });
        if (debouncedSearch) query.set("search", debouncedSearch);
        if (categoryId) query.set("categoryId", categoryId);
        if (isActive) query.set("isActive", isActive);
        if (onlineSaleFilter) query.set("onlineSaleEnabled", onlineSaleFilter);

        const response = await fetch(`/api/admin/productos?${query.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = (await response.json().catch(() => null)) as
          | {
              data?: ProductListItem[];
              pagination?: { total?: number; totalPages?: number };
              stats?: ProductAdminStats;
              message?: string;
            }
          | null;

        if (!response.ok) {
          setError(payload?.message ?? "No se pudieron cargar los productos.");
          return;
        }

        setProducts(payload?.data ?? []);
        setTotalPages(payload?.pagination?.totalPages ?? 1);
        setTotalResults(payload?.pagination?.total ?? 0);
        if (payload?.stats) {
          setStats(payload.stats);
          hasFetchedStatsRef.current = true;
        }
      } catch {
        if (controller.signal.aborted) return;
        setError("Error de red. Intenta nuevamente.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void fetchProducts();
    return () => controller.abort();
  }, [page, debouncedSearch, categoryId, isActive, onlineSaleFilter]);

  async function handleBulkOnlineSale(enabled: boolean) {
    if (bulkLoading) return;
    setBulkLoading(true);

    try {
      const response = await fetch("/api/admin/productos/venta-web", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { data?: { enabled: boolean; affected: number }; message?: string }
        | null;

      if (!response.ok || !payload?.data) {
        toast({ message: payload?.message ?? "No se pudo actualizar la venta web.", variant: "error" });
        return;
      }

      const { affected } = payload.data;

      setProducts((prev) => prev.map((product) => ({ ...product, onlineSaleEnabled: enabled })));
      setStats((prev) => ({
        ...prev,
        onlineSaleEnabledProducts: enabled ? prev.totalProducts : 0,
      }));
      toast({
        message: enabled
          ? `Venta web habilitada en ${affected} productos.`
          : `${affected} productos puestos en modo consulta.`,
        variant: "success",
      });
    } catch {
      toast({ message: "Error de red. Intenta nuevamente.", variant: "error" });
    } finally {
      setBulkLoading(false);
    }
  }

  async function handleToggleOnlineSale(productId: string, nextValue: boolean) {
    if (rowLoadingIds.has(productId)) return;

    const previousProducts = products;
    setRowLoadingIds((prev) => new Set(prev).add(productId));
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, onlineSaleEnabled: nextValue } : product)),
    );

    try {
      const response = await fetch(`/api/admin/productos/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onlineSaleEnabled: nextValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }

      setStats((prev) => ({
        ...prev,
        onlineSaleEnabledProducts: prev.onlineSaleEnabledProducts + (nextValue ? 1 : -1),
      }));
      toast({ message: "Guardado", variant: "success" });
    } catch {
      setProducts(previousProducts);
      toast({ message: "No se pudo actualizar la venta web.", variant: "error" });
    } finally {
      setRowLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }

  async function handleDelete(productId: string) {
    const confirmed = window.confirm("¿Desactivar este producto?");
    if (!confirmed) return;

    const response = await fetch(`/api/admin/productos/${productId}`, { method: "DELETE" });
    if (!response.ok) {
      toast({ message: "No se pudo desactivar el producto.", variant: "error" });
      return;
    }

    setProducts((prev) => prev.filter((item) => item.id !== productId));
    toast({ message: "Producto desactivado correctamente." });
  }

  async function handleInlineUpdate(
    productId: string,
    field: string,
    value: string | number | boolean,
    displayValue?: string,
  ) {
    const previousProducts = [...products];
    
    // Determine API payload and local state update
    let apiPayload: Record<string, unknown> = {};
    let localUpdate: Partial<ProductListItem> = {};

    if (field === "price") {
      apiPayload = { price: value };
      const product = previousProducts.find((p) => p.id === productId);
      const hadSalePrice = product ? product.price !== product.effectivePrice : false;
      localUpdate = { 
        price: value as number,
        effectivePrice: hadSalePrice ? product!.effectivePrice : (value as number)
      };
    } else if (field === "stockQuantity") {
      apiPayload = { stockQuantity: value, inStock: (value as number) > 0 };
      localUpdate = { stockQuantity: value as number, inStock: (value as number) > 0 };
    } else if (field === "isActive") {
      apiPayload = { isActive: value };
      localUpdate = { isActive: value as boolean };
    } else if (field === "categoryId") {
      apiPayload = { categoryIds: [value] };
      localUpdate = { categories: [{ id: value as string, name: displayValue as string }] };
    }

    setProducts((prev) => {
      // Remove product immediately if the current filter does not match the new state
      if (field === "isActive" && isActive !== "" && String(value) !== isActive) {
        return prev.filter((p) => p.id !== productId);
      }
      return prev.map((p) => (p.id === productId ? { ...p, ...localUpdate } : p));
    });

    try {
      const response = await fetch(`/api/admin/productos/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }
      toast({ message: "Guardado", variant: "success" });
    } catch {
      toast({ message: "Error al guardar", variant: "error" });
      setProducts(previousProducts); // rollback
    }
  }

  function handlePreview(product: ProductListItem) {
    toast({ message: `Vista previa de "${product.title}" próximamente.` });
  }

  const hasActiveFilters =
    search.trim().length > 0 || categoryId !== "" || isActive !== "" || onlineSaleFilter !== "";

  function clearFilters() {
    setSearch("");
    setCategoryId("");
    setIsActive("");
    setOnlineSaleFilter("");
  }

  return (
    <section className="admin-page-shell">
      <div className="admin-page-container">
        <div className="admin-page-header">
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Catálogo de libros
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-light)",
                marginTop: 4,
                fontWeight: 300,
              }}
            >
              {totalResults} producto{totalResults === 1 ? "" : "s"} encontrado{totalResults === 1 ? "" : "s"}
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
            <BulkVentaWebControl loading={bulkLoading} onBulkAction={handleBulkOnlineSale} stats={stats} />
            <Link
              href="/admin/productos/nuevo"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "0 16px",
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, var(--gold-light), var(--gold))",
                color: "white",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.01em",
                boxShadow: "0 2px 8px rgba(200, 168, 48, 0.35)",
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <ProductIcon name="plus" size={16} />
              Nuevo producto
            </Link>
          </div>
        </div>

        <div className="admin-grid-kpis">
          {[
            {
              key: "total",
              label: "Total productos",
              value: String(stats.totalProducts),
              sub: `${stats.activeProducts} activos`,
              accent: "var(--success)",
            },
            {
              key: "stock",
              label: "Stock total",
              value: String(stats.totalStock),
              sub: "unidades",
              accent: "var(--text-light)",
            },
            {
              key: "inventory",
              label: "Valor potencial de venta",
              value: formatCLP(stats.potentialSalesValue),
              sub: "a precio vigente",
              accent: "var(--gold)",
            },
            {
              key: "categories",
              label: "Categorías activas",
              value: String(stats.activeCategories),
              sub: "en el catálogo",
              accent: "var(--moss)",
            },
          ].map((item) => (
            <article
              className="admin-card"
              key={item.key}
              style={{ padding: "18px 22px" }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-light)",
                  fontWeight: 500,
                  marginBottom: 8,
                  letterSpacing: "0.02em",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--text)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: item.accent,
                  marginTop: 6,
                  fontWeight: 500,
                }}
              >
                {item.sub}
              </div>
            </article>
          ))}
        </div>

        <div
          className="admin-card"
          style={{
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "var(--text-light)",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <ProductIcon name="filter" size={15} />
            Filtros
          </div>
          <div style={{ width: 1, height: 20, background: "#ede9e2" }} />
          <label style={{ flex: "1 1 240px", minWidth: 220, position: "relative" }}>
            <span className="sr-only">Buscar productos</span>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-light)",
                pointerEvents: "none",
                display: "inline-flex",
              }}
            >
              <ProductIcon name="search" size={14} />
            </span>
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar producto o autor…"
              style={{
                width: "100%",
                height: 36,
                borderRadius: 10,
                border: "1px solid #e8e5df",
                background: "#faf9f7",
                padding: "0 14px 0 34px",
                fontSize: 13,
                color: "var(--text)",
                outline: "none",
                fontFamily: "inherit",
              }}
              type="text"
              value={search}
            />
          </label>
          <div style={{ position: "relative", minWidth: 200 }}>
            <select
              onChange={(event) => setCategoryId(event.target.value)}
              style={{
                appearance: "none",
                width: "100%",
                height: 36,
                borderRadius: 10,
                border: "1px solid #e8e5df",
                background: "white",
                padding: "0 32px 0 14px",
                fontSize: 13,
                color: "var(--text)",
                cursor: "pointer",
                outline: "none",
                fontFamily: "inherit",
              }}
              value={categoryId}
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "var(--text-light)",
                display: "inline-flex",
              }}
            >
              <ProductIcon name="chev" size={14} />
            </span>
          </div>
          <div style={{ position: "relative", minWidth: 150 }}>
            <select
              onChange={(event) => setIsActive(event.target.value)}
              style={{
                appearance: "none",
                width: "100%",
                height: 36,
                borderRadius: 10,
                border: "1px solid #e8e5df",
                background: "white",
                padding: "0 32px 0 14px",
                fontSize: 13,
                color: "var(--text)",
                cursor: "pointer",
                outline: "none",
                fontFamily: "inherit",
              }}
              value={isActive}
            >
              <option value="">Todos los estados</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "var(--text-light)",
                display: "inline-flex",
              }}
            >
              <ProductIcon name="chev" size={14} />
            </span>
          </div>
          <div style={{ position: "relative", minWidth: 210 }}>
            <select
              onChange={(event) => setOnlineSaleFilter(event.target.value)}
              style={{
                appearance: "none",
                width: "100%",
                height: 36,
                borderRadius: 10,
                border: "1px solid #e8e5df",
                background: "white",
                padding: "0 32px 0 14px",
                fontSize: 13,
                color: "var(--text)",
                cursor: "pointer",
                outline: "none",
                fontFamily: "inherit",
              }}
              value={onlineSaleFilter}
            >
              <option value="">Todos los productos</option>
              <option value="true">Venta web habilitada</option>
              <option value="false">En consulta por WhatsApp</option>
            </select>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "var(--text-light)",
                display: "inline-flex",
              }}
            >
              <ProductIcon name="chev" size={14} />
            </span>
          </div>
          {hasActiveFilters ? (
            <button
              onClick={clearFilters}
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--error)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: "0 6px",
              }}
              type="button"
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>

        {error ? (
          <div
            style={{
              borderRadius: 14,
              border: "1px solid rgba(192, 57, 43, 0.25)",
              background: "rgba(192, 57, 43, 0.06)",
              padding: "14px 20px",
              fontSize: 13,
              color: "var(--error)",
            }}
          >
            {error}
          </div>
        ) : null}

        {loading && products.length === 0 ? (
          <div
            className="admin-card"
            style={{
              padding: "16px 20px",
              fontSize: 13,
              color: "var(--text-light)",
              fontWeight: 300,
            }}
          >
            Cargando productos…
          </div>
        ) : (
          <div
            style={{
              opacity: loading ? 0.55 : 1,
              transition: "opacity 120ms ease",
              pointerEvents: loading ? "none" : "auto",
            }}
          >
          <div className="admin-desktop-table-wrap">
          <AdminTable
            columns={[
              {
                key: "producto",
                header: "Producto",
                render: (product) => (
                  <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 280 }}>
                    <BookCover imageUrl={product.mainImageUrl} title={product.title} />
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          color: "var(--text)",
                          lineHeight: 1.3,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {product.title}
                      </p>
                      <p
                        style={{
                          fontSize: 11.5,
                          color: "var(--text-light)",
                          marginTop: 2,
                          fontWeight: 300,
                        }}
                      >
                        {product.author ?? "Autor no informado"}
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                key: "precio",
                header: "Precio",
                render: (product) => (
                  <EditablePrice
                    effectivePrice={product.effectivePrice}
                    onSave={(val) => handleInlineUpdate(product.id, "price", val)}
                    value={product.price}
                  />
                ),
              },
              {
                key: "stock",
                header: "Stock",
                render: (product) => (
                  <EditableStock
                    inStock={product.inStock}
                    onSave={(val) => handleInlineUpdate(product.id, "stockQuantity", val)}
                    stock={product.stockQuantity}
                  />
                ),
              },
              {
                key: "categorias",
                header: "Categoría",
                render: (product) => (
                  <EditableCategory
                    allCategories={categories}
                    categories={product.categories}
                    onSave={(id, name) => handleInlineUpdate(product.id, "categoryId", id, name)}
                  />
                ),
              },
              {
                key: "venta-web",
                header: "Venta web",
                render: (product) => (
                  <OnlineSaleToggleCell
                    checked={product.onlineSaleEnabled}
                    loading={rowLoadingIds.has(product.id)}
                    onToggle={() => handleToggleOnlineSale(product.id, !product.onlineSaleEnabled)}
                    productTitle={product.title}
                  />
                ),
              },
              {
                key: "estado",
                header: "Estado",
                render: (product) => (
                  <EditableStatus
                    isActive={product.isActive}
                    onToggle={() => handleInlineUpdate(product.id, "isActive", !product.isActive)}
                  />
                ),
              },
              {
                key: "acciones",
                header: "",
                className: "text-right",
                render: (product) => (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <ActionMenu
                      onEdit={() => handlePreview(product)}
                      onToggle={() => handleDelete(product.id)}
                      product={product}
                    />
                  </div>
                ),
              },
            ]}
            data={products}
            emptyState="No se encontraron productos con los filtros seleccionados."
            rowKey={(product) => product.id}
          />
          </div>

          <div className="admin-mobile-cards">
            {products.length === 0 ? (
              <div
                className="admin-card"
                style={{ padding: "32px 20px", textAlign: "center", fontSize: 14, fontWeight: 300, color: "var(--text-light)" }}
              >
                No se encontraron productos con los filtros seleccionados.
              </div>
            ) : (
              products.map((product) => (
                <ProductMobileCard
                  categories={categories}
                  key={product.id}
                  onDelete={() => handleDelete(product.id)}
                  onEdit={() => handlePreview(product)}
                  onInlineUpdate={(field, value, displayValue) =>
                    handleInlineUpdate(product.id, field, value, displayValue)
                  }
                  onToggleOnlineSale={() => handleToggleOnlineSale(product.id, !product.onlineSaleEnabled)}
                  onlineSaleLoading={rowLoadingIds.has(product.id)}
                  product={product}
                />
              ))
            )}
          </div>
          </div>
        )}

        <div
          className="admin-card"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "12px 20px",
          }}
        >
          <span style={{ fontSize: 13, color: "var(--text-light)", fontWeight: 300 }}>
            Página {page} de {totalPages}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 32,
                padding: "0 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "white",
                fontSize: 13,
                color: "var(--text-mid)",
                cursor: page <= 1 ? "not-allowed" : "pointer",
                opacity: page <= 1 ? 0.5 : 1,
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
              type="button"
            >
              <ProductIcon name="arrow-left" size={13} />
              Anterior
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 32,
                padding: "0 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "white",
                fontSize: 13,
                color: "var(--text-mid)",
                cursor: page >= totalPages ? "not-allowed" : "pointer",
                opacity: page >= totalPages ? 0.5 : 1,
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
              type="button"
            >
              Siguiente
              <ProductIcon name="arrow-right" size={13} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
