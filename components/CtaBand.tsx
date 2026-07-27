"use client";

import Image from "next/image";
import Link from "next/link";
import { AGENCY, UI } from "@/lib/content";
import { useLang } from "@/lib/lang";
import type { T } from "@/lib/types";
import styles from "./CtaBand.module.css";

const STEPS: T[] = [
  { ro: "Evaluare în 24 de ore", ru: "Оценка за 24 часа" },
  { ro: "Fotografie profesională și promovare", ru: "Профессиональная съёмка и продвижение" },
  { ro: "Negociere și acte până la notar", ru: "Переговоры и документы вплоть до нотариуса" },
];

/** The last thing before the footer, and the half of the business that local
 *  sites bury in a footer link: the seller. */
export default function CtaBand() {
  const { t } = useLang();

  return (
    <section className="wrap sec">
      <div className={`${styles.band} rv`}>
        <div className={`${styles.photo} rvimg`}>
          <Image
            src="/img/house-02.jpg"
            alt={t({
              ro: "Casă cu curte în suburbiile Chișinăului",
              ru: "Дом с двором в пригороде Кишинёва",
            })}
            fill
            sizes="(max-width: 899px) 100vw, 561px"
          />
        </div>

        <div className={styles.body}>
          <p className="kicker">{t({ ro: "Vinzi", ru: "Продаёте" })}</p>
          <h2 className={styles.title}>
            {t({ ro: "Vinde-ți apartamentul cu ARCA", ru: "Продайте квартиру с ARCA" })}
          </h2>
          <p className={styles.lead}>
            {t({
              ro: "Un singur agent duce vânzarea de la primul telefon până la notar. Comisionul se plătește la semnare, nu înainte.",
              ru: "Один агент ведёт продажу от первого звонка до нотариуса. Комиссия платится при подписании, а не раньше.",
            })}
          </p>

          <ol className={styles.steps}>
            {STEPS.map((s, i) => (
              <li key={s.ro} className={styles.step}>
                <span className={`num ${styles.no}`}>{String(i + 1).padStart(2, "0")}</span>
                <span>{t(s)}</span>
              </li>
            ))}
          </ol>

          <div className={styles.actions}>
            <Link href="/vinde" className="btn">
              {t(UI.requestValuation)}
            </Link>
            <a href={AGENCY.mobileHref} className={styles.call}>
              {t({ ro: "sau sună la", ru: "или позвоните" })} {AGENCY.mobile}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
