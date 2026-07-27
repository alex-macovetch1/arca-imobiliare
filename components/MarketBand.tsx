"use client";

import Link from "next/link";
import { INDEX_DISCLAIMER, SECTOR_LABEL, UI } from "@/lib/content";
import { formatDate, formatPricePerSqm } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { PriceBand } from "@/lib/market-index";
import type { Sector, T } from "@/lib/types";
import styles from "./MarketBand.module.css";

export interface MarketTile {
  sector: Sector;
  median: number;
  offers: number;
}

const M = {
  kicker: { ro: "Indicele ARCA", ru: "Индекс ARCA" },
  title: {
    ro: "Cât cere piața pe metru pătrat, astăzi",
    ru: "Сколько рынок просит за квадратный метр сегодня",
  },
  lead: {
    ro: "Publicăm medianele cu care lucrăm noi, nu media pe care o citează toată lumea. Se recalculează la fiecare ofertă nouă intrată în portofoliu.",
    ru: "Мы публикуем медианы, с которыми работаем сами, а не среднее, которое цитируют все. Они пересчитываются с каждым новым объектом портфеля.",
  },
  city: { ro: "Media pe Chișinău", ru: "В среднем по Кишинёву" },
  all: { ro: "Vezi indicele complet", ru: "Смотреть полный индекс" },
  updated: { ro: "Actualizat", ru: "Обновлено" },
} satisfies Record<string, T>;

/**
 * The accent band on the homepage: six sectors and the city median, straight
 * from lib/market-index. The figures here and on /indice come from the same
 * function, so the homepage can never quote a number the index page denies.
 */
export default function MarketBand({
  tiles,
  city,
  updated,
}: {
  tiles: MarketTile[];
  city: PriceBand;
  updated: string;
}) {
  const { t, lang } = useLang();

  return (
    <section className={styles.band}>
      <div className={`wrap ${styles.inner}`}>
        <div className={`${styles.head} rv`}>
          <div>
            <p className="kicker kicker-dark">{t(M.kicker)}</p>
            <h2 className={styles.title}>{t(M.title)}</h2>
            <p className={styles.lead}>{t(M.lead)}</p>
          </div>

          <div className={styles.city}>
            <p className={styles.cityLabel}>{t(M.city)}</p>
            <p className={`num ${styles.cityFigure}`}>{formatPricePerSqm(city.median, lang)}</p>
            <p className={`num ${styles.cityRange}`}>
              {formatPricePerSqm(city.p25, lang)} – {formatPricePerSqm(city.p75, lang)}
            </p>
          </div>
        </div>

        <ul className={styles.tiles}>
          {tiles.map((tile, i) => (
            <li
              key={tile.sector}
              className={`${styles.tile} rv`}
              style={{ "--d": `${Math.min(i, 5) * 60}ms` } as React.CSSProperties}
            >
              <Link href={`/proprietati?sector=${tile.sector}`} className={styles.tileLink}>
                <span className={styles.tileName}>{t(SECTOR_LABEL[tile.sector])}</span>
                <span className={`num ${styles.tileFigure}`}>
                  {formatPricePerSqm(tile.median, lang)}
                </span>
                <span className={`num ${styles.tileCount}`}>
                  {tile.offers} {t(UI.offers)}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className={`${styles.foot} rv`}>
          <p className={styles.disclaimer}>{t(INDEX_DISCLAIMER)}</p>
          <div className={styles.footSide}>
            <p className={`num ${styles.updated}`}>
              {t(M.updated)} {formatDate(updated, lang)}
            </p>
            <Link href="/indice" className={`btn-line btn-line-dark ${styles.cta}`}>
              {t(M.all)}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
