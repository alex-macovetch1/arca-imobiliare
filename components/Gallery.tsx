"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { UI } from "@/lib/content";
import { useLang } from "@/lib/lang";
import type { Photo, T } from "@/lib/types";
import { IconChevron, IconClose } from "./Icons";
import styles from "./Gallery.module.css";

const G = {
  open: { ro: "Deschide fotografiile", ru: "Открыть фотографии" },
  prev: { ro: "Fotografia anterioară", ru: "Предыдущая фотография" },
  next: { ro: "Fotografia următoare", ru: "Следующая фотография" },
  photo: { ro: "Fotografia", ru: "Фотография" },
} satisfies Record<string, T>;

export type GalleryBadge = { label: T; clay?: boolean };

type Props = {
  photos: Photo[];
  badges?: GalleryBadge[];
};

/**
 * One large frame plus a 2x2 block of thumbnails, and a full-screen viewer
 * driven by the arrow keys. No dependency: a gallery is four states and a
 * modulo.
 */
export default function Gallery({ photos, badges = [] }: Props) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const count = photos.length;
  const step = useCallback((d: number) => setI((p) => (p + d + count) % count), [count]);

  const openAt = (n: number) => {
    setI(n);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKey);
    // The page scrolling behind a full-screen viewer reads as broken.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, step]);

  // Keep the active thumbnail inside the strip when the arrows walk past it.
  useEffect(() => {
    if (!open) return;
    stripRef.current?.children[i]?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [i, open]);

  const cover = photos[0];
  const rest = photos.slice(1, 5);

  return (
    <>
      <div className={styles.mosaic}>
        <button
          type="button"
          className={styles.big}
          onClick={() => openAt(0)}
          aria-label={t(G.open)}
        >
          <Image
            src={cover.src}
            alt={t(cover.alt)}
            fill
            priority
            sizes="(max-width: 700px) 100vw, (max-width: 1099px) 62vw, 732px"
            className={styles.img}
          />
          {badges.length > 0 && (
            <span className={styles.badges}>
              {badges.slice(0, 2).map((b) => (
                <span key={b.label.ro} className={`badge ${b.clay ? "badge-clay" : ""}`}>
                  {t(b.label)}
                </span>
              ))}
            </span>
          )}
          <span className={`${styles.counter} num`}>1/{count}</span>
          <span className={styles.allMobile}>
            {t(UI.allPhotos)} ({count})
          </span>
        </button>

        <div className={styles.thumbs}>
          {rest.map((ph, k) => (
            <button
              type="button"
              key={k}
              className={styles.thumb}
              onClick={() => openAt(k + 1)}
              aria-label={`${t(G.photo)} ${k + 2}`}
            >
              <Image
                src={ph.src}
                alt={t(ph.alt)}
                fill
                sizes="(max-width: 1099px) 20vw, 205px"
                className={styles.img}
              />
              {k === rest.length - 1 && count > 5 && (
                <span className={styles.more}>
                  {t(UI.allPhotos)} ({count})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div className={styles.viewer} role="dialog" aria-modal="true" aria-label={t(UI.allPhotos)}>
          <div className={styles.bar}>
            <span className={`${styles.count} num`}>
              {i + 1} / {count}
            </span>
            <button
              type="button"
              ref={closeRef}
              className={styles.close}
              onClick={() => setOpen(false)}
              aria-label={t(UI.close)}
            >
              <IconClose />
            </button>
          </div>

          <div
            className={styles.stage}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowPrev}`}
              onClick={() => step(-1)}
              aria-label={t(G.prev)}
            >
              <IconChevron size={24} />
            </button>

            <div className={styles.frame}>
              <Image
                key={i}
                src={photos[i].src}
                alt={t(photos[i].alt)}
                fill
                sizes="100vw"
                className={styles.full}
              />
            </div>

            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowNext}`}
              onClick={() => step(1)}
              aria-label={t(G.next)}
            >
              <IconChevron size={24} />
            </button>
          </div>

          <p className={styles.caption}>{t(photos[i].alt)}</p>

          <div className={styles.strip} ref={stripRef}>
            {photos.map((ph, k) => (
              <button
                type="button"
                key={k}
                className={`${styles.stripItem} ${k === i ? styles.stripOn : ""}`}
                onClick={() => setI(k)}
                aria-label={`${t(G.photo)} ${k + 1}`}
                aria-current={k === i}
              >
                <Image src={ph.src} alt="" fill sizes="96px" className={styles.img} />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
