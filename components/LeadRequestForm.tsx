"use client";

import { useMemo, useRef, useState } from "react";
import { AGENCY, UI } from "@/lib/content";
import { useLang } from "@/lib/lang";
import type { LeadSource, T } from "@/lib/types";
import { DemoFormNote } from "./DemoBar";
import styles from "./LeadRequestForm.module.css";

/* ---------------------------------------------------------------------------
   One form behind every request on the site. It posts the contract that
   /api/lead expects and shows the answer in place — a visitor who has just
   typed a phone number should not lose the page they were reading.
   --------------------------------------------------------------------------- */

export type FormField = "name" | "phone" | "email" | "message" | "subject";

export interface SubjectOption {
  value: string;
  label: T;
}

interface Props {
  source: LeadSource;
  fields?: FormField[];
  subjects?: SubjectOption[];
  subjectLabel?: T;
  defaultMessage?: T;
  messagePlaceholder?: T;
  /** Prepended to the message when it is sent. Lets a page attach what the
   *  visitor picked elsewhere on the screen without resetting typed fields. */
  messagePrefix?: T;
  propertyId?: string;
  agentSlug?: string;
  submitLabel?: T;
  /** Rendered above the button, smaller than the fields. */
  note?: T;
  /** On an accent band the whole thing flips to the light-on-dark palette. */
  dark?: boolean;
}

/**
 * The clock starts the first time a visitor meets this form, not on every
 * remount: a page that rebuilds the form when a select changes would otherwise
 * make an honest person look like a script.
 */
const FIRST_SEEN = new Map<string, number>();

export default function LeadRequestForm({
  source,
  fields = ["name", "phone", "email", "message"],
  subjects,
  subjectLabel,
  defaultMessage,
  messagePlaceholder,
  messagePrefix,
  propertyId,
  agentSlug,
  submitLabel,
  note,
  dark = false,
}: Props) {
  const { t, lang } = useLang();

  const started = useMemo(() => {
    const seen = FIRST_SEEN.get(source);
    if (seen) return seen;
    const now = Date.now();
    FIRST_SEEN.set(source, now);
    return now;
  }, [source]);

  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [badField, setBadField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const has = (f: FormField) => fields.includes(f);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const data = new FormData(event.currentTarget);
    const subject = subjects?.find((s) => s.value === data.get("subject"));
    const written = String(data.get("message") ?? "").trim();
    const message = [messagePrefix ? t(messagePrefix) : "", subject ? t(subject.label) : "", written]
      .filter(Boolean)
      .join("\n");

    setSending(true);
    setError(null);
    setBadField(null);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source,
          name: data.get("name"),
          phone: data.get("phone"),
          email: data.get("email") || undefined,
          message: message || undefined,
          propertyId,
          agentSlug,
          lang,
          consent: data.get("consent") === "on",
          company: data.get("company") || undefined,
          elapsed: Date.now() - started,
        }),
      });
      const answer = (await response.json()) as {
        ok: boolean;
        error?: string;
        errorT?: T;
        field?: string;
      };

      if (answer.ok) {
        setDone(true);
        formRef.current?.reset();
      } else {
        setError(answer.errorT ? t(answer.errorT) : (answer.error ?? t(UI.errorGeneric)));
        setBadField(answer.field ?? null);
      }
    } catch {
      setError(t(UI.errorGeneric));
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className={`${styles.form} ${dark ? styles.dark : ""} ${styles.done}`}>
        <p className={styles.doneTitle}>{t(UI.successTitle)}</p>
        <p className={styles.doneText}>
          {t({
            ro: `Vă sunăm de obicei în ${AGENCY.stats.replyMinutes} minute, în programul de lucru. Dacă e urgent, sunați la ${AGENCY.mobile}.`,
            ru: `Обычно перезваниваем в течение ${AGENCY.stats.replyMinutes} минут в рабочее время. Если срочно — звоните: ${AGENCY.mobile}.`,
          })}
        </p>
        <DemoFormNote dark={dark} />
        <button
          type="button"
          className={`btn-line ${dark ? "btn-line-dark" : ""} ${styles.doneBtn}`}
          onClick={() => setDone(false)}
        >
          {t(UI.close)}
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} className={`${styles.form} ${dark ? styles.dark : ""}`} onSubmit={submit} noValidate>
      <DemoFormNote dark={dark} />

      {/* Left empty by a person, filled in by everything else. */}
      <label className={styles.trap} aria-hidden="true">
        <span>Companie</span>
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </label>

      <div className={styles.row}>
        {has("name") && (
          <label className={styles.label}>
            <span className={styles.labelText}>{t(UI.fullName)}</span>
            <input
              className={`field ${badField === "name" ? styles.bad : ""}`}
              type="text"
              name="name"
              autoComplete="name"
              required
            />
          </label>
        )}

        {has("phone") && (
          <label className={styles.label}>
            <span className={styles.labelText}>{t(UI.phone)}</span>
            <input
              className={`field ${badField === "phone" ? styles.bad : ""}`}
              type="tel"
              name="phone"
              inputMode="tel"
              placeholder="069 84 16 40"
              autoComplete="tel"
              required
            />
          </label>
        )}
      </div>

      {has("email") && (
        <label className={styles.label}>
          <span className={styles.labelText}>{t(UI.emailOptional)}</span>
          <input
            className={`field ${badField === "email" ? styles.bad : ""}`}
            type="email"
            name="email"
            autoComplete="email"
          />
        </label>
      )}

      {has("subject") && subjects && (
        <label className={styles.label}>
          <span className={styles.labelText}>{t(subjectLabel ?? UI.subject)}</span>
          <select className="field" name="subject" defaultValue={subjects[0]?.value}>
            {subjects.map((s) => (
              <option key={s.value} value={s.value}>
                {t(s.label)}
              </option>
            ))}
          </select>
        </label>
      )}

      {has("message") && (
        <label className={styles.label}>
          <span className={styles.labelText}>{t(UI.messageOptional)}</span>
          <textarea
            className="field"
            name="message"
            rows={4}
            defaultValue={defaultMessage ? t(defaultMessage) : undefined}
            placeholder={messagePlaceholder ? t(messagePlaceholder) : undefined}
          />
        </label>
      )}

      <label className={`${styles.consent} ${badField === "consent" ? styles.badConsent : ""}`}>
        <input type="checkbox" name="consent" className={styles.check} />
        <span>{t(UI.consent)}</span>
      </label>

      {note && <p className={styles.note}>{t(note)}</p>}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={`btn ${styles.submit} ${dark ? styles.submitDark : ""}`} disabled={sending}>
        {sending ? t(UI.sending) : t(submitLabel ?? UI.send)}
      </button>
    </form>
  );
}
