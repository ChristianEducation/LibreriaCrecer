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

function getPuzzleStyle(index: number, total: number, cols: number) {
  const row = Math.floor(index / cols);
  const col = index % cols;
  const totalRows = Math.ceil(total / cols);
  
  const xPos = cols > 1 ? (col / (cols - 1)) * 100 : 0;
  const yPos = totalRows > 1 ? (row / (totalRows - 1)) * 100 : 0;
  
  const bgSizeX = `calc(${cols * 100}% + ${(cols - 1) * 12}px)`;
  const bgSizeY = `calc(${totalRows * 100}% + ${(totalRows - 1) * 12}px)`;

  return `background-size: ${bgSizeX} ${bgSizeY} !important; background-position: ${xPos}% ${yPos}% !important;`;
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
  const hasPanorama = !!panoramaUrl && panoramaTotal > 1;

  return (
    <>
      {hasPanorama && (
        <style dangerouslySetInnerHTML={{
          __html: `
            .puzzle-${slug} { ${getPuzzleStyle(panoramaIndex, panoramaTotal, 5)} }
          `
        }} />
      )}
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
              className={hasPanorama ? `puzzle-${slug}` : ""}
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${panoramaUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
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
    </>
  );
}
