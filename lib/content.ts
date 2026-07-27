import type { Sector, T } from "./types";

/* ---------------------------------------------------------------------------
   Everything the interface says, in both languages, in one place.
   Page components never hold a hardcoded string: they read from UI, NAV or
   the label maps below, and pass the pair through t() from lib/lang.
   --------------------------------------------------------------------------- */

export const AGENCY = {
  name: "ARCA",
  origin: "https://arca.md",
  tagline: { ro: "Acasă începe aici.", ru: "Дом начинается здесь." } as T,
  phone: "+373 22 84 16 40",
  phoneHref: "tel:+37322841640",
  mobile: "+373 69 84 16 40",
  mobileHref: "tel:+37369841640",
  whatsapp: "https://wa.me/37369841640",
  viber: "viber://chat?number=%2B37369841640",
  telegram: "https://t.me/arca_md",
  email: "contact@arca.md",
  address: {
    ro: "bd. Ștefan cel Mare 132, et. 4, of. 407, Chișinău",
    ru: "бул. Штефан чел Маре 132, эт. 4, оф. 407, Кишинёв",
  } as T,
  coords: { lat: 47.0245, lng: 28.8322 },
  schedule: {
    ro: "Luni-Vineri 09:00-19:00 · Sâmbătă 10:00-15:00 · Duminică închis",
    ru: "Пон.-Пят. 09:00-19:00 · Суббота 10:00-15:00 · Воскресенье выходной",
  } as T,
  founded: 2012,
  /** Shown in the trust line and the figures block; kept here so one edit moves all. */
  stats: {
    years: 14,
    deals2025: 318,
    replyMinutes: 11,
  },
} as const;

export const NAV: { href: string; label: T }[] = [
  { href: "/proprietati?tranzactie=vanzare", label: { ro: "Vânzare", ru: "Продажа" } },
  { href: "/proprietati?tranzactie=chirie", label: { ro: "Chirie", ru: "Аренда" } },
  { href: "/complexe", label: { ro: "Ansambluri", ru: "Комплексы" } },
  { href: "/agenti", label: { ro: "Agenți", ru: "Агенты" } },
  { href: "/despre", label: { ro: "Despre", ru: "О нас" } },
  { href: "/contact", label: { ro: "Contact", ru: "Контакты" } },
];

export interface LinkGroup {
  title: T;
  links: { href: string; label: T }[];
}

export type LinkGroupId = "vanzare-sector" | "chirie-sector" | "camere" | "tipuri";

/**
 * The filter shortcuts, grouped by the way people actually search. The footer
 * prints the two sector sets, the results page prints the other two under its
 * listings. Every screen names the groups it wants, so nothing here depends on
 * the order of this object.
 */
