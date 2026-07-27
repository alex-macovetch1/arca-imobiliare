"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ComponentType, CSSProperties } from "react";
import { AGENCY, UI } from "@/lib/content";
import { useLang } from "@/lib/lang";
import type { T } from "@/lib/types";
import {
  IconChat,
  IconClose,
  IconPhone,
  IconTelegram,
  IconViber,
  IconWhatsapp,
} from "./Icons";
import styles from "./ContactRail.module.css";

type Channel = {
  key: string;
  href: string;
  label: T;
  Icon: ComponentType<{ size?: number }>;
  /** Opens a site rather than an app or the dialer. */
  out?: boolean;
};

/* Top to bottom on screen. The stagger runs the other way — the pill nearest
   the button arrives first. */
const CHANNELS: Channel[] = [
  { key: "viber", href: AGENCY.viber, label: { ro: "Viber", ru: "Viber" }, Icon: IconViber },
  { key: "telegram", href: AGENCY.telegram, label: { ro: "Telegram", ru: "Telegram" }, Icon: IconTelegram, out: true },
  { key: "whatsapp", href: AGENCY.whatsapp, label: { ro: "WhatsApp", ru: "WhatsApp" }, Icon: IconWhatsapp, out: true },
  { key: "call", href: AGENCY.mobileHref, label: UI.callNow, Icon: IconPhone },
];

const PANEL_ID = "arca-channels";
const OPEN_LABEL = { ro: "Scrie-ne sau sună-ne", ru: "Напишите или позвоните нам" };
const SHUT_LABEL = { ro: "Închide contactele", ru: "Закрыть контакты" };

/**
 * One round button, bottom right. Pressing it (or, with a mouse, resting on it)
 * lifts the channels out above it. The outer column is deliberately
 * pointer-transparent: it is tall and invisible, and would otherwise swallow
 * clicks meant for the page underneath.
 */
export default function ContactRail() {
  const { t } = useLang();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const rail = useRef<HTMLDivElement | null>(null);
  const toggle = useRef<HTMLButtonElement | null>(null);
  const timer = useRef(0);

  // Marks that the script is running. Until it is, the stylesheet alone opens
  // the panel on hover and on focus, so the numbers are never unreachable.
  useEffect(() => setReady(true), []);

  useEffect(() => setOpen(false), [path]);

  const hold = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = 0;
    }
  }, []);

  useEffect(() => () => hold(), [hold]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!rail.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div
      ref={rail}
      className={styles.rail}
      data-open={open ? "true" : "false"}
      data-js={ready ? "on" : undefined}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        hold();
        setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        hold();
        // A gap sits between the button and the pills; closing on the spot
        // would collapse the panel while the cursor crosses it.
        timer.current = window.setTimeout(() => setOpen(false), 180);
      }}
    >
      <button
        ref={toggle}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        aria-label={t(open ? SHUT_LABEL : OPEN_LABEL)}
        onClick={() => {
          hold();
          setOpen((v) => !v);
        }}
      >
        <span className={`${styles.face} ${styles.faceChat}`}>
          <IconChat size={24} />
        </span>
        <span className={`${styles.face} ${styles.faceShut}`}>
          <IconClose size={22} />
        </span>
      </button>

      <ul id={PANEL_ID} className={styles.list}>
        {CHANNELS.map((c, i) => (
          <li
            key={c.key}
            className={styles.row}
            style={{ "--i": CHANNELS.length - 1 - i } as CSSProperties}
          >
            <a
              className={styles.link}
              href={c.href}
              tabIndex={ready && !open ? -1 : undefined}
              onClick={() => setOpen(false)}
              {...(c.out ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className={styles.label}>{t(c.label)}</span>
              <span className={styles.puck}>
                <c.Icon size={20} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
