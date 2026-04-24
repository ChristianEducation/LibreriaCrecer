import Image from "next/image";
import Link from "next/link";

export interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl?: string | null;
  productCount?: number;
  panoramaUrl?: string | null;
  panoramaIndex?: number;
  panoramaTotal?: number;
}

export function CategoryCard({
  name,
  slug,
  imageUrl,
  productCount,
  panoramaUrl,
  panoramaIndex = 0,
  panoramaTotal = 1,
}: CategoryCardProps) {
  const xPos = panoramaTotal > 1
    ? `${Math.round((panoramaIndex / (panoramaTotal - 1)) * 100)}%`
    : "0%";
  const bgPosition = `${xPos} 50%`;

  return (
    <Link
      href={`/productos?cat=${slug}`}
      style={{
        display: "block",
        position: "relative",
        aspectRatio: "3/2",
        overflow: "hidden",
        borderRadius: "var(--radius-sm)",
        transition: "transform 0.3s ease",
        textDecoration: "none",
      }}
      className="hover:scale-[1.02]"
    >
      {/* Background */}
      <div style={{ position: "absolute", inset: 0 }}>
        {panoramaUrl ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${panoramaUrl})`,
              backgroundSize: "cover",
              backgroundPosition: bgPosition,
              transition: "transform 0.4s ease",
            }}
          />
        ) : imageUrl ? (
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
