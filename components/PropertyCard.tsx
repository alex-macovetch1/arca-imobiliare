"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
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
import { IconChevron, IconHeart } from "./Icons";
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

/** Five is the most a 358px card can hold without the row reading as a ruler. */
const DOTS = 5;

const SAVE_LABEL = { ro: "Salvează proprietatea", ru: "Сохранить объект" };
const UNSAVE_LABEL = { ro: "Scoate din salvate", ru: "Убрать из сохранённых" };
const PHOTOS_LABEL = { ro: "fotografii", ru: "фотографий" };
const PREV_LABEL = { ro: "Fotografia anterioară", ru: "Предыдущее фото" };
const NEXT_LABEL = { ro: "Fotografia următoare", ru: "Следующее фото" };

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
  const [shot, setShot] = useState(0);
  // The rest of the gallery is only fetched once the visitor shows intent.
  // Twenty cards times eight photographs would otherwise land on first paint.
  const [armed, setArmed] = useState(false);
  const track = useRef<HTMLDivElement>(null);

  const shots = p.photos;
  const many = shots.length > 1;
  const href = `/proprietati/${p.slug}`;

  const arm = useCallback(() => setArmed(true), []);

  const step = (dir: 1 | -1) => (e: React.MouseEvent) => {
    // The arrows sit inside a card that is one big link; without this a click
    // on the chevron would open the listing instead of turning the photo.
    e.preventDefault();
    e.stopPropagation();
    setArmed(true);
    const next = (shot + dir + shots.length) % shots.length;
    setShot(next);
    const el = track.current;
    // Only true on the touch layout, where the frame is a real scroller.
    if (el && el.scrollWidth > el.clientWidth) el.scrollTo({ left: next * el.clientWidth });
  };

  const onScroll = () => {
    const el = track.current;
    if (!el || el.clientWidth === 0) return;
    const at = Math.round(el.scrollLeft / el.clientWidth);
    if (at >= 0 && at < shots.length) setShot((cur) => (at === cur ? cur : at));
  };

  const first = shots.length <= DOTS ? 0 : Math.min(Math.max(shot - 2, 0), shots.length - DOTS);
  const visibleDots = Math.min(shots.length, DOTS);

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
    // The reveal sits on a wrapper: one element cannot carry the entrance and
    // the gallery on the same property.
    <div
      className={`${styles.reveal} rv`}
      style={delay ? ({ "--d": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      <article className={`${styles.card} ${layout === "list" ? styles.horizontal : ""}`}>
        <div
          className={`${styles.frame} rvimg`}
          // The half of the route transition that lives on this side: the frame
          // is what grows into the photograph at the top of the listing. Its
          // twin is on the gallery, keyed by the same slug.
          data-vt={p.slug}
          onPointerEnter={arm}
          onTouchStart={arm}
          onFocus={arm}
        >
          <div ref={track} className={styles.shots} onScroll={many ? onScroll : undefined}>
            {shots.map((photo, i) => (
              <div
                key={photo.src}
                className={styles.slide}
                data-on={i === shot ? "1" : undefined}
              >
                {(armed || i === 0) && (
                  <Image
                    src={photo.src}
                    // Only the opening photograph carries the description: eight
                    // alt strings per card would flood a screen reader.
                    alt={i === 0 ? t(photo.alt) : ""}
                    fill
                    sizes={sizes ?? (layout === "list" ? LIST_SIZES : GRID_SIZES)}
                    priority={priority && i === 0}
                    className={styles.img}
                  />
                )}
                {/* A link per photograph, so a tap opens the listing while a
                    swipe stays inside the frame and moves the gallery. */}
                <Link href={href} className={styles.shotLink} aria-hidden="true" tabIndex={-1} />
              </div>
            ))}
          </div>

          {badges.length > 0 && (
            <div className={styles.badges}>
              {badges.map((flag) => (
                <span key={flag} className={`badge ${flag === "pret-redus" ? "badge-clay" : ""}`}>
                  {t(FLAG_LABEL[flag])}
                </span>
              ))}
            </div>
          )}

          <span className={styles.counter}>
            <span className="num">
              {shot + 1}/{shots.length}
            </span>
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

          {many && (
            <div className={styles.controls}>
              <button
                type="button"
                className={`${styles.arrow} ${styles.prev}`}
                onClick={step(-1)}
                aria-label={t(PREV_LABEL)}
              >
                <IconChevron size={16} />
              </button>
              <button
                type="button"
                className={`${styles.arrow} ${styles.next}`}
                onClick={step(1)}
                aria-label={t(NEXT_LABEL)}
              >
                <IconChevron size={16} />
              </button>
              <span className={styles.dots} aria-hidden="true">
                {Array.from({ length: visibleDots }, (_, k) => {
                  const at = first + k;
                  const edge =
                    (k === 0 && first > 0) || (k === visibleDots - 1 && at < shots.length - 1);
                  return (
                    <span
                      key={at}
                      className={`${styles.dot} ${edge ? styles.dotEdge : ""}`}
                      data-on={at === shot ? "1" : undefined}
                    />
                  );
                })}
              </span>
            </div>
          )}
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
            <Link href={href} className={styles.link}>
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
