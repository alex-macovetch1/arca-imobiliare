import type { Metadata } from "next";
import { livePortfolio } from "@/app/api/_data/live";
import AgentsView from "./AgentsView";

export const metadata: Metadata = {
  title: "Agenții ARCA",
  description:
    "Cei patru agenți ARCA, sectoarele pe care le acoperă, limbile în care lucrează și telefonul fiecăruia. În Chișinău relația e cu omul, nu cu agenția.",
  alternates: { canonical: "/agenti" },
};

export default async function AgentsPage() {
  const counts: Record<string, number> = {};
  for (const property of await livePortfolio()) {
    if (property.status === "activ") {
      counts[property.agentSlug] = (counts[property.agentSlug] ?? 0) + 1;
    }
  }

  return <AgentsView counts={counts} />;
}
