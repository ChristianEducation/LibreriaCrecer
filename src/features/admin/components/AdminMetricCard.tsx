"use client";

export interface AdminMetricCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  delta?: string;
  deltaType?: "up" | "down";
  variant?: "gold" | "green" | "blue" | "purple";
}

const variantPalette: Record<NonNullable<AdminMetricCardProps["variant"]>, { accent: string; tint: string; icon: string }> = {
  gold: {
    accent: "var(--gold)",
    tint: "rgba(200, 168, 48, 0.12)",
    icon: "var(--gold)",
  },
  green: {
    accent: "var(--success)",
    tint: "rgba(39, 174, 96, 0.12)",
    icon: "var(--success)",
  },
  blue: {
    accent: "var(--info)",
    tint: "rgba(41, 128, 185, 0.12)",
    icon: "var(--info)",
  },
  purple: {
    accent: "var(--moss)",
    tint: "rgba(115, 96, 2, 0.12)",
    icon: "var(--moss)",
  },
};

export function AdminMetricCard({
  icon,
  value,
  label,
  delta,
  deltaType,
  variant = "gold",
}: AdminMetricCardProps) {
  const palette = variantPalette[variant];
  const deltaColor = deltaType === "down" ? "var(--error)" : "var(--success)";

  return (
    <article
      className="admin-card"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "22px 24px",
        minHeight: 132,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: 3,
          background: `linear-gradient(90deg, ${palette.accent}, transparent)`,
        }}
      />

      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: palette.tint,
          color: palette.icon,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "var(--text-light)",
          marginBottom: 8,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          color: "var(--text)",
        }}
      >
        {value}
      </div>

      {delta ? (
        <div
          style={{
            marginTop: 8,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 500,
            color: deltaColor,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: deltaColor,
              opacity: 0.7,
              display: "inline-block",
            }}
          />
          {delta}
        </div>
      ) : null}
    </article>
  );
}
