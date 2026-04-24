import Image from "next/image";

type LogoSize = "navbar" | "admin" | "splash";

const heightsBySize: Record<LogoSize, number> = {
  navbar: 40,
  admin:  32,
  splash: 140,
};

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

export function Logo({ size = "navbar", className }: LogoProps) {
  const height = heightsBySize[size];

  return (
    <Image
      alt="Crecer Librería Católica"
      className={className}
      height={0}
      priority={size === "navbar" || size === "splash"}
      sizes="100vw"
      src="/images/logo.png"
      style={{ width: "auto", height: `${height}px` }}
      width={0}
    />
  );
}
