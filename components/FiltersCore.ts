import { formatArea, formatPrice, formatRent } from "@/lib/format";
import {
  AMENITY_LABEL,
  BUILDING_LABEL,
  CONDITION_LABEL,
  FLAG_LABEL,
  FUND_LABEL,
  HEATING_LABEL,
  KIND_PLURAL,
  SECTOR_IN,
  SECTOR_LABEL,
} from "@/lib/content";
import { AGENT_BY_SLUG } from "@/lib/agents";
import { complexName } from "@/lib/complexes";
import type {
  Amenity,
  BuildingType,
  Condition,
  Deal,
  Flag,
  Fund,
  Heating,
  Kind,
  Property,
  Sector,
  T,
} from "@/lib/types";

/* ---------------------------------------------------------------------------
   One implementation of the search state: read it from the URL, write it back
   to the URL, apply it to the portfolio and count what every option would
   return. The results page holds no filter state of its own — the query string
   is the state, which is what makes a filtered link survive being pasted into
   WhatsApp.
   --------------------------------------------------------------------------- */

export type SortKey = "nou" | "pret-asc" | "pret-desc" | "epm-asc" | "supraf-desc";
export type ViewKey = "grila" | "lista" | "harta";
export type Baths = 1 | 2 | 3;

export interface Filters {
  deal: Deal;
  kinds: Kind[];
  sectors: Sector[];
  /** 4 stands for "4 or more". */
  rooms: number[];
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  conditions: Condition[];
  funds: Fund[];
  /** 3 stands for "3 or more". */
  baths?: Baths;
  buildings: BuildingType[];
  heatings: Heating[];
  amenities: Amenity[];
  flags: Flag[];
  agent?: string;
  complex?: string;
  noTopFloor: boolean;
  noGroundFloor: boolean;
  q: string;
  sort: SortKey;
  view: ViewKey;
  page: number;
}

export const PER_PAGE = 12;

export const KIND_VALUES: Kind[] = ["apartament", "casa", "teren", "comercial", "birou"];

export const CITY_SECTOR_VALUES: Sector[] = [
  "centru",
  "botanica",
  "buiucani",
  "riscani",
  "ciocana",
  "telecentru",
  "posta-veche",
];

export const SUBURB_SECTOR_VALUES: Sector[] = [
  "durlesti",
  "stauceni",
  "codru",
  "dumbrava",
  "ialoveni",
];

const SECTOR_VALUES: Sector[] = [...CITY_SECTOR_VALUES, ...SUBURB_SECTOR_VALUES];

export const CONDITION_VALUES: Condition[] = [
  "varianta-alba",
  "varianta-sura",
  "euroreparatie",
  "reparatie-cosmetica",
  "necesita-reparatie",
  "design-individual",
];

export const FUND_VALUES: Fund[] = ["bloc-nou", "fond-vechi"];

export const BUILDING_VALUES: BuildingType[] = [
  "monolit",
  "caramida",
  "panou",
  "combinat",
  "beton-celular",
];

export const HEATING_VALUES: Heating[] = ["autonoma", "centralizata", "pardoseala"];

export const AMENITY_VALUES: Amenity[] = [
  "parcare",
  "garaj",
  "balcon",
  "terasa",
  "lift",
  "centrala-termica",
  "mobilat",
  "tehnica",
  "aer-conditionat",
  "gradina",
  "curte-inchisa",
  "pivnita",
  "bucatarie-separata",
  "videointerfon",
  "paza",
  "supraveghere-video",
  "geamuri-termopan",
  "incalzire-pardoseala",
  "teren-joaca",
  "internet",
];

/** "nou" is a date, not a choice a visitor makes, so it is not offered here. */
export const FLAG_VALUES: Flag[] = ["exclusivitate", "comision-0", "pret-redus", "gata-de-mutat"];

export const ROOM_VALUES = [1, 2, 3, 4];
export const BATH_VALUES: Baths[] = [1, 2, 3];

/** Fixed steps, never a slider: a Moldovan budget is round. */
export const PRICE_STEPS_SALE = [
  20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 120000, 140000, 160000, 180000,
  200000, 250000, 300000,
];

