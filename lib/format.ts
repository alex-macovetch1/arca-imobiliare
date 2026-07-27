import type { Floor, Lang, Property } from "./types";

/* ---------------------------------------------------------------------------
   One implementation of every number and date the site prints. Nothing formats
   a price inline: two agents would pick two separators and the site would look
   assembled from parts.
   --------------------------------------------------------------------------- */

/** Thousands separator. A non-breaking space, so "89 500 €" never wraps. */
const NBSP = " ";

/** Single rate for the whole site, so the MDL figure never contradicts itself. */
export const EUR_MDL = 20.05;

function groups(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

/** "89 500 €" — identical in both languages, euro after the digits. */
export function formatPrice(value: number): string {
  return `${groups(value)}${NBSP}€`;
}

/** "700 €/lună" / "700 €/мес." */
export function formatRent(value: number, lang: Lang): string {
  return `${groups(value)}${NBSP}€/${lang === "ru" ? "мес." : "lună"}`;
}

/** Picks price or rent from the property itself, so no caller has to branch. */
export function formatDealPrice(p: Property, lang: Lang): string {
  return p.deal === "chirie" ? formatRent(p.price, lang) : formatPrice(p.price);
}

/** "2 180 €/m²" / "2 180 €/м²" */
export function formatPricePerSqm(value: number, lang: Lang): string {
  return `${groups(value)}${NBSP}€/${lang === "ru" ? "м²" : "m²"}`;
}

/* Chisinau keeps its street names in Romanian in both languages; what changes
   is the abbreviation in front of them, and a Russian page that still says
   "str." reads like a page nobody finished. */
const STREET_RU: Record<string, string> = {
  "str.": "ул.",
  "bd.": "бул.",
  "șos.": "шос.",
  "sos.": "шос.",
  "str-la": "пер.",
};

/** "str. Kiev 8" -> "ул. Kiev 8" in Russian, untouched in Romanian. */
export function formatStreet(street: string, lang: Lang): string {
  if (lang !== "ru") return street;
  const at = street.indexOf(" ");
  if (at < 0) return street;
  const head = STREET_RU[street.slice(0, at).toLowerCase()];
  return head ? `${head}${street.slice(at)}` : street;
}

/** "67 m²", "37,6 m²" — comma decimal, one place, trailing zero dropped. */
export function formatArea(value: number, lang: Lang): string {
  const unit = lang === "ru" ? "м²" : "m²";
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded)
    ? groups(rounded)
    : `${groups(Math.trunc(rounded))},${Math.round((rounded - Math.trunc(rounded)) * 10)}`;
  return `${text}${NBSP}${unit}`;
}

/** "6,5 ari" / "6,5 сотки" — land, houses only. */
export function formatLand(ari: number, lang: Lang): string {
  const text = Number.isInteger(ari) ? String(ari) : String(ari).replace(".", ",");
  return `${text}${NBSP}${lang === "ru" ? "сот." : "ari"}`;
}

/** "Etaj 4 / 9" / "Этаж 4 / 9"; ground floor becomes "Parter / 5" / "1-й / 5". */
export function formatFloor(floor: Floor, floors: number, lang: Lang): string {
  const total = floors > 0 ? `${NBSP}/${NBSP}${floors}` : "";
  if (floor === "parter") return `${lang === "ru" ? "1-й" : "Parter"}${total}`;
  if (floor === "demisol") return `${lang === "ru" ? "Цоколь" : "Demisol"}${total}`;
  if (floor === "mansarda") return `${lang === "ru" ? "Мансарда" : "Mansardă"}${total}`;
  return `${lang === "ru" ? "Этаж" : "Etaj"}${NBSP}${floor}${total}`;
}

