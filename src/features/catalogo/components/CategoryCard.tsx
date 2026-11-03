import Image from "next/image";
import Link from "next/link";

import { getCategoryImage } from "@/shared/config/category-images";

export interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl?: string | null;
  // Opcional: solo se muestra donde se pasa (p. ej. /categorias); el home no lo usa.
  productCount?: number;
}

export function CategoryCard({ name, slug, imageUrl, productCount }: CategoryCardProps) {
  const image = getCategoryImage(slug, imageUrl);

  return (
    <Link className="category-motion-card category-card" href={`/productos?cat=${slug}`}>
      <div className="category-motion-media category-card-media">
        {image ? (
          <Image
            alt=""
            fill
            sizes="(max-width: 768px) 60vw, (max-width: 1280px) 25vw, 260px"
            src={image}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span aria-hidden="true" className="category-card-fallback" />
        )}
      </div>

      <div className="category-motion-copy category-card-copy">
        <p className="category-card-name">{name}</p>
        {productCount !== undefined ? (
          <p className="category-card-count">
            {productCount} {productCount === 1 ? "título" : "títulos"}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
