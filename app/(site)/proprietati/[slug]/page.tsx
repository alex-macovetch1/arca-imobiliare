import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { livePortfolio } from "@/app/api/_data/live";
import { getAgent } from "@/lib/agents";
import { formatDealPrice } from "@/lib/format";
import { PROPERTIES } from "@/lib/properties";
import type { Property } from "@/lib/types";
import ListingView from "./ListingView";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return PROPERTIES.map((p) => ({ slug: p.slug }));
}

/** The opening paragraph, cut on a word so a search result never ends mid-word. */
function summarise(text: string, limit = 165): string {
  const first = text.split("\n\n")[0];
  if (first.length <= limit) return first;
  const cut = first.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/** Same sector and deal first, then whatever sits closest in price. */
function similarTo(p: Property, all: Property[]): Property[] {
  const distance = (o: Property) => Math.abs(o.price - p.price) / p.price;
  const pool = all.filter(
    (o) => o.slug !== p.slug && o.deal === p.deal && o.status !== "arhivat"
  );
  const near = pool
    .filter((o) => o.sector === p.sector && distance(o) <= 0.25)
    .sort((a, b) => distance(a) - distance(b));
  const rest = pool
    .filter((o) => !near.includes(o))
    .sort((a, b) => distance(a) - distance(b));
  return [...near, ...rest].slice(0, 3);
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const p = (await livePortfolio()).find((x) => x.slug === slug);
  if (!p) return {};

  const title = `${p.title.ro} — ${formatDealPrice(p, "ro")}`;
  const description = summarise(p.description.ro);
  const cover = p.photos[0];
  const url = `/proprietati/${p.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ro_MD",
      siteName: "ARCA",
      title,
      description,
      url,
      images: [
        {
          url: cover.src,
          width: cover.width,
          height: cover.height,
          alt: cover.alt.ro,
        },
      ],
    },
  };
}

export default async function PropertyPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const all = await livePortfolio();
  const property = all.find((p) => p.slug === slug);
  if (!property) notFound();

  const agent = getAgent(property.agentSlug);
  if (!agent) notFound();

  return <ListingView property={property} agent={agent} similar={similarTo(property, all)} />;
}