export const LINK_GROUPS: Record<LinkGroupId, LinkGroup> = {
  "vanzare-sector": {
    title: { ro: "Apartamente pe sector", ru: "Квартиры по секторам" },
    links: [
      { href: "/proprietati?sector=centru", label: { ro: "Centru", ru: "Центр" } },
      { href: "/proprietati?sector=botanica", label: { ro: "Botanica", ru: "Ботаника" } },
      { href: "/proprietati?sector=buiucani", label: { ro: "Buiucani", ru: "Буюканы" } },
      { href: "/proprietati?sector=riscani", label: { ro: "Râșcani", ru: "Рышкановка" } },
      { href: "/proprietati?sector=ciocana", label: { ro: "Ciocana", ru: "Чеканы" } },
      { href: "/proprietati?sector=telecentru", label: { ro: "Telecentru", ru: "Телецентр" } },
      { href: "/proprietati?sector=posta-veche", label: { ro: "Poșta Veche", ru: "Старая Почта" } },
    ],
  },
  camere: {
    title: { ro: "După numărul de camere", ru: "По количеству комнат" },
    links: [
      { href: "/proprietati?camere=1", label: { ro: "Apartamente cu 1 cameră", ru: "Однокомнатные квартиры" } },
      { href: "/proprietati?camere=2", label: { ro: "Apartamente cu 2 camere", ru: "Двухкомнатные квартиры" } },
      { href: "/proprietati?camere=3", label: { ro: "Apartamente cu 3 camere", ru: "Трёхкомнатные квартиры" } },
      { href: "/proprietati?camere=4", label: { ro: "Apartamente cu 4+ camere", ru: "Квартиры 4+ комнат" } },
    ],
  },
  tipuri: {
    title: { ro: "Case și terenuri", ru: "Дома и участки" },
    links: [
      { href: "/proprietati?tip=casa", label: { ro: "Case de vânzare", ru: "Дома на продажу" } },
      { href: "/proprietati?tip=teren", label: { ro: "Terenuri", ru: "Участки" } },
      { href: "/proprietati?tip=comercial", label: { ro: "Spații comerciale", ru: "Коммерческие помещения" } },
      { href: "/proprietati?tip=birou", label: { ro: "Birouri", ru: "Офисы" } },
    ],
  },
  "chirie-sector": {
    title: { ro: "Chirii pe sector", ru: "Аренда по секторам" },
    links: [
      { href: "/proprietati?tranzactie=chirie&sector=centru", label: { ro: "Chirie în Centru", ru: "Аренда в Центре" } },
      { href: "/proprietati?tranzactie=chirie&sector=botanica", label: { ro: "Chirie în Botanica", ru: "Аренда в Ботанике" } },
      { href: "/proprietati?tranzactie=chirie&sector=buiucani", label: { ro: "Chirie în Buiucani", ru: "Аренда в Буюканах" } },
      { href: "/proprietati?tranzactie=chirie&sector=riscani", label: { ro: "Chirie în Râșcani", ru: "Аренда в Рышкановке" } },
      { href: "/proprietati?tranzactie=chirie&sector=ciocana", label: { ro: "Chirie în Ciocana", ru: "Аренда в Чеканах" } },
    ],
  },
};

/* ---------------------------------------------------------------------------
   Label maps. Every enum value in lib/types.ts that a human ever reads has a
   pair here. Components look the value up, they never write the word.
   --------------------------------------------------------------------------- */

export const SECTOR_LABEL: Record<Sector, T> = {
  centru: { ro: "Centru", ru: "Центр" },
  botanica: { ro: "Botanica", ru: "Ботаника" },
  buiucani: { ro: "Buiucani", ru: "Буюканы" },
  riscani: { ro: "Râșcani", ru: "Рышкановка" },
  ciocana: { ro: "Ciocana", ru: "Чеканы" },
  telecentru: { ro: "Telecentru", ru: "Телецентр" },
  "posta-veche": { ro: "Poșta Veche", ru: "Старая Почта" },
  durlesti: { ro: "Durlești", ru: "Дурлешты" },
  stauceni: { ro: "Stăuceni", ru: "Ставчены" },
  codru: { ro: "Codru", ru: "Кодру" },
  dumbrava: { ro: "Dumbrava", ru: "Думбрава" },
  ialoveni: { ro: "Ialoveni", ru: "Яловены" },
};

/** The locative form, for headings like "Apartamente de vânzare în Botanica". */
export const SECTOR_IN: Record<Sector, T> = {
  centru: { ro: "în Centru", ru: "в Центре" },
  botanica: { ro: "în Botanica", ru: "в Ботанике" },
  buiucani: { ro: "în Buiucani", ru: "в Буюканах" },
  riscani: { ro: "în Râșcani", ru: "в Рышкановке" },
  ciocana: { ro: "în Ciocana", ru: "в Чеканах" },
  telecentru: { ro: "în Telecentru", ru: "в Телецентре" },
  "posta-veche": { ro: "în Poșta Veche", ru: "на Старой Почте" },
  durlesti: { ro: "în Durlești", ru: "в Дурлештах" },
  stauceni: { ro: "în Stăuceni", ru: "в Ставченах" },
  codru: { ro: "în Codru", ru: "в Кодру" },
  dumbrava: { ro: "în Dumbrava", ru: "в Думбраве" },
  ialoveni: { ro: "în Ialoveni", ru: "в Яловенах" },
};

