"use client";

import Image from "next/image";
import Link from "next/link";
import { UI } from "@/lib/content";
import { formatCount } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { Sector, T } from "@/lib/types";
import styles from "./SectorGrid.module.css";

export type SectorTile = {
  slug: Sector;
  name: T;
  image: string;
  count: number;
};

/** Six tiles, one photograph each. Most searches in Chisinau start here and
 *  not in a filter panel, so the sector is a picture, not a dropdown row. */
export default function SectorGrid({ tiles }: { tiles: SectorTile[] }) {
  const { t, lang } = useLang();

  return (
    <section className="wrap sec">
      <div className="rv">
        <p className="kicker">{t({ ro: "Caută pe sector", ru: "Поиск по секторам" })}</p>
        <h2 className={styles.title}>
          {t({ ro: "Sectoarele Chișinăului", ru: "Секторы Кишинёва" })}
        </h2>
      </div>

      <div className={styles.grid}>
        {tiles.map((s, i) => (
          <Link
            key={s.slug}
            href={`/proprietati?sector=${s.slug}`}
            className={`${styles.tile} rvimg`}
            style={{ "--d": `${(i % 3) * 90}ms` } as React.CSSProperties}
          >
            <div className="ph">
              <Image
                src={s.image}
                alt={t({
                  ro: `Sectorul ${s.name.ro} din Chișinău`,
                  ru: `Сектор ${s.name.ru} в Кишинёве`,
                })}
                fill
                sizes="(max-width: 1099px) 50vw, 358px"
              />
              <span className={styles.scrim} aria-hidden="true" />
              <span className={styles.body}>
                <span className={styles.name}>{t(s.name)}</span>
                <span className={styles.count}>
                  {formatCount(s.count, t(UI.propertiesOne), t(UI.properties), lang)}
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
