import type { Metadata } from "next";
import { CITY_SALE } from "@/lib/market-index";
import CreditView from "./CreditView";

export const metadata: Metadata = {
  title: "Credit ipotecar în Moldova — calculator și condiții",
  description:
    "Cât ar însemna rata lunară, ce avans cer băncile din Moldova, ce acte se pregătesc și în cât timp se aprobă un credit ipotecar. Calculator și pașii, explicați pe scurt.",
  alternates: { canonical: "/credit" },
};

/** The calculator opens on a realistic figure: the median two-room flat. */
export default function CreditPage() {
  const start = Math.round((CITY_SALE.median * 60) / 500) * 500;
  return <CreditView startPrice={start} />;
}
