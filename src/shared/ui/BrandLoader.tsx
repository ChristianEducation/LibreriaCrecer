"use client";

import Lottie from "lottie-react";

import loaderAnimation from "../../../public/animations/Loader_16.json";

import { Logo } from "./Logo";

interface BrandLoaderProps {
  className?: string;
}

export function BrandLoader({ className }: BrandLoaderProps) {
  return (
    <div
      aria-label="Cargando Crecer Librería Católica"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-beige${className ? ` ${className}` : ""}`}
      role="status"
    >
      {/* Animación Lottie con logo centrado encima */}
      <div style={{ position: "relative", width: 220, height: 220 }}>
        {/* Animación Lottie girando */}
        <Lottie
          animationData={loaderAnimation}
          autoplay={true}
          loop={true}
          style={{ width: "100%", height: "100%" }}
        />
        {/* Logo centrado estático sobre la animación */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Logo size="splash" />
        </div>
      </div>
    </div>
  );
}
