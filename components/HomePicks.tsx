"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang";
import type { T } from "@/lib/types";
import styles from "./HomePicks.module.css";

type Props = {
  kicker: T;
  title: T;
  note?: T;
  href: string;
  linkLabel: T;
  children: React.ReactNode;
};

/**
 * The shell both card sections on the homepage share. The cards themselves are
 * passed in as children, so this component never has to know what a property
 * looks like — and the listing card stays server-rendered.
 */
export default function HomePicks({ kicker, title, note, href, linkLabel, children }: Props) {
  const { t } = useLang();

  return (
    <section className="wrap sec">
      <div className={`${styles.head} rv`}>
        <div>
          <p className="kicker">{t(kicker)}</p>
          <h2 className={styles.title}>{t(title)}</h2>
          {note && <p className={styles.note}>{t(note)}</p>}
        </div>
        <Link href={href} className={styles.all}>
          {t(linkLabel)}
        </Link>
      </div>

      <div className="grid-cards">{children}</div>
    </section>
  );
}
