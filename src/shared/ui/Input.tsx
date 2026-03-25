"use client";

import * as React from "react";
import { cva, cx } from "class-variance-authority";

const fieldBaseStyles = cva(
  [
    "w-full rounded border bg-white px-[14px] py-[10px] font-sans text-sm text-text transition-[border-color,box-shadow] duration-200",
    "placeholder:text-text-light focus:outline-none focus:ring-4",
  ],
  {
    variants: {
      hasError: {
        true: "border-error focus:border-error focus:ring-error/10",
        false: "border-border focus:border-gold focus:ring-gold/10",
      },
    },
    defaultVariants: {
      hasError: false,
    },
  },
);

const labelClassName =
  "mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-text-light";
const metaClassName = "mt-2 text-[11px] leading-relaxed";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, wrapperClassName, className, id, ...props },
  ref,
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cx("w-full", wrapperClassName)}>
      {label ? (
        <label className={labelClassName} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        className={cx(fieldBaseStyles({ hasError: Boolean(error) }), className)}
        id={inputId}
        ref={ref}
        {...props}
      />
      {error ? <p className={cx(metaClassName, "text-error")}>{error}</p> : null}
      {!error && hint ? <p className={cx(metaClassName, "text-text-light")}>{hint}</p> : null}
    </div>
  );
});

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, wrapperClassName, className, id, rows = 4, ...props },
  ref,
) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;

  return (
    <div className={cx("w-full", wrapperClassName)}>
      {label ? (
        <label className={labelClassName} htmlFor={textareaId}>
          {label}
        </label>
      ) : null}
      <textarea
        className={cx(
          fieldBaseStyles({ hasError: Boolean(error) }),
          "min-h-24 resize-y",
          className,
        )}
        id={textareaId}
        ref={ref}
        rows={rows}
        {...props}
      />
      {error ? <p className={cx(metaClassName, "text-error")}>{error}</p> : null}
      {!error && hint ? <p className={cx(metaClassName, "text-text-light")}>{hint}</p> : null}
    </div>
  );
});
