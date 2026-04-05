import { cx } from "class-variance-authority";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleEm?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  titleEm,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  const isCentered = align === "center";

  return (
    <div className={cx("flex flex-col gap-3", isCentered ? "items-center text-center" : "", className)}>
      {eyebrow ? (
        <div
          className={cx(
            "section-eyebrow flex items-center gap-3 font-medium uppercase tracking-[0.35em] text-gold",
            isCentered ? "justify-center" : "",
          )}
        >
          <span className="h-px w-6 bg-gold" />
          <span>{eyebrow}</span>
        </div>
      ) : null}

      <h2 className="font-serif text-[clamp(28px,2.8vw,42px)] font-normal leading-[1.15] tracking-[-0.01em] text-moss">
        {title}
        {titleEm ? (
          <>
            {" "}
            <em className="font-normal italic">{titleEm}</em>
          </>
        ) : null}
      </h2>

      {description ? (
        <p
          className={cx(
            "max-w-[400px] text-sm font-light leading-[1.75] text-text-light",
            isCentered ? "mx-auto" : "",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