export const PRICE_STEPS_RENT = [200, 300, 400, 500, 600, 700, 800, 1000, 1200, 1500, 2000, 3000];

export const AREA_STEPS = [30, 40, 50, 60, 70, 80, 100, 120, 150, 200];

export const SORT_VALUES: SortKey[] = ["nou", "pret-asc", "pret-desc", "epm-asc", "supraf-desc"];
export const VIEW_VALUES: ViewKey[] = ["grila", "lista", "harta"];

export function priceSteps(deal: Deal): number[] {
  return deal === "chirie" ? PRICE_STEPS_RENT : PRICE_STEPS_SALE;
}

export const EMPTY_FILTERS: Filters = {
  deal: "vanzare",
  kinds: [],
  sectors: [],
  rooms: [],
  conditions: [],
  funds: [],
  buildings: [],
  heatings: [],
  amenities: [],
  flags: [],
  noTopFloor: false,
  noGroundFloor: false,
  q: "",
  sort: "nou",
  view: "grila",
  page: 1,
};

/* ---------------------------------------------------------------------------
   Reading the URL
   --------------------------------------------------------------------------- */

type Params = { get(key: string): string | null };

function pick<V extends string>(raw: string | null, allowed: readonly V[]): V[] {
  if (!raw) return [];
  const chosen = new Set(raw.split(",").map((s) => s.trim()));
  // Filtering the allowed list keeps the canonical order whatever the URL says.
  return allowed.filter((v) => chosen.has(v));
}

function one<V extends string>(raw: string | null, allowed: readonly V[]): V | undefined {
  return allowed.find((v) => v === raw);
}

function int(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : undefined;
}

export function parseFilters(params: Params): Filters {
  const deal = one(params.get("tranzactie"), ["vanzare", "chirie"] as const) ?? "vanzare";
  const rooms = (params.get("camere") ?? "")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => ROOM_VALUES.includes(n));

  const baths = BATH_VALUES.find((b) => b === Number(params.get("bai")));

  return {
    deal,
    kinds: pick(params.get("tip"), KIND_VALUES),
    sectors: pick(params.get("sector"), SECTOR_VALUES),
    rooms: ROOM_VALUES.filter((r) => rooms.includes(r)),
    priceMin: int(params.get("pretMin")),
    priceMax: int(params.get("pretMax")),
    areaMin: int(params.get("supraMin")),
    areaMax: int(params.get("supraMax")),
    conditions: pick(params.get("stare"), CONDITION_VALUES),
    funds: pick(params.get("fond"), FUND_VALUES),
    baths,
    buildings: pick(params.get("cladire"), BUILDING_VALUES),
    heatings: pick(params.get("incalzire"), HEATING_VALUES),
    amenities: pick(params.get("dotari"), AMENITY_VALUES),
    flags: pick(params.get("marcaje"), FLAG_VALUES),
    agent: params.get("agent") ?? undefined,
    complex: params.get("complex") ?? undefined,
    noTopFloor: params.get("faraUltim") === "1",
    noGroundFloor: params.get("faraParter") === "1",
    // The homepage search card and the footer links both land here; accept the
    // long spelling as well so no inbound link is silently ignored.
    q: (params.get("q") ?? params.get("cautare") ?? "").slice(0, 80),
    sort: one(params.get("sort"), SORT_VALUES) ?? "nou",
    view: one(params.get("mod"), VIEW_VALUES) ?? "grila",
    page: int(params.get("page")) ?? 1,
  };
}

