"use client";

import Link from "next/link";
import { AGENCY, FOOTER_LINKS } from "@/lib/content";
import { useLang } from "@/lib/lang";
import LangSwitch from "./LangSwitch";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";

const UTILITY_TITLE = { ro: "Pagini utile", ru: "Полезные страницы" };

/** The pages that are not a search: everything a visitor reaches once. */
const UTILITY = [
  { href: "/vinde", label: { ro: "Vinde cu ARCA", ru: "Продать с ARCA" } },
  { href: "/indice", label: { ro: "Indicele ARCA", ru: "Индекс ARCA" } },
  { href: "/credit", label: { ro: "Credit ipotecar", ru: "Ипотека" } },
  { href: "/ghid", label: { ro: "Ghidul cumpărătorului", ru: "Гид покупателя" } },
  { href: "/complexe", label: { ro: "Ansambluri rezidențiale", ru: "Жилые комплексы" } },
  { href: "/favorite", label: { ro: "Proprietăți salvate", ru: "Сохранённые объекты" } },
  { href: "/agenti", label: { ro: "Echipa", ru: "Команда" } },
];

export default function Footer() {
  const { t } = useLang();
  const year = AGENCY.founded;

  return (
    <footer className={styles.foot}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo className={styles.logo} />
          <p className={styles.tagline}>{t(AGENCY.tagline)}</p>

          <dl className={styles.contact}>
            <dt className={styles.dt}>{t({ ro: "Telefon", ru: "Телефон" })}</dt>
            <dd className={styles.dd}>
              <a href={AGENCY.phoneHref} className={styles.a}>
                {AGENCY.phone}
              </a>
              <a href={AGENCY.mobileHref} className={styles.a}>
                {AGENCY.mobile}
              </a>
            </dd>

            <dt className={styles.dt}>Email</dt>
            <dd className={styles.dd}>
              <a href={`mailto:${AGENCY.email}`} className={styles.a}>
                {AGENCY.email}
              </a>
            </dd>

            <dt className={styles.dt}>{t({ ro: "Birou", ru: "Офис" })}</dt>
            <dd className={styles.dd}>{t(AGENCY.address)}</dd>

            <dt className={styles.dt}>{t({ ro: "Program", ru: "График" })}</dt>
            <dd className={styles.dd}>{t(AGENCY.schedule)}</dd>
          </dl>
        </div>

        <div className={styles.cols}>
          {FOOTER_LINKS.map((col) => (
            <nav key={col.title.ro} className={styles.col} aria-label={t(col.title)}>
              <h2 className={styles.colTitle}>{t(col.title)}</h2>
              <ul className={styles.list}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={styles.link}>
                      {t(l.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <nav className={`wrap ${styles.utility}`} aria-label={t(UTILITY_TITLE)}>
        {UTILITY.map((item) => (
          <Link key={item.href} href={item.href} className={styles.utilityLink}>
            {t(item.label)}
          </Link>
        ))}
      </nav>

      <div className={`wrap ${styles.bottom}`}>
        <p className={styles.copy}>
          © {year}–2026 {AGENCY.name}
        </p>
        <Link href="/confidentialitate" className={styles.small}>
          {t({ ro: "Politica de confidențialitate", ru: "Политика конфиденциальности" })}
        </Link>
        <div className={styles.lang}>
          <LangSwitch dark />
        </div>
      </div>
    </footer>
  );
}
