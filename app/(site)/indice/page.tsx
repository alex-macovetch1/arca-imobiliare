import type { Metadata } from "next";
import {
  CITY_RENT,
  CITY_SALE,
  INDEX_MAX,
  INDEX_ROWS,
  INDEX_UPDATED,
} from "@/lib/market-index";
import IndexView from "./IndexView";

export const metadata: Metadata = {
  title: "Indicele ARCA — prețul metrului pătrat în Chișinău",
  description:
    "Mediana ofertelor active din portofoliul ARCA, pe sector: cât costă metrul pătrat la vânzare și cât se cere lunar pe chirie în Chișinău. Actualizat la fiecare listare nouă.",
  alternates: { canonical: "/indice" },
};

/** The figures are computed on the server; the page ships only the table. */
export default function IndexPage() {
  return (
    <IndexView
      rows={INDEX_ROWS}
      city={CITY_SALE}
      cityRent={CITY_RENT}
      max={INDEX_MAX}
      updated={INDEX_UPDATED}
    />
  );
}
