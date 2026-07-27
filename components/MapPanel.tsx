"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SECTOR_LABEL, UI } from "@/lib/content";
import { formatArea, formatDealPrice, formatRooms } from "@/lib/format";
import { useLang } from "@/lib/lang";
import { SECTORS } from "@/lib/sectors";
import type { Property } from "@/lib/types";
import { IconClose } from "./Icons";
import styles from "./MapPanel.module.css";

type Props = { items: Property[] };

const COPY = {
  note: {
    ro: "Pozițiile sunt aproximative, pe o schemă a orașului. Adresa exactă este pe pagina anunțului.",
    ru: "Позиции приблизительные, на схеме города. Точный адрес — на странице объявления.",
  },
  open: { ro: "Vezi anunțul", ru: "Открыть объявление" },
  pick: { ro: "Alege o proprietate de pe hartă", ru: "Выберите объект на карте" },
};

/**
 * The frame is fixed, not measured from the list on screen: a marker has to
 * stay where the visitor last saw it when a filter drops half the results.
 * These bounds cover Chisinau and the suburbs the agency sells in, with room
 * to breathe around the outermost address.
 */
const FRAME = {
  minLat: 46.9673,
  maxLat: 47.0962,
  minLng: 28.7419,
  maxLng: 28.9292,
};

function place(coords: { lat: number; lng: number }) {
  const x = ((coords.lng - FRAME.minLng) / (FRAME.maxLng - FRAME.minLng)) * 100;
  const y = (1 - (coords.lat - FRAME.minLat) / (FRAME.maxLat - FRAME.minLat)) * 100;
  return { left: `${clamp(x)}%`, top: `${clamp(y)}%` };
}

function clamp(v: number): number {
  return Math.min(97, Math.max(3, Math.round(v * 100) / 100));
}

export default function MapPanel({ items }: Props) {
  const { t, lang } = useLang();
  const [openId, setOpenId] = useState<string | null>(null);

  const selected = items.find((p) => p.id === openId) ?? null;

  // A marker that gets filtered away must not leave its card hanging.
  useEffect(() => {
    if (openId && !items.some((p) => p.id === openId)) setOpenId(null);
  }, [items, openId]);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId]);

  return (
    <div className={styles.wrap}>
      <div className={styles.map}>
        <Image
          src="/harti/chisinau.jpg"
          alt=""
          fill
          sizes="(max-width: 700px) 100vw, 1170px"
          priority
          className={styles.plan}
        />

        {SECTORS.filter((s) => items.some((p) => p.sector === s.slug)).map((s) => (
          <span key={s.slug} className={styles.sector} style={place(s.coords)}>
            {t(SECTOR_LABEL[s.slug])}
          </span>
        ))}

        {items.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`${styles.pin} ${openId === p.id ? styles.pinOn : ""}`}
            style={place(p.coords)}
            onClick={() => setOpenId(openId === p.id ? null : p.id)}
            aria-label={`${t(p.title)} — ${formatDealPrice(p, lang)}`}
          >
            <span className={styles.dot} />
          </button>
        ))}

        {selected ? (
          <div className={styles.card}>
            <div className={`ph ${styles.cardPhoto}`}>
              <Image
                src={selected.photos[0].src}
                alt={t(selected.photos[0].alt)}
                fill
                sizes="120px"
              />
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardPrice}>{formatDealPrice(selected, lang)}</p>
              <p className={styles.cardTitle}>
                <Link href={`/proprietati/${selected.slug}`}>{t(selected.title)}</Link>
              </p>
              <p className={styles.cardSpecs}>
                {selected.rooms > 0 && <>{formatRooms(selected.rooms, lang)} · </>}
                {formatArea(selected.area, lang)}
              </p>
              <Link href={`/proprietati/${selected.slug}`} className="link">
                {t(COPY.open)}
              </Link>
            </div>
            <button
              type="button"
              className={styles.cardClose}
              onClick={() => setOpenId(null)}
              aria-label={t(UI.close)}
            >
              <IconClose size={18} />
            </button>
          </div>
        ) : (
          <p className={styles.hint}>{t(COPY.pick)}</p>
        )}
      </div>

      <p className={`legal ${styles.note}`}>{t(COPY.note)}</p>
    </div>
  );
}
