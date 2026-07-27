"use client";

import Image from "next/image";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { AGENCY, SECTOR_LABEL, STAGE_LABEL, UI } from "@/lib/content";
import { formatCount, formatPrice, formatPricePerSqm, formatStreet } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { Complex, Deal, T } from "@/lib/types";
import styles from "./complexes.module.css";

export interface ComplexCard {
  complex: Complex;
  offers: number;
  fromPrice: number | null;
  deals: Deal[];
}

const C = {
  kicker: { ro: "Ansambluri", ru: "Комплексы" },
  title: {
    ro: "Blocurile noi în care avem apartamente",
    ru: "Новостройки, в которых у нас есть квартиры",
  },
  lead: {
    ro: "Nu listăm ansambluri pe care nu le-am văzut. Fiecare bloc de mai jos are cel puțin un apartament în portofoliul nostru, iar agentul care îl are în lucru cunoaște scara, vecinii și asociația.",
    ru: "Мы не публикуем комплексы, которых не видели. У каждого дома ниже есть хотя бы одна квартира в нашем портфеле, а ведущий его агент знает подъезд, соседей и ассоциацию жильцов.",
  },
  from: { ro: "De la", ru: "От" },
  fromSqm: { ro: "Preț de pornire", ru: "Стартовая цена" },
  developer: { ro: "Dezvoltator", ru: "Застройщик" },
  blocks: { ro: "Blocuri", ru: "Корпусов" },
  floors: { ro: "Etaje", ru: "Этажей" },
  ceiling: { ro: "Tavane", ru: "Потолки" },
  open: { ro: "Vezi ansamblul", ru: "Смотреть комплекс" },
  offersLink: { ro: "Ofertele din bloc", ru: "Предложения в доме" },
  noOffers: {
    ro: "Momentan fără ofertă activă — sunați și vă anunțăm când apare una.",
    ru: "Сейчас активных предложений нет — позвоните, и мы сообщим, когда появится.",
  },
  helpTitle: { ro: "Cumpărați în bloc nou?", ru: "Покупаете в новостройке?" },
  helpText: {
    ro: "La un apartament în bloc nou comisionul îl plătește de regulă dezvoltatorul, nu cumpărătorul. Noi verificăm actele blocului, comparăm etajele libere între ele și mergem cu dumneavoastră la vizionare — costul rămâne același ca și cum ați fi mers singur.",
    ru: "В новостройке комиссию обычно платит застройщик, а не покупатель. Мы проверяем документы дома, сравниваем свободные этажи между собой и едем с вами на просмотр — стоимость для вас та же, как если бы вы пошли одни.",
  },
  helpCall: { ro: "Sună un agent", ru: "Позвонить агенту" },
  helpAll: { ro: "Vezi toate blocurile noi", ru: "Смотреть все новостройки" },
} satisfies Record<string, T>;

const DEAL_NOTE: Record<Deal, T> = {
  vanzare: { ro: "vânzare", ru: "продажа" },
  chirie: { ro: "chirie", ru: "аренда" },
};

export default function ComplexesView({ items }: { items: ComplexCard[] }) {
  const { t, lang } = useLang();

  return (
    <>
      <PageIntro
        kicker={C.kicker}
        title={C.title}
        lead={C.lead}
        meta={{
          ro: `${formatCount(items.length, "ansamblu", "ansambluri", "ro")} · ${formatCount(
            items.reduce((n, i) => n + i.offers, 0),
            "ofertă activă",
            "oferte active",
            "ro"
          )}`,
          ru: `${items.length} комплексов · ${items.reduce((n, i) => n + i.offers, 0)} активных предложений`,
        }}
      />

      <div className="wrap">
        <ul className={styles.list}>
          {items.map(({ complex, offers, fromPrice, deals }, i) => (
            <li key={complex.slug} className={`${styles.item} rv`}>
              <Link
                href={`/complexe/${complex.slug}`}
                className={`${styles.photo} ph rvimg`}
                aria-label={complex.name}
              >
                <Image
                  src={complex.photos[0].src}
                  alt={t(complex.photos[0].alt)}
                  fill
                  sizes="(max-width: 899px) 100vw, 620px"
                  priority={i === 0}
                />
                <span className={`badge ${styles.stage}`}>{t(STAGE_LABEL[complex.stage])}</span>
              </Link>

              <div className={styles.body}>
                <p className="kicker">{t(SECTOR_LABEL[complex.sector])}</p>
                <h2 className={styles.name}>
                  <Link href={`/complexe/${complex.slug}`}>{complex.name}</Link>
                </h2>
                <p className={styles.street}>
                  {formatStreet(complex.street, lang)} · {complex.developer}
                </p>

                <p className={styles.text}>{t(complex.description)}</p>

                <dl className={styles.facts}>
                  <div className={styles.fact}>
                    <dt>{t(C.fromSqm)}</dt>
                    <dd className="num">{formatPricePerSqm(complex.priceFromPerSqm, lang)}</dd>
                  </div>
                  <div className={styles.fact}>
                    <dt>{t(C.blocks)}</dt>
                    <dd className="num">{complex.blocks}</dd>
                  </div>
                  <div className={styles.fact}>
                    <dt>{t(C.floors)}</dt>
                    <dd className="num">{complex.floors}</dd>
                  </div>
                  <div className={styles.fact}>
                    <dt>{t(C.ceiling)}</dt>
                    <dd className="num">
                      {(complex.ceilingHeight / 100).toFixed(2).replace(".", ",")}{" "}
                      {lang === "ru" ? "м" : "m"}
                    </dd>
                  </div>
                </dl>

                {offers > 0 ? (
                  <p className={styles.offers}>
                    <span className={`num ${styles.offersCount}`}>
                      {formatCount(offers, t(UI.propertiesOne), t(UI.properties), lang)}
                    </span>
                    <span className={styles.offersDeals}>
                      {deals.map((d) => t(DEAL_NOTE[d])).join(" · ")}
                    </span>
                    {fromPrice !== null && (
                      <span className={`num ${styles.offersFrom}`}>
                        {t(C.from)} {formatPrice(fromPrice)}
                      </span>
                    )}
                  </p>
                ) : (
                  <p className={styles.offers}>{t(C.noOffers)}</p>
                )}

                <div className={styles.actions}>
                  <Link href={`/complexe/${complex.slug}`} className="btn">
                    {t(C.open)}
                  </Link>
                  <Link href={`/proprietati?complex=${complex.slug}`} className="link">
                    {t(C.offersLink)} →
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <section className={styles.helpSection}>
        <div className={`wrap ${styles.helpInner}`}>
          <div className="rv">
            <p className="kicker kicker-dark">{t(C.kicker)}</p>
            <h2 className={styles.helpTitle}>{t(C.helpTitle)}</h2>
          </div>
          <div className={`${styles.helpBody} rv`}>
            <p className={styles.helpText}>{t(C.helpText)}</p>
            <div className={styles.helpActions}>
              <a href={AGENCY.mobileHref} className="btn-line btn-line-dark">
                {t(C.helpCall)}
              </a>
              <Link href="/proprietati?fond=bloc-nou" className={styles.helpAll}>
                {t(C.helpAll)} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
