import type { MetadataRoute } from "next";
import { livePortfolio } from "@/app/api/_data/live";
import { AGENTS } from "@/lib/agents";
import { COMPLEXES } from "@/lib/complexes";
import { AGENCY } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await livePortfolio();
  const url = (path: string) => `${AGENCY.origin}${path}`;

  /* Dates come from the portfolio, never from the clock: a sitemap that changes
     every time it is requested teaches a crawler to ignore lastModified. */
  const NEWEST = properties.reduce(
    (latest, p) => (p.updatedAt > latest ? p.updatedAt : latest),
    "2026-07-01"
  );

  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: NEWEST, changeFrequency: "daily", priority: 1 },
    { url: url("/proprietati"), lastModified: NEWEST, changeFrequency: "daily", priority: 0.9 },
    { url: url("/proprietati?tranzactie=chirie"), lastModified: NEWEST, changeFrequency: "daily", priority: 0.8 },
    { url: url("/complexe"), lastModified: NEWEST, changeFrequency: "weekly", priority: 0.7 },
    { url: url("/indice"), lastModified: NEWEST, changeFrequency: "weekly", priority: 0.7 },
    { url: url("/vinde"), lastModified: NEWEST, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/credit"), lastModified: NEWEST, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/ghid"), lastModified: NEWEST, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/agenti"), lastModified: NEWEST, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/despre"), lastModified: NEWEST, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/contact"), lastModified: NEWEST, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/confidentialitate"), lastModified: NEWEST, changeFrequency: "yearly", priority: 0.2 },
  ];

  for (const p of properties) {
    if (p.status === "arhivat") continue;
    pages.push({
      url: url(`/proprietati/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const c of COMPLEXES) {
    pages.push({
      url: url(`/complexe/${c.slug}`),
      lastModified: NEWEST,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const a of AGENTS) {
    pages.push({
      url: url(`/agenti/${a.slug}`),
      lastModified: NEWEST,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return pages;
}