export const DEAL_LABEL = {
  vanzare: { ro: "Vânzare", ru: "Продажа" },
  chirie: { ro: "Chirie", ru: "Аренда" },
} as const satisfies Record<string, T>;

export const KIND_LABEL = {
  apartament: { ro: "Apartament", ru: "Квартира" },
  casa: { ro: "Casă", ru: "Дом" },
  teren: { ro: "Teren", ru: "Участок" },
  comercial: { ro: "Spațiu comercial", ru: "Коммерческое помещение" },
  birou: { ro: "Birou", ru: "Офис" },
} as const satisfies Record<string, T>;

/** Plural form, for the filter dropdown. */
export const KIND_PLURAL = {
  apartament: { ro: "Apartamente", ru: "Квартиры" },
  casa: { ro: "Case și vile", ru: "Дома и виллы" },
  teren: { ro: "Terenuri", ru: "Участки" },
  comercial: { ro: "Spații comerciale", ru: "Коммерческие помещения" },
  birou: { ro: "Birouri", ru: "Офисы" },
} as const satisfies Record<string, T>;

export const FLAG_LABEL = {
  nou: { ro: "Nou", ru: "Новое" },
  exclusivitate: { ro: "Exclusivitate", ru: "Эксклюзив" },
  "pret-redus": { ro: "Preț redus", ru: "Цена снижена" },
  "comision-0": { ro: "Comision 0%", ru: "Без комиссии" },
  "gata-de-mutat": { ro: "Gata de mutat", ru: "Готова к заселению" },
} as const satisfies Record<string, T>;

export const STATUS_LABEL = {
  activ: { ro: "Activ", ru: "Активно" },
  rezervat: { ro: "Rezervat", ru: "Забронировано" },
  vandut: { ro: "Vândut", ru: "Продано" },
  arhivat: { ro: "Arhivat", ru: "В архиве" },
} as const satisfies Record<string, T>;

export const FUND_LABEL = {
  "bloc-nou": { ro: "Bloc nou", ru: "Новостройка" },
  "fond-vechi": { ro: "Fond vechi", ru: "Вторичный фонд" },
} as const satisfies Record<string, T>;

export const CONDITION_LABEL = {
  "varianta-alba": { ro: "Variantă albă", ru: "Белый вариант" },
  "varianta-sura": { ro: "Variantă sură", ru: "Серый вариант" },
  euroreparatie: { ro: "Euroreparație", ru: "Евроремонт" },
  "reparatie-cosmetica": { ro: "Reparație cosmetică", ru: "Косметический ремонт" },
  "necesita-reparatie": { ro: "Necesită reparație", ru: "Требует ремонта" },
  "design-individual": { ro: "Design individual", ru: "Дизайнерский ремонт" },
} as const satisfies Record<string, T>;

export const LAYOUT_LABEL = {
  decomandat: { ro: "Decomandat", ru: "Раздельная" },
  semidecomandat: { ro: "Semidecomandat", ru: "Полураздельная" },
  nedecomandat: { ro: "Nedecomandat", ru: "Смежная" },
  circular: { ro: "Circular", ru: "Круговая" },
} as const satisfies Record<string, T>;

export const BUILDING_LABEL = {
  monolit: { ro: "Monolit", ru: "Монолит" },
  caramida: { ro: "Cărămidă", ru: "Кирпич" },
  panou: { ro: "Panou", ru: "Панель" },
  combinat: { ro: "Combinat", ru: "Комбинированный" },
  "beton-celular": { ro: "Beton celular", ru: "Газобетон" },
} as const satisfies Record<string, T>;

export const HEATING_LABEL = {
  autonoma: { ro: "Autonomă", ru: "Автономное" },
  centralizata: { ro: "Centralizată", ru: "Центральное" },
  pardoseala: { ro: "Prin pardoseală", ru: "Тёплый пол" },
} as const satisfies Record<string, T>;

