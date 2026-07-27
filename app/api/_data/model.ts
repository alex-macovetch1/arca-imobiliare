import { normalizePhone } from "@/lib/format";
import type {
  Condition,
  Deal,
  Flag,
  Floor,
  Fund,
  Kind,
  Lang,
  Lead,
  LeadSource,
  LeadState,
  Sector,
  Status,
  T,
} from "@/lib/types";

/* ---------------------------------------------------------------------------
   Shapes and pure helpers shared by the API routes, the panel screens and the
   forms. Nothing here touches the filesystem or the portfolio module, so a
   client component can import it without dragging either into the bundle.
   --------------------------------------------------------------------------- */

/**
 * The slice of a listing the panel edits. A full Property also carries a
 * gallery, coordinates and points of interest — nobody types those into a form,
 * so a draft keeps one photo and the fields that actually decide the card.
 */
export interface PropertyDraft {
  id: string;
  slug: string;
  deal: Deal;
  kind: Kind;
  sector: Sector;
  street: string;
  title: T;
  description: T;
  price: number;
  area: number;
  rooms: number;
  bathrooms: number;
  floor: Floor;
  floors: number;
  year: number;
  fund: Fund;
  condition: Condition;
  agentSlug: string;
  photo: string;
  flags: Flag[];
  status: Status;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
}

/** What the panel remembers about a listing that lives in the versioned portfolio. */
export type PropertyPatch = Partial<Omit<PropertyDraft, "id" | "createdAt">> & {
  removed?: boolean;
};

/** Where a row in the panel comes from. */
export type Origin = "portofoliu" | "panou";

export type CheckKey = "ru" | "photos" | "coords" | "description" | "price";

/** One line of the properties table, already merged and ready to serialise. */
export interface PropertyRow {
  id: string;
  slug: string;
  origin: Origin;
  title: T;
  description: T;
  deal: Deal;
  kind: Kind;
  sector: Sector;
  street: string;
  price: number;
  area: number;
  pricePerSqm: number;
  rooms: number;
  bathrooms: number;
  floor: Floor;
  floors: number;
  year: number;
  fund: Fund;
  condition: Condition;
  agentSlug: string;
  photo: string;
  photoCount: number;
  flags: Flag[];
  status: Status;
  hidden: boolean;
  updatedAt: string;
  checks: CheckKey[];
}

export interface StoreShape {
  version: 1;
  leads: Lead[];
  drafts: PropertyDraft[];
  patches: Record<string, PropertyPatch>;
}

export const EMPTY_STORE: StoreShape = { version: 1, leads: [], drafts: [], patches: {} };

/* ---------------------------------------------------------------------------
   Option lists for the forms. Kept next to the shape they fill in, so adding a
   value to lib/types.ts and forgetting the select is impossible to miss.
   --------------------------------------------------------------------------- */

export const DEALS: Deal[] = ["vanzare", "chirie"];
export const KINDS: Kind[] = ["apartament", "casa", "teren", "comercial", "birou"];
export const STATUSES: Status[] = ["activ", "rezervat", "vandut", "arhivat"];
export const FLAGS: Flag[] = ["nou", "exclusivitate", "pret-redus", "comision-0", "gata-de-mutat"];
export const FUNDS: Fund[] = ["bloc-nou", "fond-vechi"];
export const CONDITIONS: Condition[] = [
  "varianta-alba",
  "varianta-sura",
  "euroreparatie",
  "reparatie-cosmetica",
  "necesita-reparatie",
  "design-individual",
];
export const LEAD_STATES: LeadState[] = ["nou", "contactat", "programat", "inchis"];
export const LEAD_SOURCES: LeadSource[] = ["anunt", "vinde", "contact", "agent", "cautare"];

/** City sectors first, suburbs after — the order the selects read in. */
export const SECTOR_VALUES: Sector[] = [
  "centru",
  "botanica",
  "buiucani",
  "riscani",
  "ciocana",
  "telecentru",
  "posta-veche",
  "durlesti",
  "stauceni",
  "codru",
  "dumbrava",
  "ialoveni",
];

/** Every photo that exists in public/img, grouped so the select is readable. */
export const PHOTO_CHOICES: { group: T; files: string[] }[] = [
  {
    group: { ro: "Interioare de apartament", ru: "Интерьеры квартир" },
    files: Array.from({ length: 20 }, (_, i) => `/img/apt-${String(i + 1).padStart(2, "0")}.jpg`),
  },
  {
    group: { ro: "Case", ru: "Дома" },
    files: Array.from({ length: 4 }, (_, i) => `/img/house-0${i + 1}.jpg`),
  },
  {
    group: { ro: "Fațade de bloc", ru: "Фасады домов" },
    files: Array.from({ length: 6 }, (_, i) => `/img/block-0${i + 1}.jpg`),
  },
  {
    group: { ro: "Spații comerciale", ru: "Коммерческие помещения" },
    files: ["/img/office.jpg"],
  },
];

