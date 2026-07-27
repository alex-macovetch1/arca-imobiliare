"use client";

import Link from "next/link";
import { AGENCY, UI } from "@/lib/content";
import { useLang } from "@/lib/lang";
import type { T } from "@/lib/types";
import { Arch } from "./Logo";
import styles from "./NotFoundView.module.css";

const N = {
  code: { ro: "Eroare 404", ru: "Ошибка 404" },
  title: { ro: "Pagina asta nu există", ru: "Такой страницы нет" },
  text: {
    ro: "Poate anunțul a fost retras după ce s-a vândut, poate linkul s-a rupt pe drum. Portofoliul e mai jos, iar dacă știți codul ofertei, sunați-ne și îl căutăm noi.",
    ru: "Возможно, объявление сняли после продажи, а возможно, ссылка сломалась по дороге. Портфель ниже, а если знаете код объявления — позвоните, и мы найдём его сами.",
  },
  browse: { ro: "Vezi proprietățile", ru: "Смотреть объекты" },
  home: { ro: "Pagina principală", ru: "На главную" },
} satisfies Record<string, T>;

const LINKS: { href: string; label: T }[] = [
  { href: "/proprietati?tranzactie=vanzare", label: { ro: "Apartamente de vânzare", ru: "Квартиры на продажу" } },
  { href: "/proprietati?tranzactie=chirie", label: { ro: "Chirii", ru: "Аренда" } },
  { href: "/complexe", label: { ro: "Ansambluri rezidențiale", ru: "Жилые комплексы" } },
  { href: "/indice", label: { ro: "Indicele ARCA", ru: "Индекс ARCA" } },
  { href: "/vinde", label: { ro: "Vinde cu ARCA", ru: "Продать с ARCA" } },
  { href: "/contact", label: { ro: "Contact", ru: "Контакты" } },
];

export default function NotFoundView() {
  const { t } = useLang();

  return (
    <section className={`wrap ${styles.wrap}`}>
      <Arch className={styles.arch} />
      <p className="kicker">{t(N.code)}</p>
      <h1 className={styles.title}>{t(N.title)}</h1>
      <p className={`lead ${styles.text}`}>{t(N.text)}</p>

      <div className={styles.actions}>
        <Link href="/proprietati" className="btn">
          {t(N.browse)}
        </Link>
        <Link href="/" className="btn-line">
          {t(N.home)}
        </Link>
        <a href={AGENCY.mobileHref} className={`num ${styles.phone}`}>
          {AGENCY.mobile}
        </a>
      </div>

      <nav className={styles.links} aria-label={t(UI.showAll)}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="link">
            {t(l.label)}
          </Link>
        ))}
      </nav>
    </section>
  );
}
