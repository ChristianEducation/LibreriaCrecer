export default function LoadingCatalogo() {
  return (
    <main className="bg-beige">
      <div className="h-[200px] w-full animate-pulse bg-[var(--beige-warm)] md:h-[300px]" />
      <div className="h-[60px] w-full animate-pulse bg-[var(--beige-mid)]" />

      <section className="page-px" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 lg:gap-x-5 lg:gap-y-10">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-[2/3] w-full animate-pulse rounded bg-[var(--beige-mid)]" />
              <div className="space-y-2">
                <div className="h-3 w-1/3 animate-pulse rounded bg-[var(--beige-mid)]" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-[var(--beige-mid)]" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-[var(--beige-mid)]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
