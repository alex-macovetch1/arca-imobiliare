import type { Metadata } from "next";
import { livePortfolio } from "@/app/api/_data/live";
import FavoritesView from "./FavoritesView";

export const metadata: Metadata = {
  title: "Proprietăți salvate",
  description:
    "Proprietățile pe care le-ați salvat pe acest dispozitiv. Lista se păstrează în browser, fără cont și fără parolă.",
  alternates: { canonical: "/favorite" },
  robots: { index: false, follow: true },
};

export default async function FavoritesPage() {
  return <FavoritesView items={await livePortfolio()} />;
}
