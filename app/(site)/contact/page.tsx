import type { Metadata } from "next";
import ContactView from "./ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Telefon, email, adresa biroului de pe bulevardul Ștefan cel Mare și programul de lucru. Scrieți-ne sau sunați direct agentul care se ocupă de sectorul dumneavoastră.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactView />;
}
