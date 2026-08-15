import type { ReactNode } from "react";

export interface LandingEditorShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function LandingEditorShell({
  title,
  description,
  children,
}: LandingEditorShellProps) {
  return (
    <main
      className="mx-auto w-[min(100%,1440px)]"
      style={{
        paddingInline: "clamp(16px, 2vw, 28px)",
        paddingTop: "clamp(12px, 1.5vw, 20px)",
        paddingBottom: "clamp(20px, 2.5vw, 32px)",
      }}
    >
      <header className="mb-4 border-b border-[#ede9e2] pb-3">
        <h1 className="text-[20px] font-semibold leading-tight text-text">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 text-[13px] leading-relaxed text-text-mid">
            {description}
          </p>
        ) : null}
      </header>

      <section>{children}</section>
    </main>
  );
}
