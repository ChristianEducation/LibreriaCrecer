"use client";

export interface AdminMetricCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  delta?: string;
  /** Se conserva por compatibilidad: el estilo editorial usa un único tono para la nota. */
  deltaType?: "up" | "down";
  variant?: "gold" | "green" | "blue" | "purple";
}

const variantPalette: Record<NonNullable<AdminMetricCardProps["variant"]>, { tint: string; icon: string }> = {
  gold: { tint: "rgba(197, 160, 77, 0.17)", icon: "#a47f2c" },
  green: { tint: "rgba(63, 143, 107, 0.14)", icon: "#3f8f6b" },
  blue: { tint: "rgba(197, 160, 77, 0.17)", icon: "#a47f2c" },
  purple: { tint: "rgba(197, 160, 77, 0.17)", icon: "#a47f2c" },
};

export function AdminMetricCard({ icon, value, label, delta, variant = "gold" }: AdminMetricCardProps) {
  const palette = variantPalette[variant];

  return (
    <article className={`admin-card adm-kpi${variant === "gold" ? " admin-card--gold" : ""}`}>
      <div className="adm-kpi-icon" style={{ background: palette.tint, color: palette.icon }}>
        {icon}
      </div>

      <div className="adm-kpi-label">{label}</div>
      <div className="adm-kpi-value">{value}</div>
      {delta ? <div className="adm-kpi-note">{delta}</div> : null}
    </article>
  );
}
