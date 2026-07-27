import type { Metadata } from "next";
import { livePortfolio } from "@/app/api/_data/live";
import AboutView from "./AboutView";

export const metadata: Metadata = {
  title: "Despre ARCA",
  description:
    "Paisprezece ani în imobiliarele Chișinăului: cum selectăm proprietățile, de ce fotografiem noi fiecare apartament și ce verificăm în acte înainte să punem un anunț pe site.",
  alternates: { canonical: "/despre" },
};

export default async function AboutPage() {
  const active = (await livePortfolio()).filter((p) => p.status === "activ").length;
  return <AboutView portfolio={active} />;
}
