"use client";

import { useEffect, useState } from "react";

import { BrandLoader } from "@/shared/ui/BrandLoader";

const SPLASH_DURATION_MS = 3500;

interface LandingWithSplashProps {
  children: React.ReactNode;
}

export function LandingWithSplash({ children }: LandingWithSplashProps) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && <BrandLoader />}
      <div
        aria-hidden={showSplash}
        style={{
          opacity: showSplash ? 0 : 1,
          transition: "opacity 0.5s ease",
          visibility: showSplash ? "hidden" : "visible",
        }}
      >
        {children}
      </div>
    </>
  );
}