export function toQuery(f: Filters): string {
  const p = new URLSearchParams();
  if (f.deal !== "vanzare") p.set("tranzactie", f.deal);
  if (f.q) p.set("q", f.q);
  if (f.kinds.length) p.set("tip", f.kinds.join(","));
  if (f.sectors.length) p.set("sector", f.sectors.join(","));
  if (f.rooms.length) p.set("camere", f.rooms.join(","));
  if (f.priceMin) p.set("pretMin", String(f.priceMin));
  if (f.priceMax) p.set("pretMax", String(f.priceMax));
  if (f.areaMin) p.set("supraMin", String(f.areaMin));
  if (f.areaMax) p.set("supraMax", String(f.areaMax));
  if (f.funds.length) p.set("fond", f.funds.join(","));
  if (f.conditions.length) p.set("stare", f.conditions.join(","));
  if (f.baths) p.set("bai", String(f.baths));
  if (f.buildings.length) p.set("cladire", f.buildings.join(","));
  if (f.heatings.length) p.set("incalzire", f.heatings.join(","));
  if (f.amenities.length) p.set("dotari", f.amenities.join(","));
  if (f.flags.length) p.set("marcaje", f.flags.join(","));
  if (f.agent) p.set("agent", f.agent);
  if (f.complex) p.set("complex", f.complex);
  if (f.noTopFloor) p.set("faraUltim", "1");
  if (f.noGroundFloor) p.set("faraParter", "1");
  if (f.sort !== "nou") p.set("sort", f.sort);
  if (f.view !== "grila") p.set("mod", f.view);
  if (f.page > 1) p.set("page", String(f.page));
  return p.toString();
}

/* ---------------------------------------------------------------------------
   Applying the filters
   --------------------------------------------------------------------------- */

export type FacetKey =
  | "kinds"
  | "sectors"
  | "rooms"
  | "price"
  | "area"
  | "conditions"
  | "funds"
  | "baths"
  | "buildings"
  | "heatings"
  | "amenities"
  | "flags"
  | "agent"
  | "complex"
  | "floor"
  | "q";

const TESTS: Record<FacetKey, (p: Property, f: Filters) => boolean> = {
  kinds: (p, f) => !f.kinds.length || f.kinds.includes(p.kind),
  sectors: (p, f) => !f.sectors.length || f.sectors.includes(p.sector),
  rooms: (p, f) => !f.rooms.length || f.rooms.some((r) => (r === 4 ? p.rooms >= 4 : p.rooms === r)),
  price: (p, f) =>
    (f.priceMin === undefined || p.price >= f.priceMin) &&
    (f.priceMax === undefined || p.price <= f.priceMax),
  area: (p, f) =>
    (f.areaMin === undefined || p.area >= f.areaMin) &&
    (f.areaMax === undefined || p.area <= f.areaMax),
  conditions: (p, f) => !f.conditions.length || f.conditions.includes(p.condition),
  funds: (p, f) => !f.funds.length || f.funds.includes(p.fund),
  baths: (p, f) =>
    f.baths === undefined || (f.baths === 3 ? p.bathrooms >= 3 : p.bathrooms === f.baths),
  buildings: (p, f) => !f.buildings.length || f.buildings.includes(p.buildingType),
  heatings: (p, f) => !f.heatings.length || f.heatings.includes(p.heating),
  amenities: (p, f) => f.amenities.every((a) => p.amenities.includes(a)),
  flags: (p, f) => f.flags.every((x) => p.flags.includes(x)),
  agent: (p, f) => !f.agent || p.agentSlug === f.agent,
  complex: (p, f) => !f.complex || p.complexSlug === f.complex,
  floor: (p, f) => {
    if (f.noGroundFloor && (p.floor === "parter" || p.floor === "demisol")) return false;
    if (f.noTopFloor && (p.floor === "mansarda" || p.floor === p.floors)) return false;
    return true;
  },
  q: (p, f) => {
    if (!f.q.trim()) return true;
    const needle = fold(f.q);
    return haystack(p).includes(needle);
  },
};

const FACETS = Object.keys(TESTS) as FacetKey[];

