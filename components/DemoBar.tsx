"use client";

import { useLang } from "@/lib/lang";
import styles from "./DemoBar.module.css";

/** ARCA is a portfolio piece for an agency that does not exist. The listings,
 *  the prices, the agents and their phone numbers are all invented, so the
 *  notice sits at the very top of every page rather than in the footer —
 *  fixed, unclosable, in both languages. A staging strip, not an ad banner. */
export default function DemoBar() {
  const { t } = useLang();

  return (
    <div className={styles.bar} role="note">
      <p className={styles.text}>
        <b>{t({ ro: "CONCEPT / DEMO NARON WEB", ru: "КОНЦЕПТ / ДЕМО NARON WEB" })}</b>
        <span className={styles.dash}>—</span>
        {t({
          ro: "toate datele, cifrele, recenziile și informațiile din această interfață sunt fictive și au scop demonstrativ.",
          ru: "все данные, цифры, отзывы и сведения в этом интерфейсе вымышлены и носят демонстрационный характер.",
        })}
      </p>
    </div>
  );
}

/** Sits inside every form on the site. A tag is not enough here: someone is
 *  about to type their real phone number in, so it says it in a sentence. */
export function DemoFormNote({ dark }: { dark?: boolean }) {
  const { t } = useLang();
  return (
    <p className={styles.formNote} data-dark={dark || undefined}>
      {t({
        ro: "Formular demonstrativ — nu ajunge la nicio agenție și nimeni nu vă va contacta.",
        ru: "Демонстрационная форма — она никуда не отправляется, и с вами никто не свяжется.",
      })}
    </p>
  );
}

/** The small tag that sits next to a number nobody should believe.
 *  `block` puts it on its own line; `dark` flips it for the cobalt bands. */
export function Fake({ block, dark }: { block?: boolean; dark?: boolean }) {
  const { t } = useLang();
  return (
    <span
      className={`${styles.fake} ${styles.fake}`}
      data-block={block || undefined}
      data-dark={dark || undefined}
    >
      {t({ ro: "date fictive", ru: "вымышленные данные" })}
    </span>
  );
}