export const PARKING_LABEL = {
  subteran: { ro: "Parcare subterană", ru: "Подземный паркинг" },
  "la-sol": { ro: "Parcare la sol", ru: "Наземная парковка" },
  garaj: { ro: "Garaj", ru: "Гараж" },
  fara: { ro: "Fără parcare", ru: "Без парковки" },
} as const satisfies Record<string, T>;

export const AMENITY_LABEL = {
  parcare: { ro: "Parcare", ru: "Парковка" },
  garaj: { ro: "Garaj", ru: "Гараж" },
  balcon: { ro: "Balcon", ru: "Балкон" },
  terasa: { ro: "Terasă", ru: "Терраса" },
  lift: { ro: "Lift", ru: "Лифт" },
  "centrala-termica": { ro: "Centrală termică", ru: "Газовый котёл" },
  mobilat: { ro: "Mobilat", ru: "Меблирована" },
  tehnica: { ro: "Tehnică electrocasnică", ru: "Бытовая техника" },
  "aer-conditionat": { ro: "Aer condiționat", ru: "Кондиционер" },
  gradina: { ro: "Grădină", ru: "Сад" },
  "curte-inchisa": { ro: "Curte închisă", ru: "Закрытый двор" },
  pivnita: { ro: "Pivniță", ru: "Погреб" },
  "bucatarie-separata": { ro: "Bucătărie separată", ru: "Отдельная кухня" },
  videointerfon: { ro: "Videointerfon", ru: "Видеодомофон" },
  paza: { ro: "Pază", ru: "Охрана" },
  "supraveghere-video": { ro: "Supraveghere video", ru: "Видеонаблюдение" },
  "geamuri-termopan": { ro: "Geamuri termopan", ru: "Стеклопакеты" },
  "incalzire-pardoseala": { ro: "Încălzire prin pardoseală", ru: "Тёплый пол" },
  "teren-joaca": { ro: "Teren de joacă", ru: "Детская площадка" },
  internet: { ro: "Internet", ru: "Интернет" },
} as const satisfies Record<string, T>;

export const POI_LABEL = {
  transport: { ro: "Transport", ru: "Транспорт" },
  gradinita: { ro: "Grădiniță", ru: "Детский сад" },
  scoala: { ro: "Școală", ru: "Школа" },
  magazin: { ro: "Magazin", ru: "Магазин" },
  parc: { ro: "Parc", ru: "Парк" },
  policlinica: { ro: "Policlinică", ru: "Поликлиника" },
  "sala-sport": { ro: "Sală de sport", ru: "Спортзал" },
} as const satisfies Record<string, T>;

export const STAGE_LABEL = {
  "in-constructie": { ro: "În construcție", ru: "В строительстве" },
  "dat-in-exploatare": { ro: "Dat în exploatare", ru: "Сдан в эксплуатацию" },
} as const satisfies Record<string, T>;

export const LEAD_SOURCE_LABEL = {
  anunt: { ro: "Anunț", ru: "Объявление" },
  vinde: { ro: "Vinde", ru: "Продажа" },
  contact: { ro: "Contact", ru: "Контакты" },
  agent: { ro: "Agent", ru: "Агент" },
  cautare: { ro: "Cerere de căutare", ru: "Запрос на подбор" },
} as const satisfies Record<string, T>;

export const LEAD_STATE_LABEL = {
  nou: { ro: "Nou", ru: "Новый" },
  contactat: { ro: "Contactat", ru: "Связались" },
  programat: { ro: "Programat", ru: "Назначен просмотр" },
  inchis: { ro: "Închis", ru: "Закрыт" },
} as const satisfies Record<string, T>;

/* ---------------------------------------------------------------------------
   Interface strings. Grouped by where they appear, so a page can destructure
   one group instead of hunting through a flat list.
   --------------------------------------------------------------------------- */

