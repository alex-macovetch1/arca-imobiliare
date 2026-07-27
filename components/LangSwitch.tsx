"use client";

import { useLang } from "@/lib/lang";
import styles from "./LangSwitch.module.css";

const LANGS = ["ro", "ru"] as const;

/** RO | RU. A track with a pill that slides under whichever one is live. */
export default function LangSwitch({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang();

  return (
    <div
      className={`${styles.wrap} ${dark ? styles.dark : ""} ${lang === "ru" ? styles.second : ""}`}
    >
      <span className={styles.pill} aria-hidden="true" />
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          className={`${styles.btn} ${lang === code ? styles.on : ""}`}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          lang={code}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
