import { PROPERTIES, PROPERTY_BY_ID } from "@/lib/properties";
import { SECTOR_BY_SLUG } from "@/lib/sectors";
import type { Property } from "@/lib/types";
import type { PropertyDraft, StoreShape } from "./model";
import { pricePerSqm } from "./model";
import { readStore } from "./store";

/* ---------------------------------------------------------------------------
   What the site actually shows: the versioned portfolio with the panel's work
   folded in — listings typed into the panel, edits to existing ones, and the
   ones taken off the list. Server side only; a page passes the result down to
   its client components so the store never reaches the browser.
   --------------------------------------------------------------------------- */

const MAP_IMAGE = PROPERTIES[0].mapImage;

/** A form collects a fraction of a listing; the rest gets a defensible default. */
function draftToProperty(d: PropertyDraft): Property {
  const sector = SECTOR_BY_SLUG[d.sector];
  const thisYear = new Date().getFullYear();

  return {
    id: d.id,
    slug: d.slug,
    deal: d.deal,
    kind: d.kind,
    status: d.status,
    flags: d.flags,
    title: d.title,
    description: d.description,
    price: d.price,
    pricePerSqm: pricePerSqm(d.price, d.area),
    negotiable: false,
    rooms: d.rooms,
    bathrooms: d.bathrooms,
    area: d.area,
    floor: d.floor,
    floors: d.floors,
    balconies: 0,
    sector: d.sector,
    street: d.street,
    // The form asks for a street, not for coordinates: the marker sits on the
    // centre of the sector until someone places it properly.
    coords: sector.coords,
    mapImage: MAP_IMAGE,
    poi: [],
    fund: d.fund,
    year: d.year,
    yearStatus: d.year > thisYear ? "in-constructie" : "finalizat",
    buildingType: d.fund === "bloc-nou" ? "monolit" : "caramida",
    condition: d.condition,
    heating: d.fund === "bloc-nou" ? "autonoma" : "centralizata",
    parking: "fara",
    amenities: [],
    availableFrom: { ro: "Imediat", ru: "Сразу" },
    agentSlug: d.agentSlug,
    photos: [{ src: d.photo, width: 1600, height: 1067, alt: d.title }],
    publishedAt: d.createdAt.slice(0, 10),
    updatedAt: d.updatedAt,
    featured: false,
  };
}

function merge(store: StoreShape): Property[] {
  const out: Property[] = [];

  for (const p of PROPERTIES) {
    const patch = store.patches[p.id];
    if (patch?.removed || patch?.hidden) continue;
    if (!patch) {
      out.push(p);
      continue;
    }

    const { removed: _removed, hidden: _hidden, ...fields } = patch;
    const merged: Property = { ...p, ...fields };
    merged.pricePerSqm = pricePerSqm(merged.price, merged.area);
    out.push(merged);
  }

  for (const d of store.drafts) {
    if (d.hidden) continue;
    out.push(draftToProperty(d));
  }

  return out;
}

/** Everything the public site is allowed to show, newest listing last. */
export async function livePortfolio(): Promise<Property[]> {
  return merge(await readStore());
}

export async function liveProperty(slug: string): Promise<Property | undefined> {
  const list = await livePortfolio();
  return list.find((p) => p.slug === slug);
}

/** True while a portfolio listing has not been touched by the panel at all. */
export function isPortfolioId(id: string): boolean {
  return Boolean(PROPERTY_BY_ID[id]);
}
