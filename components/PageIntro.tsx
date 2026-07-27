"use client";

import { useLang } from "@/lib/lang";
import type { T } from "@/lib/types";
import styles from "./PageIntro.module.css";

interface Props {
  kicker: T;
  title: T;
  lead?: T;
  /** The counter line under the lead: "4 agenți · 24 de proprietăți". */
  meta?: T;
  children?: React.ReactNode;
}

/** The head every secondary page opens with, so four pages share one rhythm. */
export default function PageIntro({ kicker, title, lead, meta, children }: Props) {
  const { t } = useLang();

  return (
    <header className={`wrap ${styles.head}`}>
      <p className="kicker rv">{t(kicker)}</p>
      <h1 className={`rv ${styles.title}`} style={{ "--d": "60ms" } as React.CSSProperties}>
        {t(title)}
      </h1>
      {lead && (
        <p className={`lead rv ${styles.lead}`} style={{ "--d": "120ms" } as React.CSSProperties}>
          {t(lead)}
        </p>
      )}
      {meta && (
        <p className={`spec num rv ${styles.meta}`} style={{ "--d": "180ms" } as React.CSSProperties}>
          {t(meta)}
        </p>
      )}
      {children}
    </header>
  );
}
