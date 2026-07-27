"use client";

import { AGENCY } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { IconTelegram, IconViber, IconWhatsapp } from "./Icons";
import styles from "./ContactRail.module.css";

/** Floating stack on the right edge. Desktop only — on a phone it would sit
 *  on top of the content it is supposed to support. */
export default function ContactRail() {
  const { t } = useLang();

  return (
    <div className={styles.rail} aria-label={t({ ro: "Scrie-ne", ru: "Напишите нам" })}>
      <a className={styles.btn} href={AGENCY.viber} aria-label="Viber">
        <IconViber />
      </a>
      <a className={styles.btn} href={AGENCY.telegram} aria-label="Telegram">
        <IconTelegram />
      </a>
      <a className={styles.btn} href={AGENCY.whatsapp} aria-label="WhatsApp">
        <IconWhatsapp />
      </a>
    </div>
  );
}
