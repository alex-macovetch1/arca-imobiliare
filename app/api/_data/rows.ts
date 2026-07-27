import { sectorSaleBand } from "@/lib/market-index";
import { PROPERTIES } from "@/lib/properties";
import type { Property } from "@/lib/types";
import type { CheckKey, PropertyDraft, PropertyRow, StoreShape } from "./model";
import { pricePerSqm } from "./model";

/* ---------------------------------------------------------------------------
   The panel shows one list, assembled from two places: the versioned portfolio
   in lib/properties.ts and whatever the agency has added or changed in the
   panel itself. Server side only — this module pulls the whole portfolio in.
   --------------------------------------------------------------------------- */

function checksFor(row: Omit<PropertyRow, "checks">): CheckKey[] {
  const checks: CheckKey[] = [];
  if (!row.title.ru.trim() || !row.description.ru.trim()) checks.push("ru");
  if (row.photoCount < 6) checks.push("photos");
  // Listings typed into the panel carry an address but no map position yet.
  if (row.origin === "panou") checks.push("coords");
  if (row.description.ro.trim().length < 400) checks.push("description");

  /* A listing far outside its own sector's band is either mistyped or
     genuinely unusual, and both are worth a second look. The band is the one
     from the public index, so the panel and the site agree on what is normal. */
  const band = row.deal === "vanzare" ? sectorSaleBand(row.sector) : null;
  if (band && (row.pricePerSqm < band.p25 * 0.8 || row.pricePerSqm > band.p75 * 1.2)) {
    checks.push("price");
  }
  return checks;
}

function fromProperty(p: Property): Omit<PropertyRow, "checks"> {
  return {
    id: p.id,
    slug: p.slug,
    origin: "portofoliu",
    title: p.title,
    description: p.description,
    deal: p.deal,
    kind: p.kind,
    sector: p.sector,
    street: p.street,
    price: p.price,
    area: p.area,
    pricePerSqm: p.pricePerSqm,
    rooms: p.rooms,
    bathrooms: p.bathrooms,
    floor: p.floor,
    floors: p.floors,
    year: p.year,
    fund: p.fund,
    condition: p.condition,
    agentSlug: p.agentSlug,
    photo: p.photos[0]?.src ?? "",
    photoCount: p.photos.length,
    flags: p.flags,
    status: p.status,
    hidden: false,
    updatedAt: p.updatedAt,
  };
}

function fromDraft(d: PropertyDraft): Omit<PropertyRow, "checks"> {
  return {
    id: d.id,
    slug: d.slug,
    origin: "panou",
    title: d.title,
    description: d.description,
    deal: d.deal,
    kind: d.kind,
    sector: d.sector,
    street: d.street,
    price: d.price,
    area: d.area,
    pricePerSqm: pricePerSqm(d.price, d.area),
    rooms: d.rooms,
    bathrooms: d.bathrooms,
    floor: d.floor,
    floors: d.floors,
    year: d.year,
    fund: d.fund,
    condition: d.condition,
    agentSlug: d.agentSlug,
    photo: d.photo,
    photoCount: 1,
    flags: d.flags,
    status: d.status,
    hidden: d.hidden,
    updatedAt: d.updatedAt,
  };
}

/** Everything the panel lists, newest change first. */
export function propertyRows(store: StoreShape): PropertyRow[] {
  const rows: Omit<PropertyRow, "checks">[] = [];

  for (const p of PROPERTIES) {
    const patch = store.patches[p.id];
    if (patch?.removed) continue;
    const base = fromProperty(p);
    if (patch) {
      const { removed: _removed, ...fields } = patch;
      Object.assign(base, fields);
      base.pricePerSqm = pricePerSqm(base.price, base.area);
    }
    rows.push(base);
  }

  for (const d of store.drafts) rows.push(fromDraft(d));

  return rows
    .map((r) => ({ ...r, checks: checksFor(r) }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function propertyRow(store: StoreShape, id: string): PropertyRow | undefined {
  return propertyRows(store).find((r) => r.id === id);
}

/** Codes already in use, so a new listing never collides with the portfolio. */
export function takenCodes(store: StoreShape): string[] {
  return [...PROPERTIES.map((p) => p.id), ...store.drafts.map((d) => d.id)];
}
