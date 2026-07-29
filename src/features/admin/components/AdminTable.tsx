"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "class-variance-authority";

export interface AdminTableColumn<T> {
  key: string;
  header: string;
  className?: string;
  render: (item: T) => React.ReactNode;
}

export interface AdminTableProps<T> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  columns: AdminTableColumn<T>[];
  data: T[];
  emptyState?: React.ReactNode;
  rowKey: (item: T) => string;
}

export function AdminTable<T>({
  title,
  description,
  actions,
  columns,
  data,
  emptyState,
  rowKey,
}: AdminTableProps<T>) {
  const hasHeader = Boolean(title || description || actions);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function updateScrollState() {
      if (!el) return;
      setCanScrollRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 1);
    }

    updateScrollState();
    el.addEventListener("scroll", updateScrollState);

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [data, columns]);

  return (
    <div className="admin-card" style={{ overflow: "hidden" }}>
      {hasHeader ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "16px 20px",
            borderBottom: "1px solid #ede9e2",
          }}
        >
          <div>
            {title ? (
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--text)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h3>
            ) : null}
            {description ? (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-light)",
                  marginTop: 4,
                  fontWeight: 300,
                }}
              >
                {description}
              </p>
            ) : null}
          </div>
          {actions}
        </div>
      ) : null}

      <div style={{ position: "relative", minWidth: 0 }}>
        <div ref={scrollRef} style={{ overflowX: "auto", minWidth: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#faf8f4", borderBottom: "1px solid #ede9e2" }}>
              {columns.map((column, index) => (
                <th
                  className={column.className}
                  key={column.key}
                  style={{
                    padding: "12px 16px",
                    paddingLeft: index === 0 ? 20 : 16,
                    paddingRight: index === columns.length - 1 ? 20 : 16,
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-light)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: "48px 20px",
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: 300,
                    color: "var(--text-light)",
                  }}
                >
                  {emptyState ?? "No hay registros para mostrar."}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr
                  className="transition-colors duration-150 hover:bg-[#faf9f6]"
                  key={rowKey(item)}
                  style={{
                    borderTop: rowIndex === 0 ? "none" : "1px solid #f2efe8",
                  }}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      className={cx(column.className)}
                      key={column.key}
                      style={{
                        padding: "14px 16px",
                        paddingLeft: colIndex === 0 ? 20 : 16,
                        paddingRight: colIndex === columns.length - 1 ? 20 : 16,
                        verticalAlign: "middle",
                        fontSize: 13,
                        color: "var(--text-mid)",
                      }}
                    >
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
        {canScrollRight ? (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: 28,
              pointerEvents: "none",
              background: "linear-gradient(to right, rgba(255,253,248,0), rgba(255,253,248,0.95))",
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
