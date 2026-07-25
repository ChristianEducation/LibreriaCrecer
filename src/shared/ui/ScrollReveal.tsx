"use client";

import { cx } from "class-variance-authority";

import { useScrollReveal } from "@/shared/hooks";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  variant?: "fade-up" | "scale-soft" | "line-grow";
}

export function ScrollReveal({
  children,
  className,
  delayMs = 0,
  variant = "fade-up",
}: ScrollRevealProps) {
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <div
      className={cx("reveal", `reveal--${variant}`, className)}
      ref={revealRef}
      style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
