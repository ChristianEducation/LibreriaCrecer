"use client";

import { cx } from "class-variance-authority";

export interface AdminUploadZoneProps {
  label?: string;
  hint?: string;
  onFileSelect?: (file: File) => void;
  previewUrl?: string | null;
  className?: string;
}

export function AdminUploadZone({
  label,
  hint,
  onFileSelect,
  previewUrl,
  className,
}: AdminUploadZoneProps) {
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
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onFileSelect?.(file);
          }
        }}
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
