import Image from "next/image";
import Link from "next/link";

export interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl?: string | null;
  productCount?: number;
}

export function CategoryCard({ name, slug, imageUrl, productCount }: CategoryCardProps) {
  return (
    <Link
      href={`/productos?cat=${slug}`}
      style={{
        display: "block",
        position: "relative",
        aspectRatio: "3/2",
        overflow: "hidden",
        borderRadius: "2px",
        transition: "transform 0.3s ease",
        textDecoration: "none",
      }}
      className="hover:scale-[1.02]"
    >
      {/* Background */}
      <div style={{ position: "absolute", inset: 0 }}>
        {imageUrl ? (
          <Image
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            src={imageUrl}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <>
            <div style={{ position: "absolute", inset: 0, background: "#4a3c02" }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(200,168,48,0.12), transparent 60%)" }} />
          </>
        )}
      </div>

      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(58,48,1,0.35)" }} />

      {/* Content */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 400, color: "white", lineHeight: 1.3, marginBottom: productCount !== undefined ? "4px" : 0 }}>
          {name}
        </p>
        {productCount !== undefined && (
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>
            {productCount} {productCount === 1 ? "título" : "títulos"}
          </p>
        )}
      </div>
    </Link>
  );
}
