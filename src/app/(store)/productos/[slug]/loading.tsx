export default function LoadingProducto() {
  return (
    <main className="page-px bg-beige" style={{ paddingTop: "2rem", paddingBottom: "5rem" }}>
      <div className="mx-auto flex max-w-[1000px] flex-col gap-8 md:flex-row md:gap-14 lg:gap-20">
        {/* Skeleton de Imagen */}
        <div className="w-full md:w-[40%]">
          <div className="aspect-[3/4] w-full animate-pulse rounded-[2px] bg-[var(--beige-mid)]" />
          <div className="mt-4 flex gap-2">
            <div className="h-16 w-12 animate-pulse rounded-[2px] bg-[var(--beige-mid)]" />
            <div className="h-16 w-12 animate-pulse rounded-[2px] bg-[var(--beige-mid)]" />
          </div>
        </div>

        {/* Skeleton de Información */}
        <div className="w-full md:w-[60%]">
          <div className="mb-2 h-4 w-1/4 animate-pulse rounded bg-[var(--beige-mid)]" />
          <div className="mb-6 h-10 w-3/4 animate-pulse rounded bg-[var(--beige-mid)]" />
          <div className="mb-6 h-6 w-1/3 animate-pulse rounded bg-[var(--beige-mid)]" />
          
          <div className="mb-8 space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-[var(--beige-mid)]" />
            <div className="h-4 w-full animate-pulse rounded bg-[var(--beige-mid)]" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-[var(--beige-mid)]" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-[var(--beige-mid)]" />
          </div>

          <div className="mb-8 h-12 w-48 animate-pulse rounded-[2px] bg-[var(--beige-mid)]" />

          <div className="space-y-4 border-t border-[var(--border)] pt-8">
            <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--beige-mid)]" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-[var(--beige-mid)]" />
          </div>
        </div>
      </div>
    </main>
  );
}
