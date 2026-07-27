"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FLAG_LABEL, UI } from "@/lib/content";
import {
  formatArea,
  formatDealPrice,
  formatFloorShort,
  formatLand,
  formatPrice,
  formatPricePerSqm,
  formatRooms,
} from "@/lib/format";
import { toggleFavorite, useIsFavorite } from "@/lib/favorites";
import { useLang } from "@/lib/lang";
import type { Property } from "@/lib/types";
import { IconHeart } from "./Icons";
import styles from "./PropertyCard.module.css";

type Props = {
  property: Property;
  /** "list" turns the card horizontal and adds the first lines of the description. */
  layout?: "grid" | "list";
  sizes?: string;
  priority?: boolean;
  /** Stagger for the reveal, in milliseconds. */
  delay?: number;
};

const GRID_SIZES = "(max-width: 700px) 100vw, (max-width: 1099px) 50vw, 358px";
const LIST_SIZES = "(max-width: 700px) 100vw, 340px";

const SAVE_LABEL = { ro: "Salvează proprietatea", ru: "Сохранить объект" };
const UNSAVE_LABEL = { ro: "Scoate din salvate", ru: "Убрать из сохранённых" };
const PHOTOS_LABEL = { ro: "fotografii", ru: "фотографий" };

export default function PropertyCard({
  property: p,
  layout = "grid",
  sizes,
  priority = false,
  delay = 0,
}: Props) {
  const { t, lang } = useLang();
  const saved = useIsFavorite(p.id);
  // Counts taps rather than storing a boolean: remounting the disc on a new key
  // is what replays the pulse when the same heart is pressed twice.
  const [taps, setTaps] = useState(0);
  const photo = p.photos[0];

  const specs: string[] = [];
  if (p.kind === "apartament" || p.kind === "casa") specs.push(formatRooms(p.rooms, lang));
  if (p.kind === "teren") {
    if (p.landArea) specs.push(formatLand(p.landArea, lang));
  } else {
    specs.push(formatArea(p.area, lang));
  }
  if (p.kind === "casa" && p.landArea) specs.push(formatLand(p.landArea, lang));
  if (p.kind !== "casa" && p.kind !== "teren") specs.push(formatFloorShort(p.floor, p.floors, lang));
  if (p.kind !== "teren") specs.push(String(p.year));

  const badges = p.flags.slice(0, 2);
  const cut = p.flags.includes("pret-redus") && p.previousPrice ? p.previousPrice : null;
  const intro = t(p.description).split("\n\n")[0];

  return (
    // The reveal sits on a wrapper: one element cannot carry the 700ms entrance
    // and the 340ms hover lift on the same property.
    <div
      className={`${styles.reveal} rv`}
      style={delay ? ({ "--d": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      <article className={`${styles.card} ${layout === "list" ? styles.horizontal : ""}`}>
        <div className={`${styles.frame} rvimg`}>
          <Image
            src={photo.src}
            alt={t(photo.alt)}
            fill
            sizes={sizes ?? (layout === "list" ? LIST_SIZES : GRID_SIZES)}
            priority={priority}
            className={styles.img}
          />

          {badges.length > 0 && (
            <div className={styles.badges}>
              {badges.map((flag) => (
                <span
                  key={flag}
                  className={`badge ${flag === "pret-redus" ? styles.badgeCut : ""}`}
                >
                  {t(FLAG_LABEL[flag])}
                </span>
              ))}
            </div>
          )}

          <span className={styles.counter}>
            <span className="num">1/{p.photos.length}</span>
            <span className={styles.srOnly}> {t(PHOTOS_LABEL)}</span>
          </span>

          <button
            type="button"
            className={styles.heart}
            onClick={() => {
              toggleFavorite(p.id);
              setTaps((n) => n + 1);
            }}
            aria-pressed={saved}
            aria-label={t(saved ? UNSAVE_LABEL : SAVE_LABEL)}
          >
            <span
              key={taps}
              className={`${styles.disc} ${taps ? styles.pulse : ""}`}
              aria-hidden="true"
            />
            <IconHeart size={17} filled={saved} />
          </button>
        </div>

        <div className={styles.body}>
          {/* The price leads: it is the first thing a buyer reads after the photo. */}
          <div className={styles.priceRow}>
            <p className={styles.price}>
              {formatDealPrice(p, lang)}
              {cut && <span className={styles.cut}>{formatPrice(cut)}</span>}
            </p>
            {p.deal === "vanzare" && p.pricePerSqm > 0 && (
              <p className={styles.sqm}>{formatPricePerSqm(p.pricePerSqm, lang)}</p>
            )}
            {p.deal === "chirie" && (
              <p className={styles.sqm}>
                {t(UI.code)} {p.id}
              </p>
            )}
          </div>

          <h3 className={styles.title}>
            <Link href={`/proprietati/${p.slug}`} className={styles.link}>
              <span className="clamp-2">{t(p.title)}</span>
            </Link>
          </h3>

          <ul className={styles.specs}>
            {specs.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          {layout === "list" && <p className={styles.intro}>{intro}</p>}
        </div>
      </article>
    </div>
  );
}
