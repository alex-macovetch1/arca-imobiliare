"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { CheckKey, PropertyRow } from "@/app/api/_data/model";
import { AGENTS } from "@/lib/agents";
import { DEAL_LABEL, KIND_LABEL, SECTOR_LABEL, STATUS_LABEL } from "@/lib/content";
import { formatArea, formatDate, formatPrice, formatPricePerSqm, formatRent } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { Sector, T } from "@/lib/types";
import styles from "../admin.module.css";

const CHECK_LABEL: Record<CheckKey, T> = {
  ru: { ro: "Lipsește traducerea în rusă", ru: "Нет перевода на русский" },
  photos: { ro: "Sub 6 fotografii", ru: "Меньше 6 фотографий" },
  coords: { ro: "Fără coordonate pe hartă", ru: "Нет координат на карте" },
  description: { ro: "Descriere prea scurtă", ru: "Слишком короткое описание" },
  price: { ro: "€/m² în afara benzii sectorului", ru: "€/м² вне диапазона сектора" },
};

const CHECK_SHORT: Record<CheckKey, T> = {
  ru: { ro: "RU", ru: "RU" },
  photos: { ro: "FOTO", ru: "ФОТО" },
  coords: { ro: "HARTĂ", ru: "КАРТА" },
  description: { ro: "TEXT", ru: "ТЕКСТ" },
  price: { ro: "PREȚ", ru: "ЦЕНА" },
};

