"use client";

import { useLang } from "@/lib/lang";
import styles from "./LangSwitch.module.css";

/** RO | RU. Two text buttons, the active one underlined with a brass hairline. */
export default function LangSwitch({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang();

  return (
    <div className={`${styles.wrap} ${dark ? styles.dark : ""}`}>
      <button
        type="button"
        className={`${styles.btn} ${lang === "ro" ? styles.on : ""}`}
        onClick={() => setLang("ro")}
        aria-pressed={lang === "ro"}
        lang="ro"
      >
        RO
      </button>
      <span className={styles.sep} aria-hidden="true" />
      <button
        type="button"
        className={`${styles.btn} ${lang === "ru" ? styles.on : ""}`}
        onClick={() => setLang("ru")}
        aria-pressed={lang === "ru"}
        lang="ru"
      >
        RU
      </button>
    </div>
  );
}
