"use client";

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
  return (
    <div className="overflow-hidden rounded-[2px] border border-border bg-white">
      {title || description || actions ? (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            {title ? <h3 className="text-[0.82rem] font-semibold text-text">{title}</h3> : null}
            {description ? <p className="mt-1 text-[11px] text-text-light">{description}</p> : null}
          </div>
          {actions}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-beige-warm">
            <tr>
              {columns.map((column) => (
                <th
                  className={cx(
                    "border-b border-border px-4 py-[11px] text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-text-light",
                    column.className,
                  )}
                  key={column.key}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-sm text-text-light" colSpan={columns.length}>
                  {emptyState ?? "No hay registros para mostrar."}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr className="transition-colors hover:bg-beige/40" key={rowKey(item)}>
                  {columns.map((column) => (
                    <td
                      className={cx(
                        "border-b border-border px-4 py-[13px] align-middle text-[0.8rem] text-text-mid last:border-b-0",
                        column.className,
                      )}
                      key={column.key}
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
    </div>
  );
}
