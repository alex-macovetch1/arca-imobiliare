"use client";

import Link from "next/link";
import { IconPhone } from "@/components/Icons";
import { LEAD_SOURCE_LABEL, LEAD_STATE_LABEL } from "@/lib/content";
import { displayPhone, formatDateTime } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { Lead, T } from "@/lib/types";
import styles from "./admin.module.css";

interface Counts {
  today: number;
  week: number;
  untouched: number;
  active: number;
  flagged: number;
}

export default function DashboardView({ counts, latest }: { counts: Counts; latest: Lead[] }) {
  const { t, lang } = useLang();

  const tiles: { value: number; label: T; href: string; alert?: boolean }[] = [
    {
      value: counts.today,
      label: { ro: "Cereri azi", ru: "Заявок сегодня" },
      href: "/admin/lead-uri",
    },
    {
      value: counts.week,
      label: { ro: "Cereri în ultimele 7 zile", ru: "Заявок за 7 дней" },
      href: "/admin/lead-uri",
    },
    {
      value: counts.untouched,
      label: { ro: "Necontactate", ru: "Без ответа" },
      href: "/admin/lead-uri?stare=nou",
      alert: counts.untouched > 0,
    },
    {
      value: counts.active,
      label: { ro: "Proprietăți active", ru: "Активных объектов" },
      href: "/admin/proprietati",
    },
  ];

  return (
    <>
      <header className={styles.pageHead}>
        <div>
          <p className={styles.pageKicker}>{t({ ro: "Tablou de bord", ru: "Сводка" })}</p>
          <h1 className={styles.pageTitle}>
            {t({ ro: "Ce s-a întâmplat pe site", ru: "Что происходит на сайте" })}
          </h1>
        </div>
        <Link href="/admin/proprietati/nou" className="btn">
          {t({ ro: "Adaugă proprietate", ru: "Добавить объект" })}
        </Link>
      </header>

      <ul className={styles.tiles}>
        {tiles.map((tile) => (
          <li key={tile.label.ro}>
            <Link href={tile.href} className={`${styles.tile} ${tile.alert ? styles.tileAlert : ""}`}>
              <span className={`num ${styles.tileValue}`}>{tile.value}</span>
              <span className={styles.tileLabel}>{t(tile.label)}</span>
            </Link>
          </li>
        ))}
      </ul>

      {counts.flagged > 0 && (
        <p className={styles.hint}>
          {lang === "ru"
            ? `${counts.flagged} объектов требуют внимания: не хватает перевода, фотографий или описания.`
            : `${counts.flagged} proprietăți au ceva de completat: traducere, fotografii sau descriere.`}{" "}
          <Link href="/admin/proprietati?verificare=1" className="link">
            {t({ ro: "Vezi care", ru: "Посмотреть какие" })}
          </Link>
        </p>
      )}

      <section className={styles.block}>
        <div className={styles.blockHead}>
          <h2 className={styles.blockTitle}>
            {t({ ro: "Ultimele cereri", ru: "Последние заявки" })}
          </h2>
          <Link href="/admin/lead-uri" className={styles.blockLink}>
            {t({ ro: "Toate cererile →", ru: "Все заявки →" })}
          </Link>
        </div>

        {latest.length === 0 ? (
          <p className={styles.empty}>
            {t({
              ro: "Încă nu a venit nicio cerere prin formularele site-ului.",
              ru: "Через формы сайта пока не пришло ни одной заявки.",
            })}
          </p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t({ ro: "Când", ru: "Когда" })}</th>
                  <th>{t({ ro: "Cine", ru: "Кто" })}</th>
                  <th>{t({ ro: "Telefon", ru: "Телефон" })}</th>
                  <th>{t({ ro: "De unde", ru: "Откуда" })}</th>
                  <th>{t({ ro: "Ofertă", ru: "Объект" })}</th>
                  <th>{t({ ro: "Stare", ru: "Статус" })}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {latest.map((lead) => (
                  <tr key={lead.id}>
                    {/* Local time: the server cannot know the reader's zone. */}
                    <td className="num" suppressHydrationWarning>
                      {formatDateTime(lead.createdAt, lang)}
                    </td>
                    <td className={styles.cellStrong}>{lead.name}</td>
                    <td className="num">
                      <a href={`tel:${lead.phone}`}>{displayPhone(lead.phone)}</a>
                    </td>
                    <td>{t(LEAD_SOURCE_LABEL[lead.source])}</td>
                    <td className="num">{lead.propertyId ?? "—"}</td>
                    <td>
                      <span className={`${styles.state} ${styles[`state_${lead.state}`]}`}>
                        {t(LEAD_STATE_LABEL[lead.state])}
                      </span>
                    </td>
                    <td className={styles.cellRight}>
                      <a href={`tel:${lead.phone}`} className={styles.callBtn}>
                        <IconPhone size={16} />
                        <span>{t({ ro: "Sună", ru: "Позвонить" })}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
