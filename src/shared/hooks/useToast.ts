"use client";

import { useCallback, useSyncExternalStore } from "react";

export type ToastVariant = "success" | "error" | "info";

export type ToastInput = {
  message: string;
  variant?: ToastVariant;
  duration?: number;
};

export type ToastItem = {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
};

type ToastStore = {
  toasts: ToastItem[];
};

const listeners = new Set<() => void>();
const timeouts = new Map<string, number>();

let store: ToastStore = {
  toasts: [],
};

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return store;
}

function dismissToast(id: string) {
  const timeoutId = timeouts.get(id);
  if (typeof timeoutId === "number") {
    window.clearTimeout(timeoutId);
    timeouts.delete(id);
  }

  store = {
    toasts: store.toasts.filter((toast) => toast.id !== id),
  };

  emitChange();
}

function pushToast({ message, variant = "success", duration = 3000 }: ToastInput) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const toast: ToastItem = {
    id,
    message,
    variant,
    duration,
  };

  store = {
    toasts: [...store.toasts, toast],
  };

  emitChange();

  const timeoutId = window.setTimeout(() => {
    dismissToast(id);
  }, duration);

  timeouts.set(id, timeoutId);

  return id;
}

export function useToast() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const toast = useCallback((input: ToastInput) => pushToast(input), []);
  const dismiss = useCallback((id: string) => dismissToast(id), []);

  return {
    toasts: snapshot.toasts,
    toast,
    dismiss,
  };
}
