"use client";

import Link from "next/link";
import AgentCard from "@/components/AgentCard";
import Gallery from "@/components/Gallery";
import LeadRequestForm from "@/components/LeadRequestForm";
import PropertyCard from "@/components/PropertyCard";
import {
  AMENITY_LABEL,
  HEATING_LABEL,
  PARKING_LABEL,
  SECTOR_LABEL,
  STAGE_LABEL,
  UI,
} from "@/lib/content";
import { formatCount, formatPricePerSqm, formatStreet } from "@/lib/format";
import { useLang } from "@/lib/lang";
import { sectorSaleBand } from "@/lib/market-index";
import type { Agent, Complex, Property, T } from "@/lib/types";
import styles from "./complex.module.css";

const C = {
  home: { ro: "Acasă", ru: "Главная" },
  all: { ro: "Ansambluri", ru: "Комплексы" },
  trail: { ro: "Traseu de navigare", ru: "Навигационная цепочка" },
  about: { ro: "Despre ansamblu", ru: "О комплексе" },
  facts: { ro: "Date despre bloc", ru: "Данные о доме" },
  developer: { ro: "Dezvoltator", ru: "Застройщик" },
  sector: { ro: "Sector", ru: "Сектор" },
  address: { ro: "Adresă", ru: "Адрес" },
  blocks: { ro: "Blocuri", ru: "Корпусов" },
  floors: { ro: "Etaje", ru: "Этажность" },
  ceiling: { ro: "Înălțimea tavanelor", ru: "Высота потолков" },
  heating: { ro: "Încălzire", ru: "Отопление" },
  parking: { ro: "Parcare", ru: "Парковка" },
  stage: { ro: "Stadiu", ru: "Стадия" },
  priceFrom: { ro: "Preț de pornire", ru: "Стартовая цена" },
  sectorMedian: { ro: "Mediana sectorului", ru: "Медиана сектора" },
  amenities: { ro: "Ce are ansamblul", ru: "Что есть в комплексе" },
  offers: { ro: "Ofertele noastre din bloc", ru: "Наши предложения в доме" },
  offersNote: {
    ro: "Doar apartamentele pe care le avem noi în lucru. Dacă nu e ce vă trebuie, întrebați — știm și ce se pregătește să iasă.",
    ru: "Только квартиры, которые ведём мы. Если это не то, что нужно, спросите — мы знаем и то, что готовится к выходу.",
  },
  empty: {
    ro: "Momentan nu avem un apartament liber în acest ansamblu. Lăsați un număr și vă sunăm când apare primul.",
    ru: "Сейчас свободной квартиры в этом комплексе у нас нет. Оставьте номер, и мы позвоним, когда появится первая.",
  },
  allInSector: { ro: "Vezi tot ce avem", ru: "Смотреть всё, что есть" },
  map: { ro: "Unde se află", ru: "Где находится" },
  openMaps: { ro: "Deschide în Google Maps", ru: "Открыть в Google Maps" },
  askTitle: { ro: "Întrebați despre ansamblu", ru: "Спросите о комплексе" },
  askText: {
    ro: "Vă spunem ce etaje sunt libere, cât cere dezvoltatorul astăzi și ce au plătit vecinii anul trecut la întreținere.",
    ru: "Расскажем, какие этажи свободны, сколько просит застройщик сегодня и сколько соседи платили за содержание в прошлом году.",
  },
  submit: { ro: "Trimite întrebarea", ru: "Отправить вопрос" },
} satisfies Record<string, T>;

interface Props {
  complex: Complex;
  agent: Agent;
  properties: Property[];
}

