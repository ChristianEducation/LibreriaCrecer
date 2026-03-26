"use client";

import { useState } from "react";

type TopBannerClientProps = {
  title: string;
  description: string | null;
  linkUrl: string | null;
};

export function TopBannerClient({ title, description, linkUrl }: TopBannerClientProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div
      style={{
        maxHeight: isVisible ? "80px" : "0",
        overflow: "hidden",
        transition: "max-height 0.3s ease",
      }}
    >
      <div
        className="bg-moss"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0.5rem 3rem",
          textAlign: "center",
        }}
      >
        <div>
          {linkUrl ? (
            <a
              href={linkUrl}
              style={{
                fontSize: "12px",
                letterSpacing: "0.04em",
                color: "rgba(255,255,255,0.9)",
                textDecoration: "underline",
                textDecorationColor: "rgba(255,255,255,0.3)",
              }}
            >
              {title}
            </a>
          ) : (
            <span
              style={{
                fontSize: "12px",
                letterSpacing: "0.04em",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {title}
            </span>
          )}
          {description && (
            <p
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.6)",
                marginTop: "1px",
              }}
            >
              {description}
            </p>
          )}
        </div>

        <button
          aria-label="Cerrar banner"
          onClick={() => setIsVisible(false)}
          style={{
            position: "absolute",
            right: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px",
            transition: "color 200ms",
          }}
          type="button"
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,1)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
        >
          <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
