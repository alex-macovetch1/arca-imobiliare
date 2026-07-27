import type { Metadata } from "next";
import { CITY_SALE, INDEX_ROWS } from "@/lib/market-index";
import type { PriceBand } from "@/lib/market-index";
import type { Sector } from "@/lib/types";
import SellView from "./SellView";

export const metadata: Metadata = {
  title: "Vinde cu ARCA",
  description:
    "Evaluare gratuită în 24 de ore, ședință foto profesională, anunț în română și rusă și asistență până la notar. Aflați într-un minut între ce sume se vinde apartamentul dumneavoastră.",
  alternates: { canonical: "/vinde" },
};

/**
 * The estimator works from the same bands as /indice and the listing pages —
 * lib/market-index is the only place a €/m² figure is computed, so two screens
 * can never quote different numbers.
 */
export default function SellPage() {
  const bySector: Partial<Record<Sector, PriceBand>> = {};
  for (const row of INDEX_ROWS) {
    if (row.sale) bySector[row.sector] = row.sale;
  }

  return <SellView city={CITY_SALE} bySector={bySector} />;
}
