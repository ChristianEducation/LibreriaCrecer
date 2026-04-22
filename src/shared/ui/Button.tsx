"use client";

import * as React from "react";
import { cva, cx } from "class-variance-authority";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded border text-center font-sans transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/20 focus-visible:ring-offset-2 focus-visible:ring-offset-beige",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary:
          "rounded-full border-transparent bg-gold text-white hover:-translate-y-px hover:bg-gold-light active:scale-[0.97] active:transition-none",
        moss: "rounded-full border-transparent bg-moss text-white hover:-translate-y-px hover:bg-moss-mid active:scale-[0.97] active:transition-none",
        outline: "border-moss bg-transparent text-moss hover:bg-moss hover:text-white",
        ghost:
          "rounded-none border-x-0 border-t-0 border-b border-b-transparent bg-transparent px-0 py-1 text-[12px] font-medium uppercase tracking-[0.08em] text-moss hover:border-b-moss",
        "add-to-cart":
          "rounded-full border-transparent bg-gold text-white hover:scale-[1.03] hover:bg-gold-light active:scale-[0.97] active:transition-none",
        secondary:
          "rounded-none border-x-0 border-t-0 border-b border-b-white/25 bg-transparent px-0 py-1 text-[12px] font-medium uppercase tracking-[0.08em] text-white/70 hover:border-b-gold-light hover:text-gold-light",
      },
      size: {
        sm: "min-h-9 px-4 py-2 text-[11px] tracking-[0.08em]",
        md: "min-h-11 px-8 py-[13px] text-[12px] tracking-[0.1em]",
        lg: "min-h-12 px-10 py-[15px] text-[12px] tracking-[0.12em]",
      },
    },
    compoundVariants: [
      {
        variant: "ghost",
        size: "sm",
        className: "min-h-auto px-0 py-1",
      },
      {
        variant: "ghost",
        size: "md",
        className: "min-h-auto px-0 py-1",
      },
      {
        variant: "ghost",
        size: "lg",
        className: "min-h-auto px-0 py-1",
      },
      {
        variant: "secondary",
        size: "sm",
        className: "min-h-auto px-0 py-1",
      },
      {
        variant: "secondary",
        size: "md",
        className: "min-h-auto px-0 py-1",
      },
      {
        variant: "secondary",
        size: "lg",
        className: "min-h-auto px-0 py-1",
      },
      {
        variant: "add-to-cart",
        size: "sm",
        className: "min-h-auto px-[18px] py-[9px] text-[10px] tracking-[0.1em]",
      },
      {
        variant: "add-to-cart",
        size: "md",
        className: "min-h-auto px-[18px] py-[9px] text-[10px] tracking-[0.1em]",
      },
      {
        variant: "add-to-cart",
        size: "lg",
        className: "min-h-auto px-[18px] py-[9px] text-[10px] tracking-[0.1em]",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function LoadingSpinner() {
  return (
    <span
      aria-hidden="true"
      className="size-3 animate-spin rounded-full border border-current border-t-transparent"
    />
  );
}

export interface ButtonProps {
  variant?: "primary" | "moss" | "outline" | "ghost" | "add-to-cart" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  as?: "button" | "a";
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  as = "button",
  href,
  onClick,
  children,
  className,
  type = "button",
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const classes = cx(
    buttonVariants({ variant, size }),
    "uppercase",
    className,
  );

  if (as === "a") {
    return (
      <a
        aria-disabled={isDisabled}
        className={classes}
        href={isDisabled ? undefined : href}
        onClick={(event) => {
          if (isDisabled) {
            event.preventDefault();
            return;
          }

          onClick?.(event);
        }}
      >
        {loading ? <LoadingSpinner /> : null}
        <span>{children}</span>
      </a>
    );
  }

  return (
    <button className={classes} disabled={isDisabled} onClick={onClick} type={type}>
      {loading ? <LoadingSpinner /> : null}
      <span>{children}</span>
    </button>
  );
}
