import { PROPERTIES } from "./properties";
import type { Deal, Property, Sector, T } from "./types";

/* ---------------------------------------------------------------------------
   The ARCA index: the €/m² bands of the portfolio, computed once, read by every
   screen that prints a market figure — the homepage band, the sector paragraph
   on the results page, the estimator on /vinde and the price position on a
   listing. One implementation, so two pages can never quote different numbers.

   These are asking prices of active offers, not transactions. Everything that
   shows a figure from here also shows INDEX_DISCLAIMER.
   --------------------------------------------------------------------------- */

export interface PriceBand {
  p25: number;
  median: number;
  p75: number;
  /** How many offers the band was computed from. */
  count: number;
}

export interface RentStat {
  /** Median monthly rent in EUR — a rental is read per month, not per m². */
  median: number;
  count: number;
}

export interface IndexRow {
  sector: Sector;
  sale: PriceBand | null;
  rent: RentStat | null;
  /** Active offers of any deal in the sector. */
  offers: number;
}

/**
 * Below this a sector says "prea puține oferte" instead of pretending. Two is
 * the honest floor for a portfolio this size: one offer is a price, not a
 * median, and the count is printed next to every figure anyway.
 */
const MIN_SAMPLE = 2;

const ACTIVE = PROPERTIES.filter((p) => p.status === "activ");

/* Flats and houses only: a plot or a shop follows a different logic and would
   drag the residential band with it. */
const SALE = ACTIVE.filter(
  (p) => p.deal === "vanzare" && p.pricePerSqm > 0 && (p.kind === "apartament" || p.kind === "casa")
);

const RENT = ACTIVE.filter((p) => p.deal === "chirie" && p.price > 0);

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(quantile([...values].sort((a, b) => a - b), 0.5));
}

function toBand(values: number[]): PriceBand {
  const sorted = [...values].sort((a, b) => a - b);
  /* Quartiles of two or three offers are interpolation, not statistics: they
     come out a few euro apart and read as a precision we do not have. Under
     four offers the band is simply the cheapest and the dearest. */
  const thin = sorted.length < 4;
  return {
    p25: Math.round(thin ? sorted[0] : quantile(sorted, 0.25)),
    median: Math.round(quantile(sorted, 0.5)),
    p75: Math.round(thin ? sorted[sorted.length - 1] : quantile(sorted, 0.75)),
    count: sorted.length,
  };
}

function group<K extends string>(list: Property[], key: (p: Property) => K, value: (p: Property) => number) {
  const out = new Map<K, number[]>();
  for (const p of list) {
    const k = key(p);
    const bucket = out.get(k) ?? [];
    bucket.push(value(p));
    out.set(k, bucket);
  }
  return out;
}

/** The whole city, every sale offer in the portfolio. */
export const CITY_SALE: PriceBand = toBand(SALE.map((p) => p.pricePerSqm));

export const CITY_RENT: RentStat = { median: median(RENT.map((p) => p.price)), count: RENT.length };

const SALE_BY_SECTOR: Partial<Record<Sector, PriceBand>> = (() => {
  const out: Partial<Record<Sector, PriceBand>> = {};
  for (const [sector, values] of group(SALE, (p) => p.sector, (p) => p.pricePerSqm)) {
    if (values.length >= MIN_SAMPLE) out[sector] = toBand(values);
  }
  return out;
})();

const RENT_BY_SECTOR: Partial<Record<Sector, RentStat>> = (() => {
  const out: Partial<Record<Sector, RentStat>> = {};
  for (const [sector, values] of group(RENT, (p) => p.sector, (p) => p.price)) {
    if (values.length >= MIN_SAMPLE) out[sector] = { median: median(values), count: values.length };
  }
  return out;
})();

/** The sale band of a sector, or the city band when the sample is too thin. */
export function saleBand(sector?: Sector): PriceBand {
  return (sector && SALE_BY_SECTOR[sector]) || CITY_SALE;
}

/** Null when the sector has too few offers — the caller decides what to say. */
export function sectorSaleBand(sector: Sector): PriceBand | null {
  return SALE_BY_SECTOR[sector] ?? null;
}

export function sectorRent(sector: Sector): RentStat | null {
  return RENT_BY_SECTOR[sector] ?? null;
}

/** The one figure the sector paragraph and the tiles print. */
export function sectorMedian(sector: Sector, deal: Deal): number {
  return deal === "chirie"
    ? (RENT_BY_SECTOR[sector]?.median ?? 0)
    : (SALE_BY_SECTOR[sector]?.median ?? 0);
}

/** Every sector that has offers, dearest first — the order of the index table. */
export const INDEX_ROWS: IndexRow[] = (() => {
  const sectors = new Set<Sector>(ACTIVE.map((p) => p.sector));
  return [...sectors]
    .map((sector) => ({
      sector,
      sale: SALE_BY_SECTOR[sector] ?? null,
      rent: RENT_BY_SECTOR[sector] ?? null,
      offers: ACTIVE.filter((p) => p.sector === sector).length,
    }))
    .sort((a, b) => (b.sale?.median ?? 0) - (a.sale?.median ?? 0) || b.offers - a.offers);
})();

/** The widest p75 on the table, so every bar is drawn against the same ruler. */
export const INDEX_MAX = Math.max(...INDEX_ROWS.map((r) => r.sale?.p75 ?? 0), CITY_SALE.p75);

/**
 * The date the index is quoted at. Taken from the portfolio rather than the
 * clock: a figure rendered on the server and hydrated on the client has to come
 * out identical, and "today" does not.
 */
export const INDEX_UPDATED: string = ACTIVE.reduce(
  (latest, p) => (p.updatedAt > latest ? p.updatedAt : latest),
  ACTIVE[0]?.updatedAt ?? "2026-07-01"
);

/* ---------------------------------------------------------------------------
   Where one listing sits inside its own sector
   --------------------------------------------------------------------------- */

export type PriceTone = "sub" | "in" | "peste";

export interface PricePosition {
  band: PriceBand;
  /** The listing's own €/m². */
  value: number;
  /** Percent away from the sector median, rounded, always positive. */
  delta: number;
  tone: PriceTone;
  label: T;
  /** 0-100, where the marker sits between p25 and p75 (clamped). */
  offset: number;
}

/** Only sale listings, and only where the sector has enough offers to compare. */
export function pricePosition(p: Property): PricePosition | null {
  if (p.deal !== "vanzare" || p.pricePerSqm <= 0) return null;
  const band = SALE_BY_SECTOR[p.sector];
  if (!band || band.median <= 0) return null;

  const ratio = p.pricePerSqm / band.median;
  const delta = Math.abs(Math.round((ratio - 1) * 100));
  const tone: PriceTone = ratio < 0.94 ? "sub" : ratio > 1.06 ? "peste" : "in";

  const span = Math.max(1, band.p75 - band.p25);
  const offset = Math.min(100, Math.max(0, ((p.pricePerSqm - band.p25) / span) * 100));

  const label: T =
    tone === "in"
      ? { ro: "În banda sectorului", ru: "В диапазоне сектора" }
      : tone === "sub"
        ? { ro: `Cu ${delta}% sub mediana sectorului`, ru: `На ${delta}% ниже медианы сектора` }
        : { ro: `Cu ${delta}% peste mediana sectorului`, ru: `На ${delta}% выше медианы сектора` };

  return { band, value: p.pricePerSqm, delta, tone, label, offset };
}
