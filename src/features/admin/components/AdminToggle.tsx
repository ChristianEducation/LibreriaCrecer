"use client";

import { cx } from "class-variance-authority";

export interface AdminToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function AdminToggle({
  checked,
  onChange,
  ariaLabel,
  label,
  description,
  disabled = false,
  className,
}: AdminToggleProps) {
  const toggle = (
    <button
      aria-label={ariaLabel ?? label ?? "Cambiar estado"}
      aria-checked={checked}
      className={cx(
        "relative transition-colors duration-200",
        checked ? "bg-gold" : "bg-beige-mid",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      )}
      style={{ width: "36px", height: "20px", borderRadius: "999px" }}
      onClick={() => {
        if (!disabled) {
          onChange(!checked);
        }
      }}
      role="switch"
      type="button"
    >
      <span
        className="absolute transition-[transform,background-color] duration-200"
        style={{
          bottom: "3px",
          left: "3px",
          width: "14px",
          height: "14px",
          borderRadius: "999px",
          background: checked ? "var(--white)" : "var(--text-light)",
          transform: checked ? "translateX(16px)" : "translateX(0)",
        }}
      />
    </button>
  );

  if (!label && !description) {
    return <div className={className}>{toggle}</div>;
  }

  return (
    <div className={cx("flex items-center justify-between gap-4 py-[10px]", className)}>
      <div>
        {label ? <p className="text-[0.8rem] text-text-mid">{label}</p> : null}
        {description ? <p className="mt-1 text-[11px] text-text-light">{description}</p> : null}
      </div>
      {toggle}
    </div>
  );
}
