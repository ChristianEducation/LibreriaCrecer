"use client";

import { useEffect, useState } from "react";
import { cx } from "class-variance-authority";

import { useToast } from "@/shared/hooks";

function ToastIcon({ variant }: { variant: "success" | "error" | "info" }) {
  if (variant === "error") {
    return (
      <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      </svg>
    );
  }

  if (variant === "info") {
    return (
      <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 10v5m0-7h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="m5 12 4.2 4L19 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ToastItem({
  id,
  message,
  variant,
  onDismiss,
}: {
  id: string;
  message: string;
  variant: "success" | "error" | "info";
  onDismiss: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className={cx(
        "pointer-events-auto flex items-center gap-2 rounded-[2px] px-[17px] py-[11px] text-[0.79rem] font-medium text-white shadow-[0_6px_24px_rgba(58,48,1,0.25)] transition-all duration-300",
        variant === "success" ? "bg-moss" : "",
        variant === "error" ? "bg-error" : "",
        variant === "info" ? "bg-[#2980B9]" : "",
        visible ? "translate-y-0 opacity-100" : "translate-y-[60px] opacity-0",
      )}
      role="status"
    >
      <ToastIcon variant={variant} />
      <span>{message}</span>
      <button
        aria-label="Cerrar notificacion"
        className="ml-1 text-white/70 transition-colors hover:text-white"
        onClick={() => onDismiss(id)}
        type="button"
      >
        ×
      </button>
    </div>
  );
}

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="pointer-events-none fixed bottom-[22px] right-[22px] z-[999] flex max-w-[calc(100vw-44px)] flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem
          id={toast.id}
          key={toast.id}
          message={toast.message}
          onDismiss={dismiss}
          variant={toast.variant}
        />
      ))}
    </div>
  );
}
