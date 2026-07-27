import type { Floor, PoiKind, T } from "@/lib/types";

/* ---------------------------------------------------------------------------
   Labels that only the listing page says. Everything shared with the rest of
   the site keeps living in lib/content.ts.
   --------------------------------------------------------------------------- */

export const L = {
  /* breadcrumb and anchors */
  home: { ro: "Acasă", ru: "Главная" },
  properties: { ro: "Proprietăți", ru: "Объекты" },
  trail: { ro: "Traseu de navigare", ru: "Навигационная цепочка" },
  onThisPage: { ro: "Secțiunile anunțului", ru: "Разделы объявления" },

  /* feature table */
  dealRow: { ro: "Tranzacție", ru: "Сделка" },
  roomsRow: { ro: "Număr camere", ru: "Количество комнат" },
  bedrooms: { ro: "Dormitoare", ru: "Спальни" },
  bathrooms: { ro: "Băi", ru: "Санузлы" },
  usableArea: { ro: "Suprafață utilă", ru: "Общая площадь" },
  livingArea: { ro: "Suprafață locativă", ru: "Жилая площадь" },
  kitchenArea: { ro: "Suprafața bucătăriei", ru: "Площадь кухни" },
  land: { ro: "Teren", ru: "Участок" },
  floorsRow: { ro: "Număr de etaje", ru: "Этажность" },
  yearBuilt: { ro: "An construcție", ru: "Год постройки" },
  buildingType: { ro: "Tip clădire", ru: "Тип здания" },
  ceiling: { ro: "Înălțimea tavanelor", ru: "Высота потолков" },
  heating: { ro: "Încălzire", ru: "Отопление" },
  balconies: { ro: "Balcoane", ru: "Балконы" },
  parking: { ro: "Parcare", ru: "Парковка" },
  developer: { ro: "Dezvoltator", ru: "Застройщик" },
  complex: { ro: "Ansamblu rezidențial", ru: "Жилой комплекс" },
  availability: { ro: "Disponibilitate", ru: "Доступность" },
  offerCode: { ro: "Cod ofertă", ru: "Код объявления" },
  none: { ro: "Fără", ru: "Нет" },

  /* stat band */
  roomsShort: { ro: "Camere", ru: "Комнат" },

  /* location */
  mapTitle: { ro: "Harta zonei", ru: "Карта района" },
  openInMaps: { ro: "Deschide în Google Maps", ru: "Открыть в Google Maps" },
  poiTransport: { ro: "Transport", ru: "Транспорт" },
  poiEducation: { ro: "Educație", ru: "Образование" },
  poiDaily: { ro: "Zilnic", ru: "Каждый день" },

  /* costs */
  costsLead: {
    ro: "Cumpărătorul din Chișinău gândește în rată lunară, nu în preț total. Mută avansul și termenul ca să vezi cât ar însemna creditul pentru această proprietate.",
    ru: "Покупатель в Кишинёве думает ежемесячным платежом, а не полной ценой. Подвиньте первоначальный взнос и срок, чтобы увидеть, каким был бы кредит на этот объект.",
  },
  rentCosts: {
    ro: "Chiria se achită lunar, în avans. La semnare se adaugă de regulă garanția de o lună și comisionul agenției.",
    ru: "Аренда оплачивается ежемесячно, авансом. При подписании обычно добавляются залог за месяц и комиссия агентства.",
  },
  inMdl: { ro: "La cursul de", ru: "По курсу" },

  /* actions */
  linkCopied: { ro: "Link copiat", ru: "Ссылка скопирована" },
  allInSector: { ro: "Vezi toate proprietățile", ru: "Смотреть все объекты" },
  perSqmMonth: { ro: "pe lună", ru: "в месяц" },
} satisfies Record<string, T>;

/** The floor spelled out, for a table row that already carries the word "Etaj". */
const FLOOR_WORD: Record<"parter" | "demisol" | "mansarda", T> = {
  parter: { ro: "Parter", ru: "1-й" },
  demisol: { ro: "Demisol", ru: "Цоколь" },
  mansarda: { ro: "Mansardă", ru: "Мансарда" },
};

/**
 * "4 / 9". The stat band and the feature table print the word "Etaj" in their
 * own label column, so the value must not repeat it.
 */
export function floorFigure(floor: Floor, floors: number, t: (v: T) => string): string {
  const head = typeof floor === "number" ? String(floor) : t(FLOOR_WORD[floor]);
  return floors > 0 ? `${head} / ${floors}` : head;
}

/** "2,75 m" from the 275 centimetres stored on the property. */
export function ceilingFigure(cm: number, lang: "ro" | "ru"): string {
  return `${(cm / 100).toFixed(2).replace(".", ",")} ${lang === "ru" ? "м" : "m"}`;
}

/** Three groups instead of seven kinds: what a buyer actually scans for. */
export const POI_GROUPS: { title: T; kinds: PoiKind[] }[] = [
  { title: L.poiTransport, kinds: ["transport"] },
  { title: L.poiEducation, kinds: ["gradinita", "scoala"] },
  { title: L.poiDaily, kinds: ["magazin", "parc", "policlinica", "sala-sport"] },
];
