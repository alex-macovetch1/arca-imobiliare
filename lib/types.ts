/* ---------------------------------------------------------------------------
   ARCA — the single source of truth for the data shape.
   Everything on the site imports its types from here. Nothing that a card or a
   filter needs is optional: if it can be missing, the card renders crooked.
   --------------------------------------------------------------------------- */

export type Lang = "ro" | "ru";

/** The bilingual pair. Every visible string on the site is one of these. */
export type T = { ro: string; ru: string };

export type Deal = "vanzare" | "chirie";
export type Kind = "apartament" | "casa" | "teren" | "comercial" | "birou";
export type Status = "activ" | "rezervat" | "vandut" | "arhivat";
export type Flag = "nou" | "exclusivitate" | "pret-redus" | "comision-0" | "gata-de-mutat";

export type Sector =
  | "centru"
  | "botanica"
  | "buiucani"
  | "riscani"
  | "ciocana"
  | "telecentru"
  | "posta-veche"
  | "durlesti"
  | "stauceni"
  | "codru"
  | "dumbrava"
  | "ialoveni";

export type Fund = "bloc-nou" | "fond-vechi";

export type Condition =
  | "varianta-alba"
  | "varianta-sura"
  | "euroreparatie"
  | "reparatie-cosmetica"
  | "necesita-reparatie"
  | "design-individual";

export type Layout = "decomandat" | "semidecomandat" | "nedecomandat" | "circular";
export type BuildingType = "monolit" | "caramida" | "panou" | "combinat" | "beton-celular";
export type Heating = "autonoma" | "centralizata" | "pardoseala";
export type Parking = "subteran" | "la-sol" | "garaj" | "fara";

export type Amenity =
  | "parcare"
  | "garaj"
  | "balcon"
  | "terasa"
  | "lift"
  | "centrala-termica"
  | "mobilat"
  | "tehnica"
  | "aer-conditionat"
  | "gradina"
  | "curte-inchisa"
  | "pivnita"
  | "bucatarie-separata"
  | "videointerfon"
  | "paza"
  | "supraveghere-video"
  | "geamuri-termopan"
  | "incalzire-pardoseala"
  | "teren-joaca"
  | "internet";

/** The floor has values that are not numbers. Never stored as a free string. */
export type Floor = number | "parter" | "demisol" | "mansarda";

export type PoiKind =
  | "transport"
  | "gradinita"
  | "scoala"
  | "magazin"
  | "parc"
  | "policlinica"
  | "sala-sport";

export interface Poi {
  kind: PoiKind;
  name: T;
  /** Displayed rounded: 140 m below a kilometre, 1,2 km above. */
  meters: number;
}

export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: T;
  blurDataURL?: string;
}

export interface Property {
  /* identity */
  /** "AR-1042" — the code an agent dictates on the phone, printed on the listing. */
  id: string;
  slug: string;
  deal: Deal;
  kind: Kind;
  status: Status;
  /** At most 2 render on the photo, in array order. */
  flags: Flag[];

  /* copy */
  title: T;
  description: T;
  landmark?: T;

  /* money */
  /** EUR, integer. For a rental this is EUR per month. */
  price: number;
  /** Required whenever flags include "pret-redus". */
  previousPrice?: number;
  /** Math.round(price / area), precomputed so no JSX ever divides. */
  pricePerSqm: number;
  negotiable: boolean;

  /* space */
  rooms: number;
  bedrooms?: number;
  bathrooms: number;
  /** Usable area, m². */
  area: number;
  livingArea?: number;
  kitchenArea?: number;
  /** Ari — houses and land only. */
  landArea?: number;
  floor: Floor;
  /** Floors in the building; for a house, levels. */
  floors: number;
  /** Centimetres: 260-280 in a new block, 250 in the old stock. */
  ceilingHeight?: number;
  balconies: number;

  /* location */
  sector: Sector;
  street: string;
  coords: { lat: number; lng: number };
  /** Pregenerated static map, 1464x720. */
  mapImage: string;
  poi: Poi[];

  /* building */
  fund: Fund;
  year: number;
  yearStatus: "finalizat" | "in-constructie";
  buildingType: BuildingType;
  condition: Condition;
  layout?: Layout;
  heating: Heating;
  parking: Parking;
  amenities: Amenity[];
  developer?: string;
  complexSlug?: string;
  availableFrom: T;

  /* relations and media */
  agentSlug: string;
  photos: Photo[];

  /* time and sorting */
  /** ISO date, "2026-07-21". */
  publishedAt: string;
  updatedAt: string;
  /** Shows up in "Selecția ARCA" on the homepage. */
  featured: boolean;
}

export interface Agent {
  slug: string;
  /** Same in both languages. */
  name: string;
  role: T;
  /** 4:5, 640x800. */
  photo: Photo;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  viber: string;
  email: string;
  sectors: Sector[];
  languages: ("ro" | "ru" | "en")[];
  /** Year they joined the agency. */
  since: number;
  deals: number;
  bio: T;
  quote?: T;
}

export interface Complex {
  slug: string;
  name: string;
  developer: string;
  sector: Sector;
  street: string;
  coords: { lat: number; lng: number };
  mapImage: string;
  photos: Photo[];
  description: T;
  priceFromPerSqm: number;
  blocks: number;
  floors: number;
  stage: "in-constructie" | "dat-in-exploatare";
  completion: T;
  ceilingHeight: number;
  heating: Heating;
  parking: Parking;
  amenities: Amenity[];
  agentSlug: string;
}

export type LeadSource = "anunt" | "vinde" | "contact" | "agent" | "cautare";
export type LeadState = "nou" | "contactat" | "programat" | "inchis";

export interface Lead {
  id: string;
  createdAt: string;
  source: LeadSource;
  name: string;
  /** Normalised to "+373XXXXXXXX" on the server. */
  phone: string;
  email?: string;
  message?: string;
  propertyId?: string;
  agentSlug?: string;
  lang: Lang;
  state: LeadState;
  note?: string;
}
