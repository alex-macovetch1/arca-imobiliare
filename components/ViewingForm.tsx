"use client";

import { useEffect, useRef, useState } from "react";
import { AGENCY, UI } from "@/lib/content";
import { formatDate, formatStreet, normalizePhone } from "@/lib/format";
import { useLang } from "@/lib/lang";
import { nextViewing } from "@/lib/next-viewing";
import type { Agent, Lang, Property, T } from "@/lib/types";
import styles from "./ViewingForm.module.css";

const V = {
  title: { ro: "Programează vizionare", ru: "Записаться на просмотр" },
  date: { ro: "Data preferată", ru: "Желаемая дата" },
  reply: {
    ro: `Vă răspundem în medie în ${AGENCY.stats.replyMinutes} minute.`,
    ru: `Отвечаем в среднем за ${AGENCY.stats.replyMinutes} минут.`,
  },
} satisfies Record<string, T>;

/** What the agent reads in the lead table, already written for them. */
function leadMessage(street: string, code: string, day: string, lang: Lang): string {
  const wanted = day
    ? lang === "ru"
      ? ` Желаемый просмотр: ${formatDate(day, lang)}.`
      : ` Vizionare dorită: ${formatDate(day, lang)}.`
    : "";
  return lang === "ru"
    ? `Меня интересует объект по адресу ${formatStreet(street, lang)}, код ${code}.${wanted}`
    : `Sunt interesat de proprietatea de pe ${street}, cod ${code}.${wanted}`;
}

type Props = { property: Property; agent: Agent };

export default function ViewingForm({ property, agent }: Props) {
  const { t, lang } = useLang();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [error, setError] = useState<T | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const [slot, setSlot] = useState<{ hint: string; iso: string } | null>(null);
  const openedAt = useRef(Date.now());

  // The slot depends on the visitor's clock, so it can only be read after mount.
  useEffect(() => {
    const next = nextViewing(lang);
    setSlot(next);
    setDate((d) => d || next.iso);
  }, [lang]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;

    // Honeypot plus a minimum dwell time: no captcha, no third-party script.
    if (trap || Date.now() - openedAt.current < 2000) {
      setStatus("done");
      return;
    }

    if (name.trim().length < 2) return setError(UI.errorName);
    const normalized = normalizePhone(phone);
    if (!normalized) return setError(UI.errorPhone);
    if (!consent) return setError(UI.errorConsent);

    setError(null);
    setStatus("sending");

    const message = leadMessage(property.street, property.id, date, lang);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "anunt",
          name: name.trim(),
          phone: normalized,
          message,
          propertyId: property.id,
          agentSlug: agent.slug,
          lang,
          consent: true,
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (!res.ok || data?.ok === false) throw new Error("rejected");
      setStatus("done");
    } catch {
      setStatus("idle");
      setError(UI.errorGeneric);
    }
  }

  if (status === "done") {
    return (
      <div className={styles.card}>
        <p className="kicker">{t(UI.bookViewing)}</p>
        <p className={`serif ${styles.doneTitle}`}>{t(UI.successTitle)}</p>
        <p className={styles.doneText}>{t(V.reply)}</p>
        <a href={agent.phoneHref} className={`num ${styles.donePhone}`}>
          {agent.phone}
        </a>
        <button
          type="button"
          className={`btn-line ${styles.doneClose}`}
          onClick={() => {
            setStatus("idle");
            setName("");
            setPhone("");
            setConsent(false);
            openedAt.current = Date.now();
          }}
        >
          {t(UI.close)}
        </button>
      </div>
    );
  }

  return (
    <form className={styles.card} onSubmit={submit} noValidate>
      <p className="kicker">{t(V.title)}</p>

      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.label}>{t(UI.firstName)}</span>
          <input
            className="field"
            type="text"
            autoComplete="given-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t(UI.phone)}</span>
          <input
            className="field"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="069 12 34 56"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t(V.date)}</span>
          <input
            className="field"
            type="date"
            min={slot?.iso}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        {/* Left in the flow but hidden from people and from assistive tech. */}
        <input
          className={styles.trap}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </div>

      <label className={styles.consent}>
        <input
          type="checkbox"
          className={styles.check}
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span className="legal">{t(UI.consent)}</span>
      </label>

      {error && (
        <p className={styles.error} role="alert">
          {t(error)}
        </p>
      )}

      <button type="submit" className={`btn ${styles.submit}`} disabled={status === "sending"}>
        {status === "sending" ? t(UI.sending) : t(UI.bookViewing)}
      </button>

      {/* Height is reserved so the hint cannot nudge the button when it lands. */}
      <p className={styles.slot}>{slot?.hint ?? ""}</p>
    </form>
  );
}
