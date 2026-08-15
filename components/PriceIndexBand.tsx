"use client";

import Link from "next/link";
import { INDEX_DISCLAIMER, SECTOR_IN, UI } from "@/lib/content";
import { formatPricePerSqm } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { PricePosition } from "@/lib/market-index";
import type { Sector, T } from "@/lib/types";
import { Fake } from "./DemoBar";
import styles from "./PriceIndexBand.module.css";

const P = {
  thisOffer: { ro: "Oferta aceasta", ru: "Это предложение" },
  sectorBand: { ro: "Banda sectorului", ru: "Диапазон сектора" },
  median: { ro: "Mediana", ru: "Медиана" },
  seeIndex: { ro: "Vezi Indicele ARCA", ru: "Смотреть Индекс ARCA" },
  from: { ro: "din", ru: "из" },
} satisfies Record<string, T>;

/**
 * Where the asking price sits inside its own sector. Shown on the listing and
 * anywhere else a single price needs context — the figures come from
 * lib/market-index, never from a local calculation.
 */
export default function PriceIndexBand({
  position,
  sector,
}: {
  position: PricePosition;
  sector: Sector;
}) {
  const { t, lang } = useLang();
  const { band, value, tone, label } = position;

  /* The rail is drawn a quarter wider than the band on both sides, so an offer
     outside p25-p75 still lands on the scale instead of on its edge. */
  const pad = Math.max(1, (band.p75 - band.p25) * 0.6);
  const lo = band.p25 - pad;
  const hi = band.p75 + pad;
  const at = (n: number) => Math.min(100, Math.max(0, ((n - lo) / (hi - lo)) * 100));

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <p className="kicker">{t(UI.pricePosition)}</p>
        <p className={`${styles.verdict} ${styles[tone]}`}>{t(label)}</p>
      </div>

      <div className={styles.rail} aria-hidden="true">
        <span
          className={styles.band}
          style={{ left: `${at(band.p25)}%`, width: `${at(band.p75) - at(band.p25)}%` }}
        />
        <span className={styles.median} style={{ left: `${at(band.median)}%` }} />
        <span className={styles.marker} style={{ left: `${at(value)}%` }} />
      </div>

      <dl className={styles.legend}>
        <div className={styles.item}>
          <dt>{t(P.thisOffer)}</dt>
          <dd className={`num ${styles.strong}`}>{formatPricePerSqm(value, lang)}</dd>
        </div>
        <div className={styles.item}>
          <dt>{t(P.median)} {t(SECTOR_IN[sector])}</dt>
          <dd className="num">{formatPricePerSqm(band.median, lang)}</dd>
        </div>
        <div className={styles.item}>
          <dt>{t(P.sectorBand)}</dt>
          <dd className="num">
            {formatPricePerSqm(band.p25, lang)} – {formatPricePerSqm(band.p75, lang)}
          </dd>
        </div>
      </dl>

      <p className={`legal ${styles.note}`}>
        {t(INDEX_DISCLAIMER)} <Fake /></p>
      <Link href="/indice" className="link">
        {t(P.seeIndex)} →
      </Link>
    </div>
  );
}
