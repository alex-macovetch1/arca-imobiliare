import type { Metadata } from "next";
import { COMPLEXES, complexProperties } from "@/lib/complexes";
import ComplexesView, { type ComplexCard } from "./ComplexesView";

export const metadata: Metadata = {
  title: "Ansambluri rezidențiale în Chișinău",
  description:
    "Ansamblurile rezidențiale în care ARCA are apartamente: dezvoltator, stadiu, preț de pornire pe metru pătrat și ofertele active din fiecare bloc.",
  alternates: { canonical: "/complexe" },
};

export default function ComplexesPage() {
  const items: ComplexCard[] = COMPLEXES.map((complex) => {
    const list = complexProperties(complex.slug);
    return {
      complex,
      offers: list.length,
      /* The cheapest active offer, so the card promises a price that exists. */
      fromPrice: list.length ? Math.min(...list.map((p) => p.price)) : null,
      deals: [...new Set(list.map((p) => p.deal))],
    };
  });

  return <ComplexesView items={items} />;
}