/** Diacritics off, lowercase: "Râșcani" has to be found by typing "riscani". */
function fold(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

const HAYSTACK = new WeakMap<Property, string>();

function haystack(p: Property): string {
  let v = HAYSTACK.get(p);
  if (v === undefined) {
    v = fold(
      [p.id, p.street, p.title.ro, p.title.ru, p.complexSlug ?? "", p.developer ?? "", p.sector].join(
        " "
      )
    );
    HAYSTACK.set(p, v);
  }
  return v;
}

export function applyFilters(list: Property[], f: Filters, skip?: FacetKey): Property[] {
  return list.filter(
    (p) =>
      p.status === "activ" &&
      p.deal === f.deal &&
      FACETS.every((k) => k === skip || TESTS[k](p, f))
  );
}

export function sortProperties(list: Property[], sort: SortKey): Property[] {
  const out = [...list];
  out.sort((a, b) => {
    switch (sort) {
      case "pret-asc":
        return a.price - b.price || a.id.localeCompare(b.id);
      case "pret-desc":
        return b.price - a.price || a.id.localeCompare(b.id);
      case "epm-asc":
        return a.pricePerSqm - b.pricePerSqm || a.id.localeCompare(b.id);
      case "supraf-desc":
        return b.area - a.area || a.id.localeCompare(b.id);
      default:
        return b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id);
    }
  });
  return out;
}

/**
 * How many results an option would return with every other filter left alone.
 * That number is what turns a filter panel from a guessing game into a map of
 * the portfolio, and it is the reason no option here ever leads to an empty page.
 */
export function countFor(list: Property[], f: Filters, next: Partial<Filters>): number {
  return applyFilters(list, { ...f, ...next }).length;
}

/** How many filters the visitor has actually set — the badge on [Filtre]. */
export function activeCount(f: Filters): number {
  let n = 0;
  n += f.kinds.length ? 1 : 0;
  n += f.sectors.length ? 1 : 0;
  n += f.rooms.length ? 1 : 0;
  n += f.priceMin !== undefined || f.priceMax !== undefined ? 1 : 0;
  n += f.areaMin !== undefined || f.areaMax !== undefined ? 1 : 0;
  n += f.conditions.length ? 1 : 0;
  n += f.funds.length ? 1 : 0;
  n += f.baths ? 1 : 0;
  n += f.buildings.length ? 1 : 0;
  n += f.heatings.length ? 1 : 0;
  n += f.amenities.length;
  n += f.flags.length;
  n += f.agent ? 1 : 0;
  n += f.complex ? 1 : 0;
  n += f.noTopFloor ? 1 : 0;
  n += f.noGroundFloor ? 1 : 0;
  n += f.q.trim() ? 1 : 0;
  return n;
}

/** Only the facets that live inside the panel — the badge on the [Filtre] button. */
export function extraCount(f: Filters): number {
  let n = 0;
  n += f.areaMin !== undefined || f.areaMax !== undefined ? 1 : 0;
  n += f.conditions.length ? 1 : 0;
  n += f.funds.length ? 1 : 0;
  n += f.baths ? 1 : 0;
  n += f.buildings.length ? 1 : 0;
  n += f.heatings.length ? 1 : 0;
  n += f.amenities.length;
  n += f.flags.length;
  n += f.agent ? 1 : 0;
  n += f.complex ? 1 : 0;
  n += f.noTopFloor ? 1 : 0;
  n += f.noGroundFloor ? 1 : 0;
  return n;
}

/** Everything except the deal, which is a mode rather than a filter. */
export function clearFilters(f: Filters): Filters {
  return { ...EMPTY_FILTERS, deal: f.deal, sort: f.sort, view: f.view };
}

/** Only the ones inside the "Mai multe filtre" panel. */
export function clearExtraFilters(f: Filters): Filters {
  return {
    ...f,
    areaMin: undefined,
    areaMax: undefined,
    conditions: [],
    funds: [],
    baths: undefined,
    buildings: [],
    heatings: [],
    amenities: [],
    flags: [],
    agent: undefined,
    complex: undefined,
    noTopFloor: false,
    noGroundFloor: false,
    page: 1,
  };
}

/* ---------------------------------------------------------------------------
   The row of active filters, each one removable
   --------------------------------------------------------------------------- */

export interface Chip {
  id: string;
  label: T;
  /** The state left behind once this chip is removed. */
  next: Filters;
}

function priceLabel(value: number, deal: Deal, bound: "min" | "max"): T {
  const ro = deal === "chirie" ? formatRent(value, "ro") : formatPrice(value);
  const ru = deal === "chirie" ? formatRent(value, "ru") : formatPrice(value);
  return bound === "min"
    ? { ro: `de la ${ro}`, ru: `от ${ru}` }
    : { ro: `până în ${ro}`, ru: `до ${ru}` };
}

