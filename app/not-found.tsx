import type { Metadata } from "next";
import ContactRail from "@/components/ContactRail";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import NotFoundView from "@/components/NotFoundView";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Pagina nu există",
  robots: { index: false, follow: true },
};

/**
 * Lives at the root rather than inside the (site) group: Next renders it under
 * the root layout for any unmatched URL, so the frame is assembled here —
 * including the reveal observer, without which the footer signature would stay
 * at opacity 0, and the contact rail, which a lost visitor needs most.
 */
export default function NotFound() {
  return (
    <>
      <Nav />
      <main>
        <NotFoundView />
      </main>
      <Footer />
      <ContactRail />
      <Reveal />
    </>
  );
}
