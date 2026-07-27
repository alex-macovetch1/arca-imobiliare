import { PROPERTIES } from "./properties";
import type { Complex, Photo, Property, T } from "./types";

/* ---------------------------------------------------------------------------
   The residential complexes the portfolio carries listings in. A listing points
   here through complexSlug; nothing derives a name from a slug any more.

   Only complexes we actually sell in are listed: a page of names with no offer
   behind them is a catalogue of somebody else's marketing.
   --------------------------------------------------------------------------- */

const MAP = "/harti/chisinau.jpg";

/** Same 3:2 frame as the listing photography, so the cards never reflow. */
function shots(names: string[], place: T): Photo[] {
  return names.map((n) => ({
    src: `/img/${n}.jpg`,
    width: 1600,
    height: 1067,
    alt: { ro: `${place.ro}, Chișinău`, ru: `${place.ru}, Кишинёв` },
  }));
}

export const COMPLEXES: Complex[] = [
  {
    slug: "newton-house",
    name: "Newton House",
    developer: "Basconslux",
    sector: "buiucani",
    street: "bd. Alba Iulia 91",
    coords: { lat: 47.0378, lng: 28.7796 },
    mapImage: MAP,
    photos: shots(["block-02", "apt-12", "apt-14", "block-04"], {
      ro: "Newton House, bd. Alba Iulia",
      ru: "Newton House, бул. Алба-Юлия",
    }),
    description: {
      ro: "Trei blocuri de doisprezece etaje pe partea liniștită a bulevardului Alba Iulia, date în exploatare în 2023. Apartamentele se predau în variantă albă, cu încălzire autonomă și tâmplărie montată, iar parterul e ocupat de comerț, deci curtea rămâne fără mașini în trecere. Parcarea subterană are locuri pentru aproape jumătate din apartamente, ceea ce în Buiucani e mai mult decât se obișnuiește.",
      ru: "Три двенадцатиэтажных корпуса на тихой стороне бульвара Алба-Юлия, сданные в 2023 году. Квартиры передаются в белом варианте, с автономным отоплением и установленными окнами, а первый этаж занят коммерцией, поэтому во дворе нет транзитных машин. В подземном паркинге места почти на половину квартир — для Буюкан это больше, чем принято.",
    },
    priceFromPerSqm: 1850,
    blocks: 3,
    floors: 12,
    stage: "dat-in-exploatare",
    completion: { ro: "Dat în exploatare în 2023", ru: "Сдан в эксплуатацию в 2023 году" },
    ceilingHeight: 270,
    heating: "autonoma",
    parking: "subteran",
    amenities: [
      "parcare",
      "lift",
      "centrala-termica",
      "geamuri-termopan",
      "videointerfon",
      "supraveghere-video",
      "curte-inchisa",
      "teren-joaca",
    ],
    agentSlug: "andrei-cebotari",
  },
  {
    slug: "eco-city-residence",
    name: "Eco City Residence",
    developer: "Glorinal",
    sector: "ciocana",
    street: "str. Igor Vieru 11",
    coords: { lat: 47.0459, lng: 28.9163 },
    mapImage: MAP,
    photos: shots(["block-01", "apt-06", "apt-19", "block-05"], {
      ro: "Eco City Residence, str. Igor Vieru",
      ru: "Eco City Residence, ул. Игоря Виеру",
    }),
    description: {
      ro: "Ansamblul cel mai nou din Ciocana: patru blocuri de șaisprezece etaje ridicate în jurul unei curți închise de aproape un hectar, fără acces auto. Ultimul bloc a fost dat în exploatare în 2024, iar tavanele de 2,8 m și fațada ventilată îl scot din seria obișnuită a sectorului. Grădinița din interiorul ansamblului funcționează din 2025.",
      ru: "Самый новый комплекс в Чеканах: четыре шестнадцатиэтажных корпуса вокруг закрытого двора почти в гектар, без заезда машин. Последний корпус сдан в 2024 году, а потолки 2,8 м и вентилируемый фасад выделяют его из обычной застройки сектора. Детский сад внутри комплекса работает с 2025 года.",
    },
    priceFromPerSqm: 1780,
    blocks: 4,
    floors: 16,
    stage: "dat-in-exploatare",
    completion: { ro: "Dat în exploatare în 2024", ru: "Сдан в эксплуатацию в 2024 году" },
    ceilingHeight: 280,
    heating: "autonoma",
    parking: "subteran",
    amenities: [
      "parcare",
      "lift",
      "centrala-termica",
      "curte-inchisa",
      "teren-joaca",
      "paza",
      "supraveghere-video",
      "videointerfon",
    ],
    agentSlug: "victor-morari",
  },
  {
    slug: "favorit-residence",
    name: "Favorit Residence",
    developer: "Exfactor Grup",
    sector: "riscani",
    street: "bd. Renașterii Naționale 12",
    coords: { lat: 47.0471, lng: 28.8607 },
    mapImage: MAP,
    photos: shots(["block-03", "apt-10", "apt-17", "block-06"], {
      ro: "Favorit Residence, bd. Renașterii Naționale",
      ru: "Favorit Residence, бул. Ренаштерий Национале",
    }),
    description: {
      ro: "Două blocuri de zece etaje pe Renașterii Naționale, la trei minute pe jos de parcul Râșcani. Ansamblul s-a construit între 2019 și 2021 și e ocupat în întregime, ceea ce înseamnă că se vede exact cum arată: curte amenajată, comerț la parter și o asociație care funcționează. Aici ajung cele mai multe cereri de chirie din sector.",
      ru: "Два десятиэтажных корпуса на Ренаштерий Национале, в трёх минутах пешком от парка Рышкановка. Комплекс строился с 2019 по 2021 год и полностью заселён, а значит видно точно, как он выглядит: благоустроенный двор, коммерция на первом этаже и работающая ассоциация жильцов. Сюда приходит больше всего запросов на аренду в секторе.",
    },
    priceFromPerSqm: 1720,
    blocks: 2,
    floors: 10,
    stage: "dat-in-exploatare",
    completion: { ro: "Dat în exploatare în 2021", ru: "Сдан в эксплуатацию в 2021 году" },
    ceilingHeight: 275,
    heating: "autonoma",
    parking: "subteran",
    amenities: [
      "parcare",
      "lift",
      "centrala-termica",
      "balcon",
      "geamuri-termopan",
      "videointerfon",
      "curte-inchisa",
    ],
    agentSlug: "cristina-lungu",
  },
  {
    slug: "grenoble-residence",
    name: "Grenoble Residence",
    developer: "Dansicons",
    sector: "botanica",
    street: "str. Grenoble 143",
    coords: { lat: 46.9798, lng: 28.8517 },
    mapImage: MAP,
    photos: shots(["block-04", "apt-13", "apt-15", "block-02"], {
      ro: "Grenoble Residence, str. Grenoble",
      ru: "Grenoble Residence, ул. Гренобль",
    }),
    description: {
      ro: "Blocul de paisprezece etaje de pe Grenoble, dat în exploatare în 2019, cu apartamente mai mari decât media sectorului: trei camere pornesc de la 80 m². Fondul e deja locuit, iar prețul pe metru pătrat rămâne printre cele mai echilibrate din Botanica. Stația de troleibuz e la ușă și liceul la două străzi.",
      ru: "Четырнадцатиэтажный дом на Гренобль, сданный в 2019 году, с квартирами больше средних по сектору: трёхкомнатные начинаются от 80 м². Фонд уже заселён, а цена за квадратный метр остаётся одной из самых сбалансированных в Ботанике. Остановка троллейбуса у подъезда, лицей в двух улицах.",
    },
    priceFromPerSqm: 1520,
    blocks: 1,
    floors: 14,
    stage: "dat-in-exploatare",
    completion: { ro: "Dat în exploatare în 2019", ru: "Сдан в эксплуатацию в 2019 году" },
    ceilingHeight: 270,
    heating: "autonoma",
    parking: "la-sol",
    amenities: [
      "parcare",
      "lift",
      "centrala-termica",
      "balcon",
      "geamuri-termopan",
      "videointerfon",
      "teren-joaca",
    ],
    agentSlug: "natalia-rusu",
  },
];

export const COMPLEX_BY_SLUG: Record<string, Complex> = Object.fromEntries(
  COMPLEXES.map((c) => [c.slug, c])
);

/** The listings a complex currently has, newest first. */
export function complexProperties(slug: string): Property[] {
  return PROPERTIES.filter((p) => p.complexSlug === slug && p.status === "activ").sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
}

/**
 * The name to print for a complexSlug. Falls back to the slug spelled out, so a
 * listing added in the panel with a complex we have no page for still reads
 * like a name rather than a URL fragment.
 */
export function complexName(slug: string): string {
  const known = COMPLEX_BY_SLUG[slug];
  if (known) return known.name;
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** The slugs that have a page of their own — everything else stays plain text. */
export function hasComplexPage(slug: string): boolean {
  return slug in COMPLEX_BY_SLUG;
}
