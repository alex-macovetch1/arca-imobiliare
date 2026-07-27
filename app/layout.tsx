import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { LangProvider } from "@/lib/lang";
import { AGENCY } from "@/lib/content";
import "./globals.css";

// Manrope is variable, so no `weight` key — passing one makes next/font throw
// at build. Cyrillic is not optional here: half the site is in Russian.
const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

// Instrument Serif ships a single weight and has no Cyrillic cut. That is
// fine: it is only ever used for one accented word, and the Russian side
// falls back to Georgia there rather than losing the whole heading.
const display = Instrument_Serif({
  variable: "--font-display",
  weight: "400",
  style: ["italic", "normal"],
  subsets: ["latin", "latin-ext"],
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
  themeColor: "#16307a",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" data-lang="ro" className={`${sans.variable} ${display.variable}`}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
