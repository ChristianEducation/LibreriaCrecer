import Link from "next/link";

type LandingSection = {
  href: string;
  title: string;
  description: string;
};

const sections: LandingSection[] = [
  {
    href: "/admin/landing/top-banner",
    title: "Top Banner",
    description: "Franja informativa sobre el header. Texto, enlace y visibilidad.",
  },
  {
    href: "/admin/landing/hero",
    title: "Hero principal",
    description: "Carrusel de slides con imagen, título, subtítulo y CTA.",
  },
  {
    href: "/admin/landing/seleccion",
    title: "Selección del mes",
    description: "Colección editorial curada con orden manual para home y catálogo.",
  },
  {
    href: "/admin/landing/categorias",
    title: "Categorías",
    description: "Panorámica dividida entre las tarjetas de categorías del landing.",
  },
  {
    href: "/admin/landing/hero-final",
    title: "Hero final",
    description: "Frase inspiradora con imagen de fondo, antes de Instagram.",
  },
  {
    href: "/admin/landing/footer",
    title: "Footer",
    description: "Ilustración, opacidad y fade del pie del sitio.",
  },
];

export default function AdminLandingPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-serif text-[2rem] leading-none text-text">Gestión del landing</h1>
        <p className="mt-2 text-sm font-light text-text-light">
          Administra cada sección de la portada del sitio.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            className="rounded-[10px] border border-border bg-white p-5 transition-colors hover:border-gold/40 hover:bg-gold/5"
            href={section.href}
          >
            <p className="font-medium text-text">{section.title}</p>
            <p className="mt-2 text-sm font-light text-text-light">{section.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
