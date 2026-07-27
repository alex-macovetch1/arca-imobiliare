import type { Metadata } from "next";
import { livePortfolio } from "@/app/api/_data/live";
import { applyFilters, parseFilters } from "@/components/FiltersCore";
import { KIND_PLURAL, SECTOR_IN } from "@/lib/content";
import PropertiesBrowser from "./PropertiesBrowser";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** The server renders Romanian; the visitor's choice is applied after mount. */
function toParams(raw: Record<string, string | string[] | undefined>): URLSearchParams {
  const p = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") p.set(key, value);
    else if (Array.isArray(value) && value[0]) p.set(key, value[0]);
  }
  return p;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const filters = parseFilters(toParams(await props.searchParams));
  const items = await livePortfolio();
  const kind = filters.kinds.length === 1 ? KIND_PLURAL[filters.kinds[0]].ro : "Proprietăți";
  const deal = filters.deal === "chirie" ? "de închiriat" : "de vânzare";
  const where = filters.sectors.length === 1 ? SECTOR_IN[filters.sectors[0]].ro : "în Chișinău";
  const title = `${kind} ${deal} ${where}`;
  const found = applyFilters(items, filters).length;

  return {
    title,
    description: `${found} oferte în portofoliul ARCA: ${title.toLowerCase()}. Preț, €/m², etaj și an de construcție pe fiecare anunț, filtre pe sector, cameră și buget.`,
    alternates: { canonical: "/proprietati" },
    openGraph: {
      title,
      description: `${found} oferte în portofoliul ARCA, actualizate săptămânal.`,
      images: [items[0].photos[0].src],
    },
  };
}

/* The whole search state is the query string, so the page is rendered per
   request: that also lets the results exist in the HTML rather than appearing
   after hydration. */
export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  return <PropertiesBrowser items={await livePortfolio()} />;
}
