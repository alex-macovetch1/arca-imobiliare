import type { Metadata } from "next";
import { INDEX_ROWS } from "@/lib/market-index";
import type { Sector } from "@/lib/types";
import GuideView, { type SectorNote } from "./GuideView";

export const metadata: Metadata = {
  title: "Ghidul cumpărătorului de apartament în Chișinău",
  description:
    "Pașii unei cumpărări în Chișinău, actele care se verifică, ce se întreabă la vizionare și cum arată fiecare sector — scris de agenții care fac tranzacțiile.",
  alternates: { canonical: "/ghid" },
};

/* City sectors first: the guide is read by someone choosing a neighbourhood. */
const ORDER: Sector[] = [
  "centru",
  "botanica",
  "buiucani",
  "riscani",
  "ciocana",
  "telecentru",
  "posta-veche",
];

export default function GuidePage() {
  const notes: SectorNote[] = ORDER.map((sector) => {
    const row = INDEX_ROWS.find((r) => r.sector === sector);
    return {
      sector,
      median: row?.sale?.median ?? 0,
      offers: row?.offers ?? 0,
    };
  }).filter((n) => n.offers > 0);

  return <GuideView notes={notes} />;
}
