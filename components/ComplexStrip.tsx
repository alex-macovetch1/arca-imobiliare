"use client";

import Image from "next/image";
import Link from "next/link";
import { SECTOR_LABEL, STAGE_LABEL, UI } from "@/lib/content";
import { formatCount, formatPricePerSqm } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { Complex, T } from "@/lib/types";
import styles from "./ComplexStrip.module.css";

export interface ComplexItem {
  complex: Complex;
  offers: number;
}

const S = {
  kicker: { ro: "Ansambluri rezidențiale", ru: "Жилые комплексы" },
  title: { ro: "Blocuri noi în care avem apartamente", ru: "Новостройки, где у нас есть квартиры" },
  all: { ro: "Vezi toate ansamblurile →", ru: "Смотреть все комплексы →" },
  from: { ro: "de la", ru: "от" },
} satisfies Record<string, T>;

/** The homepage strip: four complexes, photograph first, on one horizontal row. */
export default function ComplexStrip({ items }: { items: ComplexItem[] }) {
  const { t, lang } = useLang();
  if (items.length === 0) return null;

  return (
    <section className="wrap sec">
      <div className={`${styles.head} rv`}>
        <div>
          <p className="kicker">{t(S.kicker)}</p>
          <h2 className={styles.title}>{t(S.title)}</h2>
        </div>
        <Link href="/complexe" className={styles.all}>
          {t(S.all)}
        </Link>
      </div>

      <ul className={styles.row}>
        {items.map(({ complex, offers }, i) => (
          <li
            key={complex.slug}
            className={`${styles.item} rv`}
            style={{ "--d": `${Math.min(i, 5) * 60}ms` } as React.CSSProperties}
          >
            <Link href={`/complexe/${complex.slug}`} className={styles.link}>
              <span className={`ph ${styles.photo} rvimg`}>
                <Image
                  src={complex.photos[0].src}
                  alt={t(complex.photos[0].alt)}
                  fill
                  sizes="(max-width: 699px) 78vw, (max-width: 1099px) 45vw, 270px"
                />
                <span className={`badge ${styles.stage}`}>{t(STAGE_LABEL[complex.stage])}</span>
              </span>

              <span className={styles.body}>
                <span className={styles.sector}>{t(SECTOR_LABEL[complex.sector])}</span>
                <span className={styles.name}>{complex.name}</span>
                <span className={`spec ${styles.meta}`}>{complex.developer}</span>
                <span className={styles.foot}>
                  <span className={`num ${styles.price}`}>
                    {t(S.from)} {formatPricePerSqm(complex.priceFromPerSqm, lang)}
                  </span>
                  <span className={`num ${styles.offers}`}>
                    {formatCount(offers, t(UI.propertiesOne), t(UI.properties), lang)}
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
