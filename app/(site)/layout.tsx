import ContactRail from "@/components/ContactRail";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";

/** Every public page shares this frame. /admin sits outside the group on
 *  purpose — it has no nav, no footer and no contact rail. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
      <ContactRail />
      <Reveal />
    </>
  );
}