export default function PropertiesView({
  rows,
  removed,
  onlyFlagged,
}: {
  rows: PropertyRow[];
  removed: { id: string; title: T }[];
  onlyFlagged: boolean;
}) {
  const { t, lang } = useLang();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("");
  const [deal, setDeal] = useState("");
  const [status, setStatus] = useState("");
  const [flagged, setFlagged] = useState(onlyFlagged);
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const sectors = useMemo(() => {
    const seen = new Set<Sector>();
    for (const row of rows) seen.add(row.sector);
    return [...seen];
  }, [rows]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (sector && row.sector !== sector) return false;
      if (deal && row.deal !== deal) return false;
      if (status === "ascuns" ? !row.hidden : status && row.status !== status) return false;
      if (flagged && row.checks.length === 0) return false;
      if (needle) {
        const hay = `${row.id} ${row.street} ${row.title.ro} ${row.title.ru}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [rows, query, sector, deal, status, flagged]);

  const stats = useMemo(() => {
    const bySector = new Map<Sector, number>();
    const byRooms = new Map<number, number>();
    let sale = 0;
    let rent = 0;
    let totalSalePrice = 0;

    for (const row of rows) {
      bySector.set(row.sector, (bySector.get(row.sector) ?? 0) + 1);
      const key = row.rooms > 4 ? 4 : row.rooms;
      byRooms.set(key, (byRooms.get(key) ?? 0) + 1);
      if (row.deal === "vanzare") {
        sale += 1;
        totalSalePrice += row.price;
      } else {
        rent += 1;
      }
    }

    return {
      bySector: [...bySector.entries()].sort((a, b) => b[1] - a[1]),
      byRooms: [...byRooms.entries()].sort((a, b) => a[0] - b[0]),
      sale,
      rent,
      averageSale: sale > 0 ? Math.round(totalSalePrice / sale) : 0,
    };
  }, [rows]);

  async function send(body: Record<string, unknown>) {
    setBusy(true);
    try {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      router.refresh();
    } finally {
      setBusy(false);
      setConfirmId(null);
    }
  }

  return (
    <>
      <header className={styles.pageHead}>
        <div>
          <p className={styles.pageKicker}>{t({ ro: "Portofoliu", ru: "Портфель" })}</p>
          <h1 className={styles.pageTitle}>
            {t({ ro: "Proprietățile agenției", ru: "Объекты агентства" })}
          </h1>
        </div>
        <Link href="/admin/proprietati/nou" className="btn">
          {t({ ro: "Adaugă proprietate", ru: "Добавить объект" })}
        </Link>
      </header>

      <div className={styles.filters}>
        <input
          className="field"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t({ ro: "Cod, stradă sau titlu", ru: "Код, улица или заголовок" })}
        />

        <select className="field" value={sector} onChange={(e) => setSector(e.target.value)}>
          <option value="">{t({ ro: "Toate sectoarele", ru: "Все секторы" })}</option>
          {sectors.map((s) => (
            <option key={s} value={s}>
              {t(SECTOR_LABEL[s])}
            </option>
          ))}
        </select>

        <select className="field" value={deal} onChange={(e) => setDeal(e.target.value)}>
          <option value="">{t({ ro: "Vânzare și chirie", ru: "Продажа и аренда" })}</option>
          <option value="vanzare">{t(DEAL_LABEL.vanzare)}</option>
          <option value="chirie">{t(DEAL_LABEL.chirie)}</option>
        </select>

        <select className="field" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">{t({ ro: "Orice status", ru: "Любой статус" })}</option>
          <option value="activ">{t(STATUS_LABEL.activ)}</option>
          <option value="rezervat">{t(STATUS_LABEL.rezervat)}</option>
          <option value="vandut">{t(STATUS_LABEL.vandut)}</option>
          <option value="arhivat">{t(STATUS_LABEL.arhivat)}</option>
          <option value="ascuns">{t({ ro: "Ascunse de pe site", ru: "Скрытые с сайта" })}</option>
        </select>

        <label className={styles.checkFilter}>
          <input type="checkbox" checked={flagged} onChange={(e) => setFlagged(e.target.checked)} />
          <span>{t({ ro: "Doar cele de completat", ru: "Только требующие внимания" })}</span>
        </label>
      </div>

      <p className={styles.count}>
        {lang === "ru"
          ? `${filtered.length} из ${rows.length} объектов`
          : `${filtered.length} din ${rows.length} proprietăți`}
      </p>

      {filtered.length === 0 ? (
        <p className={styles.empty}>
          {t({
            ro: "Nicio proprietate care să se potrivească filtrelor.",
            ru: "Нет объектов, подходящих под фильтры.",
          })}
        </p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t({ ro: "Cod", ru: "Код" })}</th>
                <th>{t({ ro: "Proprietate", ru: "Объект" })}</th>
                <th>{t({ ro: "Sector", ru: "Сектор" })}</th>
                <th className={styles.cellRight}>{t({ ro: "Preț", ru: "Цена" })}</th>
                <th className={styles.cellRight}>€/m²</th>
                <th className={styles.cellRight}>{t({ ro: "Supr.", ru: "Площ." })}</th>
                <th>{t({ ro: "Agent", ru: "Агент" })}</th>
                <th>{t({ ro: "Verificare", ru: "Проверка" })}</th>
                <th>{t({ ro: "Status", ru: "Статус" })}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className={row.hidden ? styles.rowMuted : ""}>
                  <td>
                    <span className={styles.code}>{row.id}</span>
                    {row.origin === "panou" && (
                      <span className={styles.originTag}>
                        {t({ ro: "din panou", ru: "из панели" })}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={styles.cellStrong}>{t(row.title)}</span>
                    <span className={styles.cellSub}>
                      {t(KIND_LABEL[row.kind])} · {t(DEAL_LABEL[row.deal])} · {row.street}
                    </span>
                  </td>
                  <td>{t(SECTOR_LABEL[row.sector])}</td>
                  <td className={`num ${styles.cellRight}`}>
                    {row.deal === "chirie" ? formatRent(row.price, lang) : formatPrice(row.price)}
                  </td>
                  <td className={`num ${styles.cellRight}`}>
                    {formatPricePerSqm(row.pricePerSqm, lang)}
                  </td>
                  <td className={`num ${styles.cellRight}`}>{formatArea(row.area, lang)}</td>
                  <td>{AGENTS.find((a) => a.slug === row.agentSlug)?.name.split(" ")[0] ?? "—"}</td>
                  <td>
                    {row.checks.length === 0 ? (
                      <span className={styles.checkOk}>{t({ ro: "În regulă", ru: "В порядке" })}</span>
                    ) : (
                      <span className={styles.checks}>
                        {row.checks.map((check) => (
                          <span key={check} className={styles.check} title={t(CHECK_LABEL[check])}>
                            {t(CHECK_SHORT[check])}
                          </span>
                        ))}
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`${styles.state} ${
                        row.hidden ? styles.stateHidden : styles[`status_${row.status}`]
                      }`}
                    >
                      {row.hidden ? t({ ro: "Ascuns", ru: "Скрыт" }) : t(STATUS_LABEL[row.status])}
                    </span>
                    <span className={styles.cellSub}>{formatDate(row.updatedAt, lang)}</span>
                  </td>
                  <td className={styles.cellRight}>
                    <div className={styles.rowActions}>
                      <Link href={`/admin/proprietati/${row.id}`} className={styles.rowAction}>
                        {t({ ro: "Editează", ru: "Изменить" })}
                      </Link>
                      <button
                        type="button"
                        className={styles.rowAction}
                        disabled={busy}
                        onClick={() => send({ action: "property.hidden", id: row.id, hidden: !row.hidden })}
                      >
                        {row.hidden ? t({ ro: "Arată", ru: "Показать" }) : t({ ro: "Ascunde", ru: "Скрыть" })}
                      </button>
                      {confirmId === row.id ? (
                        <button
                          type="button"
                          className={styles.danger}
                          disabled={busy}
                          onClick={() => send({ action: "property.delete", id: row.id })}
                        >
                          {t({ ro: "Confirmă", ru: "Подтвердить" })}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`${styles.rowAction} ${styles.rowActionDanger}`}
                          onClick={() => setConfirmId(row.id)}
                        >
                          {t({ ro: "Șterge", ru: "Удалить" })}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {removed.length > 0 && (
        <section className={styles.block}>
          <div className={styles.blockHead}>
            <h2 className={styles.blockTitle}>{t({ ro: "Șterse", ru: "Удалённые" })}</h2>
          </div>
          <ul className={styles.removed}>
            {removed.map((item) => (
              <li key={item.id}>
                <span className={styles.code}>{item.id}</span>
                <span>{t(item.title)}</span>
                <button
                  type="button"
                  className={styles.rowAction}
                  disabled={busy}
                  onClick={() => send({ action: "property.restore", id: item.id })}
                >
                  {t({ ro: "Restabilește", ru: "Восстановить" })}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.block}>
        <div className={styles.blockHead}>
          <h2 className={styles.blockTitle}>{t({ ro: "Cum arată portofoliul", ru: "Как выглядит портфель" })}</h2>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statsCard}>
            <p className={styles.statsTitle}>{t({ ro: "Pe sector", ru: "По секторам" })}</p>
            <ul className={styles.bars}>
              {stats.bySector.map(([s, n]) => (
                <li key={s} className={styles.bar}>
                  <span className={styles.barLabel}>{t(SECTOR_LABEL[s])}</span>
                  <span
                    className={styles.barTrack}
                    style={{ "--w": `${(n / rows.length) * 100}%` } as React.CSSProperties}
                  />
                  <span className={`num ${styles.barValue}`}>{n}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.statsCard}>
            <p className={styles.statsTitle}>{t({ ro: "Pe camere", ru: "По комнатам" })}</p>
            <ul className={styles.bars}>
              {stats.byRooms.map(([rooms, n]) => (
                <li key={rooms} className={styles.bar}>
                  <span className={styles.barLabel}>
                    {rooms === 0
                      ? t({ ro: "Fără camere", ru: "Без комнат" })
                      : `${rooms}${rooms === 4 ? "+" : ""}`}
                  </span>
                  <span
                    className={styles.barTrack}
                    style={{ "--w": `${(n / rows.length) * 100}%` } as React.CSSProperties}
                  />
                  <span className={`num ${styles.barValue}`}>{n}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.statsCard}>
            <p className={styles.statsTitle}>{t({ ro: "Pe tranzacție", ru: "По типу сделки" })}</p>
            <dl className={styles.statsList}>
              <dt>{t(DEAL_LABEL.vanzare)}</dt>
              <dd className="num">{stats.sale}</dd>
              <dt>{t(DEAL_LABEL.chirie)}</dt>
              <dd className="num">{stats.rent}</dd>
              <dt>{t({ ro: "Preț mediu la vânzare", ru: "Средняя цена продажи" })}</dt>
              <dd className="num">{formatPrice(stats.averageSale)}</dd>
            </dl>
          </div>
        </div>
      </section>

      <p className={styles.hint}>
        {t({
          ro: "Proprietățile venite cu site-ul sunt conținut versionat în lib/properties.ts. Ce schimbați aici se păstrează în fișierul de date al panoului și se aplică peste ele; galeriile complete și punctele de interes se editează în cod.",
          ru: "Объекты, поставленные вместе с сайтом, — это версионируемый контент в lib/properties.ts. Изменения из панели хранятся в файле данных и накладываются поверх; полные галереи и точки рядом редактируются в коде.",
        })}
      </p>
    </>
  );
}