export default function ComplexView({ complex, agent, properties }: Props) {
  const { t, lang } = useLang();

  const { lat, lng } = complex.coords;
  const box = [lng - 0.0075, lat - 0.0035, lng + 0.0075, lat + 0.0035]
    .map((n) => n.toFixed(5))
    .join(",");
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(box)}&layer=mapnik&marker=${lat},${lng}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const band = sectorSaleBand(complex.sector);

  const rows: { label: T; value: string }[] = [
    { label: C.developer, value: complex.developer },
    { label: C.address, value: formatStreet(complex.street, lang) },
    { label: C.sector, value: t(SECTOR_LABEL[complex.sector]) },
    { label: C.stage, value: t(complex.completion) },
    { label: C.blocks, value: String(complex.blocks) },
    { label: C.floors, value: String(complex.floors) },
    {
      label: C.ceiling,
      value: `${(complex.ceilingHeight / 100).toFixed(2).replace(".", ",")} ${lang === "ru" ? "м" : "m"}`,
    },
    { label: C.heating, value: t(HEATING_LABEL[complex.heating]) },
    { label: C.parking, value: t(PARKING_LABEL[complex.parking]) },
  ];

  return (
    <>
      <div className={`wrap ${styles.crumbs}`}>
        <nav aria-label={t(C.trail)}>
          <ol className={styles.crumbList}>
            <li>
              <Link href="/">{t(C.home)}</Link>
            </li>
            <li>
              <Link href="/complexe">{t(C.all)}</Link>
            </li>
            <li aria-current="page">{complex.name}</li>
          </ol>
        </nav>
      </div>

      <div className="wrap">
        <Gallery
          photos={complex.photos}
          badges={[{ label: STAGE_LABEL[complex.stage] }]}
        />
      </div>

      <div className={`wrap ${styles.head}`}>
        <div className={styles.headMain}>
          <p className="kicker rv">{t(SECTOR_LABEL[complex.sector])}</p>
          <h1 className={`rv ${styles.title}`}>{complex.name}</h1>
          <p className={`rv ${styles.street}`}>
            {formatStreet(complex.street, lang)} · {complex.developer}
          </p>
        </div>

        <div className={`rv ${styles.headPrice}`}>
          <p className="kicker">{t(C.priceFrom)}</p>
          <p className={`num ${styles.price}`}>
            {formatPricePerSqm(complex.priceFromPerSqm, lang)}
          </p>
          {band && (
            <p className={`spec num ${styles.priceNote}`}>
              {t(C.sectorMedian)}: {formatPricePerSqm(band.median, lang)}
            </p>
          )}
        </div>
      </div>

      <div className={`wrap ${styles.grid}`}>
        <div className={styles.main}>
          <section className={`rv ${styles.section}`}>
            <h2>{t(C.about)}</h2>
            <p className={`lead ${styles.text}`}>{t(complex.description)}</p>
          </section>

          <section className={`rv ${styles.section}`}>
            <h2>{t(C.facts)}</h2>
            <dl className={styles.table}>
              {rows.map((row) => (
                <div key={row.label.ro} className={styles.tableRow}>
                  <dt>{t(row.label)}</dt>
                  <dd className="num">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={`rv ${styles.section}`}>
            <h2>{t(C.amenities)}</h2>
            <ul className={styles.amenities}>
              {complex.amenities.map((a) => (
                <li key={a} className={styles.amenity}>
                  {t(AMENITY_LABEL[a])}
                </li>
              ))}
            </ul>
          </section>

          <section className={`rv ${styles.section}`}>
            <h2>{t(C.map)}</h2>
            <div className={styles.map}>
              <iframe
                src={mapSrc}
                title={`${complex.name} — ${formatStreet(complex.street, lang)}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`link ${styles.mapLink}`}
            >
              {t(C.openMaps)}
            </a>
          </section>
        </div>

        <aside className={styles.side}>
          <AgentCard agent={agent} />
          <div className={styles.ask}>
            <h2 className={styles.askTitle}>{t(C.askTitle)}</h2>
            <p className={styles.askText}>{t(C.askText)}</p>
            <LeadRequestForm
              source="cautare"
              fields={["name", "phone", "message"]}
              agentSlug={agent.slug}
              submitLabel={C.submit}
              messagePrefix={{
                ro: `Întrebare despre ${complex.name}, ${complex.street}.`,
                ru: `Вопрос о ${complex.name}, ${complex.street}.`,
              }}
              messagePlaceholder={{
                ro: "Ce etaj, ce suprafață, ce buget?",
                ru: "Какой этаж, какая площадь, какой бюджет?",
              }}
            />
          </div>
        </aside>
      </div>

      <section className="wrap sec">
        <div className={`${styles.offersHead} rv`}>
          <div>
            <p className="kicker">
              {formatCount(properties.length, t(UI.propertiesOne), t(UI.properties), lang)}
            </p>
            <h2 className={styles.offersTitle}>{t(C.offers)}</h2>
          </div>
          <Link href={`/proprietati?sector=${complex.sector}`} className="link">
            {t(C.allInSector)} →
          </Link>
        </div>

        {properties.length > 0 ? (
          <>
            <p className={`${styles.offersNote} rv`}>{t(C.offersNote)}</p>
            <div className="grid-cards">
              {properties.map((p, i) => (
                <PropertyCard key={p.id} property={p} delay={Math.min(i, 5) * 60} />
              ))}
            </div>
          </>
        ) : (
          <p className={`lead ${styles.empty} rv`}>{t(C.empty)}</p>
        )}
      </section>
    </>
  );
}
