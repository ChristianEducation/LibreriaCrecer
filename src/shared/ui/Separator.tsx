import { cx } from "class-variance-authority";

export interface SeparatorProps {
  className?: string;
}

export function Separator({ className }: SeparatorProps) {
  return (
    <div
      aria-hidden="true"
      className={cx("h-px w-full", className)}
      style={{
        background:
          "linear-gradient(to right, transparent, color-mix(in srgb, var(--gold) 30%, transparent), transparent)",
      }}
    />
  );
}
