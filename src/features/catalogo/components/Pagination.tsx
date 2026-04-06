"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cx } from "class-variance-authority";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return Array.from(pages).filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const query = params.toString();
    router.push(query ? `/productos?${query}` : "/productos");
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Paginacion">
      <button
        className="rounded border border-border px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-text-mid transition-colors hover:border-moss hover:text-moss disabled:cursor-not-allowed disabled:opacity-40"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        type="button"
      >
        Anterior
      </button>

      <span className="px-3 text-[12px] text-text-light">
        Página {currentPage} de {totalPages}
      </span>

      {visiblePages.map((page, index) => {
        const previousPage = visiblePages[index - 1];
        const showGap = previousPage && page - previousPage > 1;

        return (
          <div className="flex items-center gap-2" key={page}>
            {showGap ? <span className="px-1 text-text-light">...</span> : null}
            <button
              className={cx(
                "min-w-10 rounded border px-3 py-2 text-[12px] transition-colors",
                page === currentPage
                  ? "border-transparent bg-moss text-white"
                  : "border-border text-text-mid hover:border-moss hover:text-moss",
              )}
              onClick={() => goToPage(page)}
              type="button"
            >
              {page}
            </button>
          </div>
        );
      })}

      <button
        className="rounded border border-border px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-text-mid transition-colors hover:border-moss hover:text-moss disabled:cursor-not-allowed disabled:opacity-40"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
        type="button"
      >
        Siguiente
      </button>
    </nav>
  );
}
