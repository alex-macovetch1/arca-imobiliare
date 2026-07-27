"use client";

import Image from "next/image";
import { AGENCY } from "@/lib/content";
import { useLang } from "@/lib/lang";
import styles from "./OfficeMap.module.css";

/**
 * The office on the stylised city plan. A static image rather than an embedded
 * map: it costs nothing to load, keeps the palette, and the click still opens
 * the real map where a visitor can get directions.
 */
export default function OfficeMap({ ratio = "wide" }: { ratio?: "wide" | "tall" }) {
  const { t } = useLang();
  const href = `https://www.google.com/maps/search/?api=1&query=${AGENCY.coords.lat},${AGENCY.coords.lng}`;

  return (
    <a
      className={`rvimg ${styles.map} ${ratio === "tall" ? styles.tall : ""}`}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <Image
        src="/harti/chisinau.jpg"
        alt={t({
          ro: `Harta Chișinăului cu biroul ARCA, ${AGENCY.address.ro}`,
          ru: `Карта Кишинёва с офисом ARCA, ${AGENCY.address.ru}`,
        })}
        fill
        sizes="(max-width:1099px) 100vw, 1170px"
        className={styles.image}
      />

      <span className={styles.marker} aria-hidden="true" />

      <span className={styles.plate}>
        <span className={styles.plateAddress}>{t(AGENCY.address)}</span>
        <span className={styles.plateAction}>
          {t({ ro: "Deschide în Google Maps", ru: "Открыть в Google Maps" })}
        </span>
      </span>
    </a>
  );
}
