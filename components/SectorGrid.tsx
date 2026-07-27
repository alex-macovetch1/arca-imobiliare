"use client";

import Image from "next/image";
import Link from "next/link";
import { UI } from "@/lib/content";
import { formatCount, formatPricePerSqm } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { Sector, T } from "@/lib/types";
import styles from "./SectorGrid.module.css";

export type SectorTile = {
  slug: Sector;
  name: T;
  image: string;
  count: number;
  /** Median EUR/m² of the sector; omitted when the sample is too thin to quote. */
  median?: number;
};

const WIDE_SIZES = "(max-width: 700px) 80vw, (max-width: 1099px) 100vw, 600px";
const SMALL_SIZES = "(max-width: 700px) 80vw, (max-width: 1099px) 50vw, 300px";

/**
 * Six tiles, one photograph each — most searches in Chisinau start with a
 * sector and not with a filter panel. The two sectors carrying the most offers
 * are laid out twice as wide and open the two rows from opposite ends, so the
 * block reads as a spread rather than as a wall of identical squares.
 */
export default function SectorGrid({ tiles }: { tiles: SectorTile[] }) {
  const { t, lang } = useLang();

  const ranked = [...tiles].sort((a, b) => b.count - a.count);
  const wide = new Set(ranked.slice(0, 2).map((s) => s.slug));
  const rest = tiles.filter((s) => !wide.has(s.slug));
  // First wide tile opens the grid, the second closes it; the rest keep the
  // order they arrived in.
  const ordered = ranked.length >= 2 ? [ranked[0], ...rest, ranked[1]] : tiles;

  return (
    <section className="wrap sec">
      <div className="rv">
        <p className="kicker">{t({ ro: "Caută pe sector", ru: "Поиск по секторам" })}</p>
        <h2 className={styles.title}>
          {t({ ro: "Sectoarele Chișinăului", ru: "Секторы Кишинёва" })}
        </h2>
      </div>

      <div className={styles.grid}>
        {ordered.map((s, i) => {
          const big = wide.has(s.slug);
          return (
            <Link
              key={s.slug}
              href={`/proprietati?sector=${s.slug}`}
              className={`${styles.tile} ${big ? styles.wide : ""} rvimg`}
              style={{ "--d": `${Math.min(i, 5) * 60}ms` } as React.CSSProperties}
            >
              {/* Photo and scrim share one wrapper so the reveal fades them as a
                  single layer and the hover state keeps the scrim to itself. */}
              <span className={styles.media}>
                <Image
                  src={s.image}
                  alt={t({
                    ro: `Sectorul ${s.name.ro} din Chișinău`,
                    ru: `Сектор ${s.name.ru} в Кишинёве`,
                  })}
                  fill
                  sizes={big ? WIDE_SIZES : SMALL_SIZES}
                  className={styles.img}
                />
                <span className={styles.scrim} aria-hidden="true" />
              </span>
              <span className={styles.body}>
                <span className={styles.name}>
                  {t(s.name)}
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </span>
                <span className={styles.meta}>
                  <span className={styles.count}>
                    {formatCount(s.count, t(UI.propertiesOne), t(UI.properties), lang)}
                  </span>
                  {s.median ? (
                    <span className={styles.median}>{formatPricePerSqm(s.median, lang)}</span>
                  ) : null}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
