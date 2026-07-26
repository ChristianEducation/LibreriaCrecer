"use client";

import { useRef } from "react";
import { cx } from "class-variance-authority";

export interface AdminUploadZoneProps {
  label?: string;
  hint?: string;
  onFileSelect?: (file: File) => void;
  previewUrl?: string | null;
  className?: string;
  variant?: "dropzone" | "compact";
  selectedFileName?: string | null;
  onClearSelection?: () => void;
}

export function AdminUploadZone({
  label,
  hint,
  onFileSelect,
  previewUrl,
  className,
  variant = "dropzone",
  selectedFileName,
  onClearSelection,
}: AdminUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect?.(file);
    }
    event.target.value = "";
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  }

  if (variant === "compact") {
    return (
      <div className={cx("admin-upload-compact", className)}>
        <input
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
          ref={inputRef}
          type="file"
        />
        <span aria-hidden="true" className="admin-upload-compact-icon">+</span>
        <div className="admin-upload-compact-copy">
          <p>{selectedFileName ? "Nueva portada seleccionada" : "Selecciona una imagen de portada"}</p>
          <small>{selectedFileName ?? hint}</small>
        </div>
        <div className="admin-upload-compact-actions">
          <button onClick={() => inputRef.current?.click()} ref={triggerRef} type="button">
            {label ?? "Seleccionar portada"}
          </button>
          {selectedFileName && onClearSelection ? (
            <button className="admin-upload-compact-clear" onClick={onClearSelection} type="button">
              Cancelar cambio
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <label
      className={cx(
        "block cursor-pointer rounded-[2px] border-2 border-dashed border-border px-5 py-8 text-center transition-colors duration-200 hover:border-gold/50 hover:bg-gold/5",
        className,
      )}
    >
      <input
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
        ref={inputRef}
        type="file"
      />

      {previewUrl ? (
        <div className="mx-auto mb-4 aspect-[4/3] w-full max-w-[220px] overflow-hidden rounded-[2px] border border-border bg-beige">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Vista previa" className="h-full w-full object-cover" src={previewUrl} />
        </div>
      ) : (
        <div className="mb-2 text-[2rem] opacity-50">+</div>
      )}

      <p className="text-[0.78rem] text-text-mid">{label ?? "Arrastra una imagen o haz click para subir"}</p>
      {hint ? <p className="mt-1 text-[0.68rem] text-text-light">{hint}</p> : null}
    </label>
  );
}
