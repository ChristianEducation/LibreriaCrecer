import Image from "next/image";
import Link from "next/link";

const fallbackBackgrounds = [
  "linear-gradient(145deg, #3A3001, #4A3802)",
  "linear-gradient(145deg, #4A3A02, #3A4430)",
  "linear-gradient(145deg, #736002, #4A3802)",
  "linear-gradient(145deg, #6A5402, #736002)",
  "linear-gradient(145deg, #8A7302, #C8A830)",
  "linear-gradient(145deg, #736002, #506040)",
  "linear-gradient(145deg, #7A6402, #5A4A02)",
  "linear-gradient(145deg, #8A7830, #484E38)",
] as const;

export interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl?: string | null;
  index?: number;
}

export function CategoryCard({ name, slug, imageUrl, index = 0 }: CategoryCardProps) {
  const fallbackBackground = fallbackBackgrounds[index % fallbackBackgrounds.length];

  return (
    <Link
      className="group relative block aspect-[3/4] overflow-hidden rounded"
      href={`/productos?cat=${slug}`}
    >
      <div className="absolute inset-0">
        {imageUrl ? (
          <Image
            alt={name}
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            src={imageUrl}
          />
        ) : (
          <div
            className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
            style={{ background: fallbackBackground }}
          />
        )}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(58,48,1,0.88)_0%,rgba(58,48,1,0.2)_45%,transparent_100%)] transition-[background] duration-300 group-hover:bg-[linear-gradient(to_top,rgba(58,48,1,0.94)_0%,rgba(58,48,1,0.38)_45%,transparent_100%)]" />

      <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-[60%] opacity-[0.12] transition-all duration-300 group-hover:-translate-y-[62%] group-hover:scale-110 group-hover:opacity-[0.2]">
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gold-pale" />
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gold-pale" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="mb-1 text-[9px] uppercase tracking-[0.22em] text-gold-light">Explorar</p>
        <h3 className="font-serif text-[15px] font-normal leading-[1.3] text-white">{name}</h3>
      </div>
    </Link>
  );
}
