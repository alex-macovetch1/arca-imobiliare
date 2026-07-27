import PropertyCard from "./PropertyCard";
import type { Property } from "@/lib/types";

/**
 * The three closest listings by sector and price. The card is the same one the
 * results page and the homepage use — a listing must not look different here
 * than it does where the visitor found it.
 */
export default function SimilarList({ properties }: { properties: Property[] }) {
  if (properties.length === 0) return null;

  return (
    <div className="grid-cards">
      {properties.map((p, i) => (
        <PropertyCard key={p.slug} property={p} delay={Math.min(i, 5) * 60} />
      ))}
    </div>
  );
}
