import Image from "next/image";
import Link from "next/link";

type EncounterCard = {
  coverImageUrl: string;
  eventDate: string;
  excerpt: string | null;
  id: string;
  slug: string;
  title: string;
};

type EncounterCardsProps = {
  encounters: EncounterCard[];
};

function formatEncounterDate(date: string) {
  return new Date(date).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  });
}

export function EncounterCards({ encounters }: EncounterCardsProps) {
  return (
    <div className="encounter-card-grid">
      {encounters.map((encounter) => (
        <Link
          className="encounter-card"
          href={`/encuentros/${encounter.slug}`}
          key={encounter.id}
        >
          <div className="encounter-card-media">
            <Image
              alt={encounter.title}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw"
              src={encounter.coverImageUrl}
            />
          </div>

          <div className="encounter-card-copy">
            <p className="encounter-card-date">{formatEncounterDate(encounter.eventDate)}</p>
            <h3>{encounter.title}</h3>
            {encounter.excerpt ? <p className="encounter-card-excerpt">{encounter.excerpt}</p> : null}
            <span className="encounter-card-link">
              Ver galería
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