export function activeChips(f: Filters): Chip[] {
  const chips: Chip[] = [];
  const drop = <K extends keyof Filters>(key: K, value: Filters[K]): Filters => {
    const next: Filters = { ...f, page: 1 };
    next[key] = value;
    return next;
  };

  if (f.q.trim()) {
    chips.push({ id: "q", label: { ro: `„${f.q}”`, ru: `«${f.q}»` }, next: drop("q", "") });
  }
  for (const k of f.kinds) {
    chips.push({
      id: `tip-${k}`,
      label: KIND_PLURAL[k],
      next: drop(
        "kinds",
        f.kinds.filter((v) => v !== k)
      ),
    });
  }
  for (const s of f.sectors) {
    chips.push({
      id: `sector-${s}`,
      label: SECTOR_LABEL[s],
      next: drop(
        "sectors",
        f.sectors.filter((v) => v !== s)
      ),
    });
  }
  for (const r of f.rooms) {
    chips.push({
      id: `camere-${r}`,
      label:
        r === 4
          ? { ro: "4+ camere", ru: "4+ комн." }
          : { ro: r === 1 ? "1 cameră" : `${r} camere`, ru: `${r} комн.` },
      next: drop(
        "rooms",
        f.rooms.filter((v) => v !== r)
      ),
    });
  }
  if (f.priceMin !== undefined) {
    chips.push({
      id: "pretMin",
      label: priceLabel(f.priceMin, f.deal, "min"),
      next: drop("priceMin", undefined),
    });
  }
  if (f.priceMax !== undefined) {
    chips.push({
      id: "pretMax",
      label: priceLabel(f.priceMax, f.deal, "max"),
      next: drop("priceMax", undefined),
    });
  }
  if (f.areaMin !== undefined) {
    chips.push({
      id: "supraMin",
      label: { ro: `de la ${formatArea(f.areaMin, "ro")}`, ru: `от ${formatArea(f.areaMin, "ru")}` },
      next: drop("areaMin", undefined),
    });
  }
  if (f.areaMax !== undefined) {
    chips.push({
      id: "supraMax",
      label: {
        ro: `până în ${formatArea(f.areaMax, "ro")}`,
        ru: `до ${formatArea(f.areaMax, "ru")}`,
      },
      next: drop("areaMax", undefined),
    });
  }
  for (const v of f.funds) {
    chips.push({
      id: `fond-${v}`,
      label: FUND_LABEL[v],
      next: drop(
        "funds",
        f.funds.filter((x) => x !== v)
      ),
    });
  }
  for (const v of f.conditions) {
    chips.push({
      id: `stare-${v}`,
      label: CONDITION_LABEL[v],
      next: drop(
        "conditions",
        f.conditions.filter((x) => x !== v)
      ),
    });
  }
  if (f.baths) {
    chips.push({
      id: "bai",
      label:
        f.baths === 3
          ? { ro: "3+ băi", ru: "3+ санузла" }
          : { ro: f.baths === 1 ? "1 baie" : "2 băi", ru: `${f.baths} санузла` },
      next: drop("baths", undefined),
    });
  }
  for (const v of f.buildings) {
    chips.push({
      id: `cladire-${v}`,
      label: BUILDING_LABEL[v],
      next: drop(
        "buildings",
        f.buildings.filter((x) => x !== v)
      ),
    });
  }
  for (const v of f.heatings) {
    chips.push({
      id: `incalzire-${v}`,
      label: HEATING_LABEL[v],
      next: drop(
        "heatings",
        f.heatings.filter((x) => x !== v)
      ),
    });
  }
  for (const v of f.amenities) {
    chips.push({
      id: `dotari-${v}`,
      label: AMENITY_LABEL[v],
      next: drop(
        "amenities",
        f.amenities.filter((x) => x !== v)
      ),
    });
  }
  for (const v of f.flags) {
    chips.push({
      id: `marcaje-${v}`,
      label: FLAG_LABEL[v],
      next: drop(
        "flags",
        f.flags.filter((x) => x !== v)
      ),
    });
  }
  if (f.agent) {
    const agent = AGENT_BY_SLUG[f.agent];
    chips.push({
      id: "agent",
      label: { ro: agent?.name ?? f.agent, ru: agent?.name ?? f.agent },
      next: drop("agent", undefined),
    });
  }
  if (f.complex) {
    const name = complexName(f.complex);
    chips.push({ id: "complex", label: { ro: name, ru: name }, next: drop("complex", undefined) });
  }
  if (f.noTopFloor) {
    chips.push({
      id: "faraUltim",
      label: { ro: "Exclus ultimul etaj", ru: "Кроме последнего этажа" },
      next: drop("noTopFloor", false),
    });
  }
  if (f.noGroundFloor) {
    chips.push({
      id: "faraParter",
      label: { ro: "Exclus parter", ru: "Кроме первого этажа" },
      next: drop("noGroundFloor", false),
    });
  }
  return chips;
}

