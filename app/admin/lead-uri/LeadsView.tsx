"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { IconClose, IconPhone } from "@/components/Icons";
import { AGENTS } from "@/lib/agents";
import { LEAD_SOURCE_LABEL, LEAD_STATE_LABEL } from "@/lib/content";
import { displayPhone, formatDateTime } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { Lead, LeadSource, LeadState } from "@/lib/types";
import styles from "../admin.module.css";

const SOURCES: LeadSource[] = ["anunt", "vinde", "contact", "agent", "cautare"];
const STATES: LeadState[] = ["nou", "contactat", "programat", "inchis"];

/** Days back the range filter offers. Anything longer is what the export is for. */
const RANGES = [
  { value: "", label: { ro: "Oricând", ru: "За всё время" } },
  { value: "1", label: { ro: "Azi", ru: "Сегодня" } },
  { value: "7", label: { ro: "Ultimele 7 zile", ru: "Последние 7 дней" } },
  { value: "30", label: { ro: "Ultimele 30 de zile", ru: "Последние 30 дней" } },
] as const;

export default function LeadsView({ leads }: { leads: Lead[] }) {
  const { t, lang } = useLang();
  const router = useRouter();

  const [source, setSource] = useState("");
  const [state, setState] = useState("");
  const [agent, setAgent] = useState("");
  const [range, setRange] = useState("");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const cutoff = range ? Date.now() - Number(range) * 24 * 3600_000 : 0;
    const needle = query.trim().toLowerCase();

    return leads.filter((lead) => {
      if (source && lead.source !== source) return false;
      if (state && lead.state !== state) return false;
      if (agent && lead.agentSlug !== agent) return false;
      if (cutoff && new Date(lead.createdAt).getTime() < cutoff) return false;
      if (needle) {
        const hay = `${lead.name} ${lead.phone} ${lead.email ?? ""} ${lead.propertyId ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [leads, source, state, agent, range, query]);

  const open = openId ? (leads.find((l) => l.id === openId) ?? null) : null;

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
    }
  }

  function resetFilters() {
    setSource("");
    setState("");
    setAgent("");
    setRange("");
    setQuery("");
  }

  const active = Boolean(source || state || agent || range || query.trim());

  return (
    <>
      <header className={styles.pageHead}>
        <div>
          <p className={styles.pageKicker}>{t({ ro: "Cereri", ru: "Заявки" })}</p>
          <h1 className={styles.pageTitle}>
            {t({ ro: "Tot ce vine din formulare", ru: "Всё, что приходит из форм" })}
          </h1>
        </div>
        <a className="btn-line" href={`/api/admin?export=lead-uri&lang=${lang}`}>
          {t({ ro: "Exportă CSV", ru: "Экспорт CSV" })}
        </a>
      </header>

      <div className={styles.filters}>
        <input
          className="field"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t({ ro: "Nume, telefon sau cod ofertă", ru: "Имя, телефон или код объекта" })}
        />

        <select className="field" value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">{t({ ro: "Orice sursă", ru: "Любой источник" })}</option>
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {t(LEAD_SOURCE_LABEL[s])}
            </option>
          ))}
        </select>

        <select className="field" value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">{t({ ro: "Orice stare", ru: "Любой статус" })}</option>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {t(LEAD_STATE_LABEL[s])}
            </option>
          ))}
        </select>

        <select className="field" value={agent} onChange={(e) => setAgent(e.target.value)}>
          <option value="">{t({ ro: "Orice agent", ru: "Любой агент" })}</option>
          {AGENTS.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.name}
            </option>
          ))}
        </select>

        <select className="field" value={range} onChange={(e) => setRange(e.target.value)}>
          {RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {t(r.label)}
            </option>
          ))}
        </select>

        {active && (
          <button type="button" className={styles.reset} onClick={resetFilters}>
            {t({ ro: "Șterge filtrele", ru: "Сбросить фильтры" })}
          </button>
        )}
      </div>

      <p className={styles.count}>
        {lang === "ru"
          ? `${filtered.length} из ${leads.length} заявок`
          : `${filtered.length} din ${leads.length} cereri`}
      </p>

      {filtered.length === 0 ? (
        <p className={styles.empty}>
          {t({
            ro: "Nicio cerere care să se potrivească filtrelor.",
            ru: "Нет заявок, подходящих под фильтры.",
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
                <th>{t({ ro: "Agent", ru: "Агент" })}</th>
                <th>{t({ ro: "Stare", ru: "Статус" })}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className={`${styles.rowClickable} ${openId === lead.id ? styles.rowOpen : ""}`}
                  onClick={() => setOpenId(lead.id)}
                >
                  {/* The hour is read in the reader's own timezone, which the
                      server cannot know before hydration. */}
                  <td className="num" suppressHydrationWarning>
                    {formatDateTime(lead.createdAt, lang)}
                  </td>
                  <td className={styles.cellStrong}>{lead.name}</td>
                  <td className="num">
                    <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()}>
                      {displayPhone(lead.phone)}
                    </a>
                  </td>
                  <td>{t(LEAD_SOURCE_LABEL[lead.source])}</td>
                  <td className="num">
                    {lead.propertyId ? (
                      <span className={styles.code}>{lead.propertyId}</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{lead.agentSlug ? (AGENTS.find((a) => a.slug === lead.agentSlug)?.name ?? "—") : "—"}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      className={styles.stateSelect}
                      value={lead.state}
                      disabled={busy}
                      onChange={(e) => send({ action: "lead.state", id: lead.id, state: e.target.value })}
                    >
                      {STATES.map((s) => (
                        <option key={s} value={s}>
                          {t(LEAD_STATE_LABEL[s])}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={styles.cellRight}>
                    <a
                      href={`tel:${lead.phone}`}
                      className={styles.callBtn}
                      onClick={(e) => e.stopPropagation()}
                    >
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

      {open && (
        <LeadDetail
          key={open.id}
          lead={open}
          busy={busy}
          onClose={() => setOpenId(null)}
          onSave={(note) => send({ action: "lead.note", id: open.id, note })}
          onDelete={() => {
            setOpenId(null);
            void send({ action: "lead.delete", id: open.id });
          }}
        />
      )}
    </>
  );
}

function LeadDetail({
  lead,
  busy,
  onClose,
  onSave,
  onDelete,
}: {
  lead: Lead;
  busy: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
  onDelete: () => void;
}) {
  const { t, lang } = useLang();
  const [note, setNote] = useState(lead.note ?? "");
  const [confirming, setConfirming] = useState(false);

  return (
    <aside className={styles.panel} aria-label={t({ ro: "Detalii cerere", ru: "Детали заявки" })}>
      <div className={styles.panelHead}>
        <div>
          <p className={styles.panelKicker} suppressHydrationWarning>
            {formatDateTime(lead.createdAt, lang)} · {t(LEAD_SOURCE_LABEL[lead.source])}
          </p>
          <h2 className={styles.panelTitle}>{lead.name}</h2>
        </div>
        <button type="button" className={styles.panelClose} onClick={onClose} aria-label={t({ ro: "Închide", ru: "Закрыть" })}>
          <IconClose size={20} />
        </button>
      </div>

      <dl className={styles.panelFacts}>
        <dt>{t({ ro: "Telefon", ru: "Телефон" })}</dt>
        <dd className="num">
          <a href={`tel:${lead.phone}`}>{displayPhone(lead.phone)}</a>
        </dd>

        <dt>Email</dt>
        <dd>{lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : "—"}</dd>

        <dt>{t({ ro: "Ofertă", ru: "Объект" })}</dt>
        <dd className="num">{lead.propertyId ?? "—"}</dd>

        <dt>{t({ ro: "Limba", ru: "Язык" })}</dt>
        <dd>{lead.lang === "ru" ? "Русский" : "Română"}</dd>

        <dt>{t({ ro: "Stare", ru: "Статус" })}</dt>
        <dd>{t(LEAD_STATE_LABEL[lead.state])}</dd>
      </dl>

      {lead.message && (
        <div className={styles.panelMessage}>
          <p className={styles.panelLabel}>{t({ ro: "Mesajul", ru: "Сообщение" })}</p>
          <p>{lead.message}</p>
        </div>
      )}

      <label className={styles.panelLabel} htmlFor="lead-note">
        {t({ ro: "Notă internă", ru: "Внутренняя заметка" })}
      </label>
      <textarea
        id="lead-note"
        className="field"
        rows={4}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={t({
          ro: "Ce s-a discutat, ce urmează.",
          ru: "О чём договорились, что дальше.",
        })}
      />

      <div className={styles.panelActions}>
        <button type="button" className="btn" disabled={busy} onClick={() => onSave(note)}>
          {t({ ro: "Salvează nota", ru: "Сохранить заметку" })}
        </button>

        {confirming ? (
          <div className={styles.confirm}>
            <span>{t({ ro: "Ștergeți cererea?", ru: "Удалить заявку?" })}</span>
            <button type="button" className={styles.danger} onClick={onDelete}>
              {t({ ro: "Da, șterge", ru: "Да, удалить" })}
            </button>
            <button type="button" className={styles.reset} onClick={() => setConfirming(false)}>
              {t({ ro: "Nu", ru: "Нет" })}
            </button>
          </div>
        ) : (
          <button type="button" className={styles.dangerLine} onClick={() => setConfirming(true)}>
            {t({ ro: "Șterge cererea", ru: "Удалить заявку" })}
          </button>
        )}
      </div>
    </aside>
  );
}
