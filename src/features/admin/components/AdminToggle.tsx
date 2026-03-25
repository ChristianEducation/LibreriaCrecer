"use client";

import { cx } from "class-variance-authority";

export interface AdminToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function AdminToggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: AdminToggleProps) {
  const toggle = (
    <button
      aria-checked={checked}
      className={cx(
        "relative h-5 w-9 rounded-full transition-colors duration-200",
        checked ? "bg-gold" : "bg-beige-mid",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      )}
      onClick={() => {
        if (!disabled) {
          onChange(!checked);
        }
      }}
      role="switch"
      type="button"
    >
      <span
        className={cx(
          "absolute bottom-[3px] left-[3px] size-3.5 rounded-full transition-transform duration-200",
          checked ? "translate-x-4 bg-white" : "bg-text-light",
        )}
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
