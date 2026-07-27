import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import NotFoundView from "@/components/NotFoundView";

export const metadata: Metadata = {
  title: "Pagina nu există",
  robots: { index: false, follow: true },
};

/**
 * Lives at the root rather than inside the (site) group: Next renders it under
 * the root layout for any unmatched URL, so the frame is assembled here.
 */
export default function NotFound() {
  return (
    <>
      <Nav />
      <main>
        <NotFoundView />
      </main>
      <Footer />
    </>
  );
}
