import type { Metadata, Viewport } from "next";
import { Literata, Manrope } from "next/font/google";
import { LangProvider } from "@/lib/lang";
import { AGENCY } from "@/lib/content";
import "./globals.css";

// Both are variable fonts, so no `weight` key — passing one makes next/font
// throw at build. Cyrillic is not optional here: half the site is in Russian.
const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(AGENCY.origin),
  title: {
    default: "ARCA — Agenție imobiliară în Chișinău",
    template: "%s · ARCA",
  },
  description:
    "Apartamente, case și spații comerciale în Chișinău și suburbii. Portofoliu verificat, €/m² afișat pe fiecare ofertă și Indicele ARCA al pieței.",
  keywords: [
    "imobiliare Chișinău",
    "apartamente de vânzare Chișinău",
    "chirie apartamente Chișinău",
    "agenție imobiliară Moldova",
    "недвижимость Кишинёв",
    "квартиры в Кишинёве",
  ],
  openGraph: {
    type: "website",
    locale: "ro_MD",
    siteName: "ARCA",
    title: "ARCA — Acasă începe aici",
    description:
      "Apartamente, case și spații comerciale în Chișinău și suburbii. Cu €/m² pe fiecare ofertă și Indicele ARCA al pieței.",
    images: ["/img/hero.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3b32",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" data-lang="ro" className={`${literata.variable} ${manrope.variable}`}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
