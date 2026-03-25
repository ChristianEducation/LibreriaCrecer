"use client";

import { cx } from "class-variance-authority";

export interface AdminMetricCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  delta?: string;
  deltaType?: "up" | "down";
  variant?: "gold" | "green" | "blue" | "purple";
}

const variantMap = {
  gold: {
    accent: "bg-gold/15",
    icon: "text-gold",
  },
  green: {
    accent: "bg-[#27AE60]/15",
    icon: "text-[#27AE60]",
  },
  blue: {
    accent: "bg-[#2980B9]/15",
    icon: "text-[#2980B9]",
  },
  purple: {
    accent: "bg-[#8B5CF6]/15",
    icon: "text-[#8B5CF6]",
  },
} as const;

export function AdminMetricCard({
  icon,
  value,
  label,
  delta,
  deltaType,
  variant = "gold",
}: AdminMetricCardProps) {
  const palette = variantMap[variant];

  return (
    <article className="relative overflow-hidden rounded-[2px] border border-border bg-white p-5">
      <div className={cx("absolute right-0 top-0 h-[60px] w-[60px] rounded-bl-[60px] opacity-100", palette.accent)} />

      <div className={cx("mb-[10px] text-[22px]", palette.icon)}>{icon}</div>
      <div className="font-serif text-[2rem] font-semibold leading-none text-text">{value}</div>
      <div className="mt-1 text-[0.72rem] text-text-mid">{label}</div>

      {delta ? (
        <span
          className={cx(
            "mt-2 inline-flex rounded-[10px] px-[7px] py-[2px] text-[0.68rem] font-semibold",
            deltaType === "down"
              ? "bg-[rgba(192,57,43,0.08)] text-[#C0392B]"
              : "bg-[rgba(39,174,96,0.1)] text-[#27AE60]",
          )}
        >
          {delta}
        </span>
      ) : null}
    </article>
  );
}