/* ---------------------------------------------------------------------------
   The empty state that actually helps
   --------------------------------------------------------------------------- */

export interface Relaxation {
  id: string;
  label: T;
  count: number;
  next: Filters;
}

/**
 * When nothing matches, offering "reset everything" is giving up. These are the
 * single changes that bring results back, largest gain first.
 */
export function relaxations(list: Property[], f: Filters): Relaxation[] {
  const candidates: { id: string; label: T; next: Filters }[] = [];
  const base = { ...f, page: 1 };

  if (f.priceMin !== undefined || f.priceMax !== undefined) {
    candidates.push({
      id: "pret",
      label: { ro: "Scoate limita de preț", ru: "Убрать ограничение по цене" },
      next: { ...base, priceMin: undefined, priceMax: undefined },
    });
  }
  if (f.rooms.length) {
    candidates.push({
      id: "camere",
      label: { ro: "Orice număr de camere", ru: "Любое число комнат" },
      next: { ...base, rooms: [] },
    });
  }
  if (f.sectors.length) {
    candidates.push({
      id: "sector",
      label: { ro: "Caută în tot orașul", ru: "Искать по всему городу" },
      next: { ...base, sectors: [] },
    });
  }
  if (f.areaMin !== undefined || f.areaMax !== undefined) {
    candidates.push({
      id: "suprafata",
      label: { ro: "Orice suprafață", ru: "Любая площадь" },
      next: { ...base, areaMin: undefined, areaMax: undefined },
    });
  }
  if (f.kinds.length) {
    candidates.push({
      id: "tip",
      label: { ro: "Toate tipurile de proprietate", ru: "Все типы недвижимости" },
      next: { ...base, kinds: [] },
    });
  }
  if (f.conditions.length || f.funds.length) {
    candidates.push({
      id: "stare",
      label: { ro: "Orice stare și fond locativ", ru: "Любое состояние и тип жилья" },
      next: { ...base, conditions: [], funds: [] },
    });
  }
  if (f.amenities.length || f.flags.length) {
    candidates.push({
      id: "dotari",
      label: { ro: "Fără facilități obligatorii", ru: "Без обязательных удобств" },
      next: { ...base, amenities: [], flags: [] },
    });
  }
  if (f.q.trim()) {
    candidates.push({
      id: "q",
      label: { ro: "Renunță la cuvântul căutat", ru: "Убрать поисковое слово" },
      next: { ...base, q: "" },
    });
  }

  const useful = candidates
    .map((c) => ({ ...c, count: applyFilters(list, c.next).length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  if (useful.length > 0) return useful;

  // Nothing single-handed brings results back — offer the one wide door that
  // still keeps the place the visitor asked about.
  if (f.sectors.length === 1) {
    const only: Filters = { ...clearFilters(f), sectors: f.sectors };
    const count = applyFilters(list, only).length;
    if (count > 0) {
      return [
        {
          id: "doar-sector",
          label: {
            ro: `Tot ce avem ${SECTOR_IN[f.sectors[0]].ro}`,
            ru: `Всё, что есть ${SECTOR_IN[f.sectors[0]].ru}`,
          },
          count,
          next: only,
        },
      ];
    }
  }

  return [];
}
