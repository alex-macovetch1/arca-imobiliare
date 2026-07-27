import type { Metadata } from "next";
import PrivacyView from "./PrivacyView";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description:
    "Ce date colectăm prin formularele de pe site, de ce le colectăm, cât le păstrăm și cum cereți ștergerea lor.",
  alternates: { canonical: "/confidentialitate" },
};

export default function PrivacyPage() {
  return <PrivacyView />;
}