export const FLOOR_CHOICES: Floor[] = [
  "demisol",
  "parter",
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  "mansarda",
];

/* --------------------------------------------------------------------------- */

const FOLD: Record<string, string> = {
  ă: "a",
  â: "a",
  î: "i",
  ș: "s",
  ş: "s",
  ț: "t",
  ţ: "t",
  Ă: "a",
  Â: "a",
  Î: "i",
  Ș: "s",
  Ț: "t",
};

export function slugify(input: string): string {
  return input
    .replace(/[ăâîșşțţĂÂÎȘȚ]/g, (c) => FOLD[c] ?? c)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "Apartament cu 3 camere, str. Kiev 8, Râșcani" → the canonical listing slug. */
export function draftSlug(d: Pick<PropertyDraft, "kind" | "rooms" | "street" | "sector" | "id">): string {
  const parts: string[] = [d.kind];
  if (d.rooms > 0) parts.push(`${d.rooms}-camere`);
  parts.push(d.street, d.sector, d.id);
  return slugify(parts.join(" "));
}

export function pricePerSqm(price: number, area: number): number {
  return area > 0 ? Math.round(price / area) : 0;
}

/** The next free offer code, so two listings never share one. */
export function nextCode(taken: string[]): string {
  const highest = taken.reduce((max, id) => {
    const n = Number(id.replace(/\D/g, ""));
    return Number.isFinite(n) && n > max ? n : max;
  }, 1000);
  return `AR-${highest + 1}`;
}

/* ---------------------------------------------------------------------------
   Validation. The same functions run on the server for /api/lead and in the
   browser for instant feedback, so a visitor never meets two different rules.
   --------------------------------------------------------------------------- */

export interface LeadInput {
  source: LeadSource;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  propertyId?: string;
  agentSlug?: string;
  lang: Lang;
  consent: boolean;
  /** Hidden field: a browser leaves it empty, a script fills everything in. */
  company?: string;
  /** Milliseconds the form was on screen before submit. */
  elapsed?: number;
}

export type LeadField = "name" | "phone" | "email" | "consent" | "spam";

export interface LeadError {
  field: LeadField;
  text: T;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Under two seconds on the form is a script, not a person. */
const MIN_MS = 2000;

export function validateLead(input: Partial<LeadInput>): LeadError | null {
  if (input.company) {
    return { field: "spam", text: { ro: "Cerere respinsă.", ru: "Заявка отклонена." } };
  }
  if (typeof input.elapsed === "number" && input.elapsed < MIN_MS) {
    return { field: "spam", text: { ro: "Cerere respinsă.", ru: "Заявка отклонена." } };
  }
  if (!input.name || input.name.trim().length < 2) {
    return {
      field: "name",
      text: { ro: "Scrieți numele dumneavoastră.", ru: "Укажите ваше имя." },
    };
  }
  if (!input.phone || !normalizePhone(input.phone)) {
    return {
      field: "phone",
      text: {
        ro: "Scrieți un număr de telefon valid, de exemplu 069 84 16 40.",
        ru: "Укажите корректный номер телефона, например 069 84 16 40.",
      },
    };
  }
  if (input.email && input.email.trim() && !EMAIL.test(input.email.trim())) {
    return {
      field: "email",
      text: { ro: "Adresa de email nu pare corectă.", ru: "Адрес электронной почты выглядит неверным." },
    };
  }
  if (input.consent !== true) {
    return {
      field: "consent",
      text: {
        ro: "Bifați acordul pentru a putea fi contactat.",
        ru: "Отметьте согласие, чтобы мы могли связаться.",
      },
    };
  }
  return null;
}

const SOURCES = new Set<string>(LEAD_SOURCES);

/** Turns whatever arrived on the wire into the stored shape, or explains why not. */
export function buildLead(input: Partial<LeadInput>): { lead: Lead } | { error: LeadError } {
  const error = validateLead(input);
  if (error) return { error };

  const phone = normalizePhone(String(input.phone))!;
  const source: LeadSource = SOURCES.has(String(input.source))
    ? (input.source as LeadSource)
    : "contact";

  const lead: Lead = {
    id: `L-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase(),
    createdAt: new Date().toISOString(),
    source,
    name: String(input.name).trim().slice(0, 80),
    phone,
    lang: input.lang === "ru" ? "ru" : "ro",
    state: "nou",
  };

  const email = input.email?.trim();
  if (email) lead.email = email.slice(0, 120);
  const message = input.message?.trim();
  if (message) lead.message = message.slice(0, 2000);
  if (input.propertyId) lead.propertyId = String(input.propertyId).slice(0, 20);
  if (input.agentSlug) lead.agentSlug = String(input.agentSlug).slice(0, 60);

  return { lead };
}

export function isLeadState(v: unknown): v is LeadState {
  return typeof v === "string" && (LEAD_STATES as string[]).includes(v);
}

/* ---------------------------------------------------------------------------
   The listing form. Everything arrives as a string from a browser, so the whole
   payload is coerced once, here, and both the create and the edit path use it.
   --------------------------------------------------------------------------- */

export type PropertyForm = Record<string, unknown>;

export interface FormError {
  field: string;
  text: T;
}

function pick<V extends string>(value: unknown, allowed: V[], fallback: V): V {
  return allowed.includes(value as V) ? (value as V) : fallback;
}

function num(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(String(value ?? "").replace(/\s/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

function text(value: unknown, max = 240): string {
  return String(value ?? "").trim().slice(0, max);
}

function floorOf(value: unknown): Floor {
  if (value === "parter" || value === "demisol" || value === "mansarda") return value;
  const n = num(value, 1);
  return Math.max(1, Math.min(40, Math.round(n)));
}

/** Turns a submitted form into a draft, or names the first field that is wrong. */
export function coercePropertyForm(
  raw: PropertyForm,
  base?: Partial<PropertyDraft>
): { draft: PropertyDraft } | { error: FormError } {
  const id = text(raw.id ?? base?.id, 20).toUpperCase();
  if (!/^AR-\d{3,5}$/.test(id)) {
    return {
      error: {
        field: "id",
        text: {
          ro: "Codul ofertei se scrie ca AR-1042.",
          ru: "Код объявления пишется как AR-1042.",
        },
      },
    };
  }

  const street = text(raw.street ?? base?.street, 120);
  if (street.length < 4) {
    return {
      error: {
        field: "street",
        text: {
          ro: "Scrieți strada, de exemplu: str. Kiev 8.",
          ru: "Укажите улицу, например: ул. Киевская 8.",
        },
      },
    };
  }

  const titleRo = text(raw.titleRo ?? base?.title?.ro, 160);
  if (titleRo.length < 8) {
    return {
      error: {
        field: "titleRo",
        text: {
          ro: "Titlul în română este obligatoriu.",
          ru: "Заголовок на румынском обязателен.",
        },
      },
    };
  }

  const price = Math.round(num(raw.price ?? base?.price));
  if (price <= 0) {
    return {
      error: { field: "price", text: { ro: "Prețul trebuie să fie un număr.", ru: "Цена должна быть числом." } },
    };
  }

  const area = Math.round(num(raw.area ?? base?.area) * 10) / 10;
  if (area <= 0) {
    return {
      error: {
        field: "area",
        text: { ro: "Suprafața trebuie să fie un număr.", ru: "Площадь должна быть числом." },
      },
    };
  }

  const now = new Date().toISOString();
  const kind = pick(raw.kind ?? base?.kind, KINDS, "apartament");
  const rooms = Math.max(0, Math.min(12, Math.round(num(raw.rooms ?? base?.rooms))));
  const sector = pick(raw.sector ?? base?.sector, SECTOR_VALUES, "centru");

  const flags = Array.isArray(raw.flags)
    ? (raw.flags.filter((f) => FLAGS.includes(f as Flag)) as Flag[])
    : (base?.flags ?? []);

  const draft: PropertyDraft = {
    id,
    slug: draftSlug({ kind, rooms, street, sector, id }),
    deal: pick(raw.deal ?? base?.deal, DEALS, "vanzare"),
    kind,
    sector,
    street,
    title: { ro: titleRo, ru: text(raw.titleRu ?? base?.title?.ru, 160) },
    description: {
      ro: text(raw.descriptionRo ?? base?.description?.ro, 4000),
      ru: text(raw.descriptionRu ?? base?.description?.ru, 4000),
    },
    price,
    area,
    rooms,
    bathrooms: Math.max(0, Math.min(6, Math.round(num(raw.bathrooms ?? base?.bathrooms, 1)))),
    floor: floorOf(raw.floor ?? base?.floor),
    floors: Math.max(1, Math.min(40, Math.round(num(raw.floors ?? base?.floors, 1)))),
    year: Math.max(1900, Math.min(2035, Math.round(num(raw.year ?? base?.year, 2020)))),
    fund: pick(raw.fund ?? base?.fund, FUNDS, "bloc-nou"),
    condition: pick(raw.condition ?? base?.condition, CONDITIONS, "euroreparatie"),
    agentSlug: text(raw.agentSlug ?? base?.agentSlug, 60),
    photo: text(raw.photo ?? base?.photo, 120) || "/img/apt-01.jpg",
    flags,
    status: pick(raw.status ?? base?.status, STATUSES, "activ"),
    hidden: raw.hidden === true || raw.hidden === "true" || (raw.hidden === undefined && base?.hidden === true),
    createdAt: base?.createdAt ?? now,
    updatedAt: now,
  };

  return { draft };
}
