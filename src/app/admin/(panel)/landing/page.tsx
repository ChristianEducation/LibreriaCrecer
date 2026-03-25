import Link from "next/link";

export default function AdminLandingPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-serif text-[2rem] leading-none text-text">Gestion del landing</h1>
        <p className="mt-2 text-sm font-light text-text-light">
          Administra hero, banners, seleccion curada y la ilustracion editorial del footer.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link href="/admin/landing/hero" className="rounded-[10px] border border-border bg-white p-5 transition-colors hover:border-gold/40 hover:bg-gold/5">
          <p className="font-medium text-text">Hero Slides</p>
          <p className="mt-2 text-sm font-light text-text-light">Titulos, subtitulos, imagenes y orden del carrusel.</p>
        </Link>
        <Link href="/admin/landing/banners" className="rounded-[10px] border border-border bg-white p-5 transition-colors hover:border-gold/40 hover:bg-gold/5">
          <p className="font-medium text-text">Banners intermedios</p>
          <p className="mt-2 text-sm font-light text-text-light">Bloques visuales entre secciones del home.</p>
        </Link>
        <Link href="/admin/landing/seleccion" className="rounded-[10px] border border-border bg-white p-5 transition-colors hover:border-gold/40 hover:bg-gold/5">
          <p className="font-medium text-text">Seleccion curada</p>
          <p className="mt-2 text-sm font-light text-text-light">Colecciones editoriales y orden manual de productos.</p>
        </Link>
        <Link href="/admin/landing/footer" className="rounded-[10px] border border-border bg-white p-5 transition-colors hover:border-gold/40 hover:bg-gold/5">
          <p className="font-medium text-text">Footer</p>
          <p className="mt-2 text-sm font-light text-text-light">Ilustracion, opacidad y fade del pie del sitio.</p>
        </Link>
      </div>
    </section>
  );
}