/** The short form used inside a card's spec row: "Etaj 4/9". */
export function formatFloorShort(floor: Floor, floors: number, lang: Lang): string {
  if (floor === "parter") return `${lang === "ru" ? "1-й" : "Parter"}/${floors}`;
  if (floor === "demisol") return lang === "ru" ? "Цоколь" : "Demisol";
  if (floor === "mansarda") return lang === "ru" ? "Мансарда" : "Mansardă";
  return `${lang === "ru" ? "Этаж" : "Etaj"}${NBSP}${floor}/${floors}`;
}

/** "2022 (finalizat)" / "2026 (в строительстве)" */
export function formatYear(
  year: number,
  status: "finalizat" | "in-constructie",
  lang: Lang
): string {
  const note =
    status === "in-constructie"
      ? lang === "ru"
        ? "в строительстве"
        : "în construcție"
      : lang === "ru"
        ? "сдан"
        : "finalizat";
  return `${year} (${note})`;
}

/** "140 m" under a kilometre, "1,2 km" above. */
export function formatMeters(meters: number, lang: Lang): string {
  if (meters < 1000) return `${Math.round(meters)}${NBSP}${lang === "ru" ? "м" : "m"}`;
  const km = Math.round(meters / 100) / 10;
  return `${String(km).replace(".", ",")}${NBSP}${lang === "ru" ? "км" : "km"}`;
}

/** "≈ 1 795 000 MDL" — listing page only, never on a card. */
export function toMDL(eur: number): string {
  return `≈${NBSP}${groups(eur * EUR_MDL)}${NBSP}MDL`;
}

const MONTHS_RO = [
  "ianuarie",
  "februarie",
  "martie",
  "aprilie",
  "mai",
  "iunie",
  "iulie",
  "august",
  "septembrie",
  "octombrie",
  "noiembrie",
  "decembrie",
];

// Genitive: a Russian date reads "24 июля", never "24 июль".
const MONTHS_RU = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

/** "24 iulie 2026" / "24 июля 2026" — the month is written, never 24.07. */
export function formatDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const month = (lang === "ru" ? MONTHS_RU : MONTHS_RO)[m - 1];
  return `${d} ${month} ${y}`;
}

/** "24 iulie, 16:20" — for the lead table, where the hour matters. */
export function formatDateTime(iso: string, lang: Lang): string {
  const dt = new Date(iso);
  const day = dt.getDate();
  const month = (lang === "ru" ? MONTHS_RU : MONTHS_RO)[dt.getMonth()];
  const hh = String(dt.getHours()).padStart(2, "0");
  const mm = String(dt.getMinutes()).padStart(2, "0");
  return `${day} ${month}, ${hh}:${mm}`;
}

/** Romanian needs "de" past 19: 24 de proprietăți, but 3 proprietăți. */
export function formatCount(n: number, one: string, many: string, lang: Lang): string {
  if (lang === "ru") return `${n} ${many}`;
  if (n === 1) return `1 ${one}`;
  const last2 = n % 100;
  return last2 >= 20 || last2 === 0 ? `${n} de ${many}` : `${n} ${many}`;
}

/** "3 camere" / "3 комн." — the rooms figure as it appears in a spec row. */
export function formatRooms(rooms: number, lang: Lang): string {
  if (lang === "ru") return `${rooms}${NBSP}комн.`;
  return rooms === 1 ? `1${NBSP}cameră` : `${rooms}${NBSP}camere`;
}

/**
 * Accepts what a Moldovan actually types — 069841640, 0 698 41 640,
 * +373 69 84 16 40 — and returns the single stored shape, or null.
 */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/[^\d+]/g, "");
  let body = digits.startsWith("+373") ? digits.slice(4) : digits;
  if (body.startsWith("373")) body = body.slice(3);
  if (body.startsWith("0")) body = body.slice(1);
  return /^\d{8}$/.test(body) ? `+373${body}` : null;
}

/** "+373 69 84 16 40" — the stored number, spaced for reading. */
export function displayPhone(normalized: string): string {
  const b = normalized.replace("+373", "");
  return `+373 ${b.slice(0, 2)} ${b.slice(2, 4)} ${b.slice(4, 6)} ${b.slice(6, 8)}`;
}
