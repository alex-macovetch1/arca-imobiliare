"use client";

import Link from "next/link";
import { AGENCY, LINK_GROUPS, type LinkGroup } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { Fake } from "./DemoBar";
import LangSwitch from "./LangSwitch";
import styles from "./Footer.module.css";

/** The pages a visitor reaches once, and never through a filter. */
const SERVICES: LinkGroup = {
  title: { ro: "Servicii ARCA", ru: "Услуги ARCA" },
  links: [
    { href: "/vinde", label: { ro: "Vinde cu ARCA", ru: "Продать с ARCA" } },
    { href: "/indice", label: { ro: "Indicele pieței", ru: "Индекс рынка" } },
    { href: "/credit", label: { ro: "Credit ipotecar", ru: "Ипотека" } },
    { href: "/ghid", label: { ro: "Ghidul cumpărătorului", ru: "Гид покупателя" } },
    { href: "/favorite", label: { ro: "Proprietăți salvate", ru: "Сохранённые объекты" } },
  ],
};

/* Sale-by-sector and rent-by-sector are the two sets people actually search
   for; rooms and property types are printed under the results instead. Named,
   not indexed, so reordering the source cannot silently swap a column. */
const COLUMNS: LinkGroup[] = [
  LINK_GROUPS["vanzare-sector"],
  LINK_GROUPS["chirie-sector"],
  SERVICES,
];

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className={styles.foot}>
      <div className={`wrap ${styles.top}`}>
        <div className={styles.ask}>
          <p className="kicker kicker-dark">{t(AGENCY.tagline)}</p>
          <h2 className={styles.askTitle}>
            {t({ ro: "Cauți sau ", ru: "Покупаете или " })}
            <em className="say">{t({ ro: "vinzi", ru: "продаёте" })}</em>
            {"?"}
          </h2>
          <p className={styles.askLead}>
            {t({
              ro: `Spuneți-ne ce căutați sau ce aveți de vândut. Un agent răspunde în medie în ${AGENCY.stats.replyMinutes} minute.`,
              ru: `Расскажите, что ищете или что продаёте. Агент отвечает в среднем за ${AGENCY.stats.replyMinutes} минут.`,
            })}
          </p>
        </div>

        <div className={styles.acts}>
          <Link href="/proprietati" className={`btn ${styles.act}`}>
            {t({ ro: "Vezi ofertele", ru: "Смотреть предложения" })}
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/vinde" className={`btn-line btn-line-dark ${styles.act}`}>
            {t({ ro: "Evaluare gratuită", ru: "Бесплатная оценка" })}
          </Link>
        </div>
      </div>

      <div className={`wrap ${styles.mid}`}>
        <div className={styles.contact}>
          <h2 className={styles.colTitle}>{t({ ro: "Contact", ru: "Контакты" })}</h2>

          <a href={AGENCY.mobileHref} className={`num ${styles.tel}`}>
            {AGENCY.mobile}
          </a>
          <a href={AGENCY.phoneHref} className={`num ${styles.link}`}>
            {AGENCY.phone}
          </a>
          <a href={`mailto:${AGENCY.email}`} className={styles.link}>
            {AGENCY.email}
          </a>

          <p className={styles.line}>{t(AGENCY.address)}</p>
          <p className={styles.line}>{t(AGENCY.schedule)}</p>

          {/* Invented agency: the numbers, the address and the hours included. */}
          <Fake dark block />
          <p className={styles.line}>
            {t({
              ro: "ARCA este un concept demonstrativ realizat de NARON WEB. Agenția nu există.",
              ru: "ARCA — демонстрационный концепт, созданный NARON WEB. Такого агентства не существует.",
            })}
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title.ro} className={styles.col} aria-label={t(col.title)}>
            <h2 className={styles.colTitle}>{t(col.title)}</h2>
            <ul className={styles.list}>
              {col.links.map((l) => (
                <li key={l.href} className={styles.item}>
                  <Link href={l.href} className={styles.link}>
                    {t(l.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className={`wrap ${styles.bottom}`}>
        <p className={styles.copy}>
          © {AGENCY.founded}–2026 {AGENCY.name}
        </p>
        <Link href="/confidentialitate" className={`${styles.link} ${styles.small}`}>
          {t({ ro: "Politica de confidențialitate", ru: "Политика конфиденциальности" })}
        </Link>
        <div className={styles.lang}>
          <LangSwitch dark />
        </div>
      </div>

      <div className={`wrap ${styles.sign} rv`} aria-hidden="true">
        <span className={styles.signWord}>{AGENCY.name}</span>
      </div>
    </footer>
  );
}
