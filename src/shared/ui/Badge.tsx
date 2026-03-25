import * as React from "react";
import { cva, cx } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-[1px] border px-2 py-[3px] text-[8px] font-semibold uppercase tracking-[0.1em]",
  {
    variants: {
      variant: {
        new: "border-transparent bg-gold text-white",
        sale: "border-transparent bg-moss text-white",
        success: "",
        error: "",
        warning: "",
        info: "",
      },
    },
    defaultVariants: {
      variant: "new",
    },
  },
);

const toneStyles = {
  success: {
    backgroundColor: "color-mix(in srgb, var(--color-success) 10%, transparent)",
    borderColor: "color-mix(in srgb, var(--color-success) 25%, transparent)",
    color: "var(--color-success)",
  },
  error: {
    backgroundColor: "color-mix(in srgb, var(--color-error) 8%, transparent)",
    borderColor: "color-mix(in srgb, var(--color-error) 20%, transparent)",
    color: "var(--color-error)",
  },
  warning: {
    backgroundColor: "color-mix(in srgb, var(--color-warning) 8%, transparent)",
    borderColor: "color-mix(in srgb, var(--color-warning) 20%, transparent)",
    color: "var(--color-warning)",
  },
  info: {
    backgroundColor: "color-mix(in srgb, var(--color-info) 8%, transparent)",
    borderColor: "color-mix(in srgb, var(--color-info) 20%, transparent)",
    color: "var(--color-info)",
  },
} satisfies Record<string, React.CSSProperties>;

export interface BadgeProps {
  variant: "new" | "sale" | "success" | "error" | "warning" | "info";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className }: BadgeProps) {
  const style =
    variant === "success" || variant === "error" || variant === "warning" || variant === "info"
      ? toneStyles[variant]
      : undefined;

  return (
    <span className={cx(badgeVariants({ variant }), className)} style={style}>
      {children}
    </span>
  );
}