export const UI = {
  /* generic actions */
  search: { ro: "Caută", ru: "Найти" },
  send: { ro: "Trimite →", ru: "Отправить →" },
  close: { ro: "Închide", ru: "Закрыть" },
  back: { ro: "Înapoi", ru: "Назад" },
  next: { ro: "Înainte", ru: "Вперёд" },
  more: { ro: "Vezi mai mult", ru: "Показать больше" },
  readAll: { ro: "Citește tot", ru: "Читать полностью" },
  callNow: { ro: "Sună acum", ru: "Позвонить" },
  call: { ro: "Sună", ru: "Позвонить" },
  write: { ro: "Scrie-ne", ru: "Написать нам" },
  save: { ro: "Salvează", ru: "Сохранить" },
  saved: { ro: "Salvat", ru: "Сохранено" },
  remove: { ro: "Scoate", ru: "Убрать" },
  share: { ro: "Distribuie", ru: "Поделиться" },
  copyLink: { ro: "Copiază link", ru: "Скопировать ссылку" },
  seeOnMap: { ro: "Vezi pe hartă", ru: "Показать на карте" },
  openMenu: { ro: "Deschide meniul", ru: "Открыть меню" },
  closeMenu: { ro: "Închide meniul", ru: "Закрыть меню" },

  /* search and filters */
  searchPlaceholder: {
    ro: "Sector, stradă, complex sau cod ofertă",
    ru: "Сектор, улица, комплекс или код объявления",
  },
  filters: { ro: "Filtre", ru: "Фильтры" },
  moreFilters: { ro: "Mai multe filtre", ru: "Больше фильтров" },
  reset: { ro: "Resetează", ru: "Сбросить" },
  resetFilters: { ro: "Resetează filtrele", ru: "Сбросить фильтры" },
  clearAll: { ro: "Șterge tot", ru: "Очистить всё" },
  sort: { ro: "Sortare", ru: "Сортировка" },
  allTypes: { ro: "Toate tipurile", ru: "Все типы" },
  anyLayout: { ro: "Oricare", ru: "Любая" },
  anyArea: { ro: "Oricât", ru: "Любая" },
  anyCount: { ro: "Oricâte", ru: "Любое" },
  noMin: { ro: "Fără minim", ru: "Без минимума" },
  noMax: { ro: "Fără maxim", ru: "Без максимума" },
  location: { ro: "Locație", ru: "Расположение" },
  rooms: { ro: "Camere", ru: "Комнаты" },
  price: { ro: "Preț", ru: "Цена" },
  propertyType: { ro: "Tip proprietate", ru: "Тип недвижимости" },
  chisinau: { ro: "Chișinău", ru: "Кишинёв" },
  suburbs: { ro: "Suburbii", ru: "Пригороды" },
  excludeTopFloor: { ro: "Exclus ultimul etaj", ru: "Кроме последнего этажа" },
  excludeGroundFloor: { ro: "Exclus parter", ru: "Кроме первого этажа" },
  onlyExclusive: { ro: "Doar exclusivități", ru: "Только эксклюзивы" },
  gridView: { ro: "Grilă", ru: "Плитка" },
  listView: { ro: "Listă", ru: "Список" },

  /* sorting */
  sortNewest: { ro: "Cele mai noi", ru: "Сначала новые" },
  sortPriceAsc: { ro: "Preț crescător", ru: "Сначала дешевле" },
  sortPriceDesc: { ro: "Preț descrescător", ru: "Сначала дороже" },
  sortSqmAsc: { ro: "€/m² crescător", ru: "€/м² по возрастанию" },
  sortAreaDesc: { ro: "Suprafață descrescătoare", ru: "По площади" },

  /* counters */
  properties: { ro: "proprietăți", ru: "объектов" },
  propertiesOne: { ro: "proprietate", ru: "объект" },
  offers: { ro: "oferte", ru: "предложений" },
  showAll: { ro: "Vezi toate", ru: "Смотреть все" },
  showResults: { ro: "Arată rezultatele", ru: "Показать результаты" },

  /* property fields */
  code: { ro: "Cod", ru: "Код" },
  updated: { ro: "Actualizat", ru: "Обновлено" },
  area: { ro: "Suprafață", ru: "Площадь" },
  floorLabel: { ro: "Etaj", ru: "Этаж" },
  year: { ro: "An", ru: "Год" },
  condition: { ro: "Stare", ru: "Состояние" },
  fund: { ro: "Fond locativ", ru: "Тип жилья" },
  layout: { ro: "Compartimentare", ru: "Планировка" },
  available: { ro: "Disponibil", ru: "Свободна" },
  negotiable: { ro: "Preț negociabil", ru: "Цена договорная" },
  perMonth: { ro: "€/lună", ru: "€/мес." },
  perSqm: { ro: "€/m²", ru: "€/м²" },

  /* listing page sections */
  overview: { ro: "Prezentare", ru: "Описание" },
  features: { ro: "Caracteristici", ru: "Характеристики" },
  amenities: { ro: "Facilități", ru: "Удобства" },
  locationSection: { ro: "Localizare", ru: "Расположение" },
  costs: { ro: "Costuri", ru: "Расходы" },
  similar: { ro: "Proprietăți similare", ru: "Похожие объекты" },
  pricePosition: { ro: "Poziția prețului", ru: "Позиция цены" },
  howWeCalculate: { ro: "Cum calculăm", ru: "Как мы считаем" },
  pointsOfInterest: { ro: "Puncte de interes", ru: "Что рядом" },
  allPhotos: { ro: "Toate fotografiile", ru: "Все фотографии" },
  reportError: { ro: "Raportează o eroare în anunț", ru: "Сообщить об ошибке в объявлении" },

  /* forms */
  firstName: { ro: "Prenume", ru: "Имя" },
  fullName: { ro: "Nume", ru: "Имя" },
  phone: { ro: "Telefon", ru: "Телефон" },
  email: { ro: "Email", ru: "Email" },
  emailOptional: { ro: "Email (opțional)", ru: "Email (необязательно)" },
  message: { ro: "Mesaj", ru: "Сообщение" },
  messageOptional: { ro: "Mesaj (opțional)", ru: "Сообщение (необязательно)" },
  subject: { ro: "Subiect", ru: "Тема" },
  consent: {
    ro: "Sunt de acord cu prelucrarea datelor mele pentru a fi contactat.",
    ru: "Согласен на обработку моих данных для обратной связи.",
  },
  bookViewing: { ro: "Programează vizionare", ru: "Записаться на просмотр" },
  requestValuation: { ro: "Solicită evaluarea gratuită", ru: "Заказать бесплатную оценку" },

  /* form states */
  sending: { ro: "Se trimite…", ru: "Отправляем…" },
  successTitle: { ro: "Am primit cererea", ru: "Мы получили заявку" },
  errorGeneric: {
    ro: "Nu am putut trimite cererea. Sunați-ne la +373 69 84 16 40.",
    ru: "Не удалось отправить заявку. Позвоните нам: +373 69 84 16 40.",
  },
  errorName: { ro: "Scrieți numele dumneavoastră.", ru: "Укажите ваше имя." },
  errorPhone: { ro: "Scrieți un număr de telefon valid.", ru: "Укажите корректный номер телефона." },
  errorConsent: { ro: "Bifați acordul pentru a putea fi contactat.", ru: "Отметьте согласие, чтобы мы могли связаться." },

  /* empty states */
  emptyTitle: {
    ro: "Nicio proprietate pentru filtrele alese",
    ru: "Ничего не найдено по выбранным фильтрам",
  },
  emptySaved: { ro: "Încă n-ai salvat nimic", ru: "Вы пока ничего не сохранили" },
  notifyMe: { ro: "Anunță-mă când apare", ru: "Сообщить, когда появится" },
} as const satisfies Record<string, T>;

/** Rendered under every appearance of the index. Honesty is part of the idea. */
export const INDEX_DISCLAIMER: T = {
  ro: "Mediana ofertelor active din portofoliul ARCA la data afișată. Nu sunt prețuri de tranzacție și nu înlocuiesc o evaluare.",
  ru: "Медиана активных предложений портфеля ARCA на указанную дату. Это не цены сделок и они не заменяют оценку.",
};
