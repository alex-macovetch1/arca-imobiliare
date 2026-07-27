"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  CONDITIONS,
  DEALS,
  FLAGS,
  FLOOR_CHOICES,
  FUNDS,
  KINDS,
  PHOTO_CHOICES,
  SECTOR_VALUES,
  STATUSES,
  pricePerSqm,
  type PropertyRow,
} from "@/app/api/_data/model";
import { AGENTS } from "@/lib/agents";
import {
  CONDITION_LABEL,
  DEAL_LABEL,
  FLAG_LABEL,
  FUND_LABEL,
  KIND_LABEL,
  SECTOR_LABEL,
  STATUS_LABEL,
} from "@/lib/content";
import { formatPricePerSqm } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { Flag, T } from "@/lib/types";
import styles from "./admin.module.css";

interface Values {
  id: string;
  deal: string;
  kind: string;
  sector: string;
  street: string;
  titleRo: string;
  titleRu: string;
  descriptionRo: string;
  descriptionRu: string;
  price: string;
  area: string;
  rooms: string;
  bathrooms: string;
  floor: string;
  floors: string;
  year: string;
  fund: string;
  condition: string;
  agentSlug: string;
  photo: string;
  status: string;
  hidden: boolean;
}

function initialValues(row: PropertyRow | undefined, suggestedCode: string): Values {
  if (!row) {
    return {
      id: suggestedCode,
      deal: "vanzare",
      kind: "apartament",
      sector: "centru",
      street: "",
      titleRo: "",
      titleRu: "",
      descriptionRo: "",
      descriptionRu: "",
      price: "",
      area: "",
      rooms: "2",
      bathrooms: "1",
      floor: "3",
      floors: "9",
      year: "2020",
      fund: "bloc-nou",
      condition: "euroreparatie",
      agentSlug: AGENTS[0]?.slug ?? "",
      photo: "/img/apt-01.jpg",
      status: "activ",
      hidden: false,
    };
  }

  return {
    id: row.id,
    deal: row.deal,
    kind: row.kind,
    sector: row.sector,
    street: row.street,
    titleRo: row.title.ro,
    titleRu: row.title.ru,
    descriptionRo: row.description.ro,
    descriptionRu: row.description.ru,
    price: String(row.price),
    area: String(row.area),
    rooms: String(row.rooms),
    bathrooms: String(row.bathrooms),
    floor: String(row.floor),
    floors: String(row.floors),
    year: String(row.year),
    fund: row.fund,
    condition: row.condition,
    agentSlug: row.agentSlug,
    photo: row.photo,
    status: row.status,
    hidden: row.hidden,
  };
}

export default function PropertyForm({
  row,
  suggestedCode = "",
}: {
  row?: PropertyRow;
  suggestedCode?: string;
}) {
  const { t, lang } = useLang();
  const router = useRouter();

  const [values, setValues] = useState<Values>(() => initialValues(row, suggestedCode));
  const [flags, setFlags] = useState<Flag[]>(row?.flags ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [badField, setBadField] = useState<string | null>(null);

  const editing = Boolean(row);
  const fromPortfolio = row?.origin === "portofoliu";

  const set = <K extends keyof Values>(key: K, value: Values[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const sqm = useMemo(() => {
    const price = Number(values.price);
    const area = Number(values.area.replace(",", "."));
    if (!Number.isFinite(price) || !Number.isFinite(area) || area <= 0) return null;
    return pricePerSqm(price, area);
  }, [values.price, values.area]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setBadField(null);

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "property.save",
          id: values.id,
          form: { ...values, flags },
        }),
      });
      const answer = (await response.json()) as {
        ok: boolean;
        errorT?: T;
        error?: string;
        field?: string;
      };

      if (answer.ok) {
        router.push("/admin/proprietati");
        router.refresh();
      } else {
        setError(answer.errorT ? t(answer.errorT) : (answer.error ?? "—"));
        setBadField(answer.field ?? null);
      }
    } catch {
      setError(
        t({
          ro: "Nu am putut salva. Verificați conexiunea și încercați din nou.",
          ru: "Не удалось сохранить. Проверьте соединение и попробуйте снова.",
        })
      );
    } finally {
      setBusy(false);
    }
  }

  const bad = (field: string) => (badField === field ? styles.fieldBad : "");

  return (
    <form onSubmit={submit}>
      <header className={styles.pageHead}>
        <div>
          <p className={styles.pageKicker}>
            {editing
              ? t({ ro: "Editare proprietate", ru: "Редактирование объекта" })
              : t({ ro: "Proprietate nouă", ru: "Новый объект" })}
          </p>
          <h1 className={styles.pageTitle}>
            {editing ? values.id : t({ ro: "Adaugă o proprietate", ru: "Добавить объект" })}
          </h1>
        </div>
        <div className={styles.headActions}>
          <Link href="/admin/proprietati" className="btn-line">
            {t({ ro: "Renunță", ru: "Отмена" })}
          </Link>
          <button type="submit" className="btn" disabled={busy}>
            {busy
              ? t({ ro: "Se salvează…", ru: "Сохраняем…" })
              : t({ ro: "Salvează", ru: "Сохранить" })}
          </button>
        </div>
      </header>

      {fromPortfolio && (
        <p className={styles.hint}>
          {t({
            ro: "Proprietatea aceasta vine din portofoliul publicat cu site-ul. Ce schimbați aici se păstrează separat și se aplică peste versiunea din cod.",
            ru: "Этот объект пришёл из портфеля, опубликованного вместе с сайтом. Изменения сохраняются отдельно и накладываются поверх версии из кода.",
          })}
        </p>
      )}

      {error && (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      )}

      <div className={styles.formGrid}>
        <section className={styles.fieldset}>
          <h2 className={styles.fieldsetTitle}>{t({ ro: "Ce vindem", ru: "Что продаём" })}</h2>

          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t({ ro: "Cod ofertă", ru: "Код объявления" })}</span>
              <input
                className={`field ${bad("id")}`}
                value={values.id}
                onChange={(e) => set("id", e.target.value.toUpperCase())}
                readOnly={editing}
                placeholder="AR-1042"
              />
              <span className={styles.fieldNote}>
                {t({ ro: "Codul dictat la telefon.", ru: "Код, который диктуют по телефону." })}
              </span>
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t({ ro: "Tranzacție", ru: "Тип сделки" })}</span>
              <select className="field" value={values.deal} onChange={(e) => set("deal", e.target.value)}>
                {DEALS.map((d) => (
                  <option key={d} value={d}>
                    {t(DEAL_LABEL[d])}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t({ ro: "Tip", ru: "Тип" })}</span>
              <select className="field" value={values.kind} onChange={(e) => set("kind", e.target.value)}>
                {KINDS.map((k) => (
                  <option key={k} value={k}>
                    {t(KIND_LABEL[k])}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t({ ro: "Sector", ru: "Сектор" })}</span>
              <select
                className="field"
                value={values.sector}
                onChange={(e) => set("sector", e.target.value)}
              >
                {SECTOR_VALUES.map((s) => (
                  <option key={s} value={s}>
                    {t(SECTOR_LABEL[s])}
                  </option>
                ))}
              </select>
            </label>

            <label className={`${styles.field} ${styles.fieldWide}`}>
              <span className={styles.fieldLabel}>{t({ ro: "Strada și numărul", ru: "Улица и номер" })}</span>
              <input
                className={`field ${bad("street")}`}
                value={values.street}
                onChange={(e) => set("street", e.target.value)}
                placeholder="str. Matei Basarab 12"
              />
            </label>
          </div>
        </section>

        <section className={styles.fieldset}>
          <h2 className={styles.fieldsetTitle}>{t({ ro: "Prețul", ru: "Цена" })}</h2>

          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>
                {values.deal === "chirie"
                  ? t({ ro: "Chirie lunară, €", ru: "Аренда в месяц, €" })
                  : t({ ro: "Preț, €", ru: "Цена, €" })}
              </span>
              <input
                className={`field num ${bad("price")}`}
                inputMode="numeric"
                value={values.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="118000"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t({ ro: "Suprafață, m²", ru: "Площадь, м²" })}</span>
              <input
                className={`field num ${bad("area")}`}
                inputMode="decimal"
                value={values.area}
                onChange={(e) => set("area", e.target.value)}
                placeholder="67"
              />
            </label>

            <div className={styles.field}>
              <span className={styles.fieldLabel}>{t({ ro: "Rezultă", ru: "Получается" })}</span>
              <p className={`num ${styles.computed}`}>
                {sqm ? formatPricePerSqm(sqm, lang) : "—"}
              </p>
              <span className={styles.fieldNote}>
                {t({ ro: "Se calculează singur.", ru: "Считается автоматически." })}
              </span>
            </div>
          </div>
        </section>

        <section className={styles.fieldset}>
          <h2 className={styles.fieldsetTitle}>{t({ ro: "Apartamentul", ru: "Квартира" })}</h2>

          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t({ ro: "Camere", ru: "Комнаты" })}</span>
              <input
                className="field num"
                inputMode="numeric"
                value={values.rooms}
                onChange={(e) => set("rooms", e.target.value)}
              />
              <span className={styles.fieldNote}>
                {t({ ro: "0 pentru comercial și birou.", ru: "0 для коммерции и офисов." })}
              </span>
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t({ ro: "Băi", ru: "Санузлы" })}</span>
              <input
                className="field num"
                inputMode="numeric"
                value={values.bathrooms}
                onChange={(e) => set("bathrooms", e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t({ ro: "Etaj", ru: "Этаж" })}</span>
              <select className="field" value={values.floor} onChange={(e) => set("floor", e.target.value)}>
                {FLOOR_CHOICES.map((f) => (
                  <option key={String(f)} value={String(f)}>
                    {f === "parter"
                      ? t({ ro: "Parter", ru: "1-й" })
                      : f === "demisol"
                        ? t({ ro: "Demisol", ru: "Цоколь" })
                        : f === "mansarda"
                          ? t({ ro: "Mansardă", ru: "Мансарда" })
                          : f}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t({ ro: "Etaje în bloc", ru: "Этажей в доме" })}</span>
              <input
                className="field num"
                inputMode="numeric"
                value={values.floors}
                onChange={(e) => set("floors", e.target.value)}
              />
            </label>
          </div>

          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t({ ro: "An construcție", ru: "Год постройки" })}</span>
              <input
                className="field num"
                inputMode="numeric"
                value={values.year}
                onChange={(e) => set("year", e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t({ ro: "Fond locativ", ru: "Тип жилья" })}</span>
              <select className="field" value={values.fund} onChange={(e) => set("fund", e.target.value)}>
                {FUNDS.map((f) => (
                  <option key={f} value={f}>
                    {t(FUND_LABEL[f])}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t({ ro: "Starea", ru: "Состояние" })}</span>
              <select
                className="field"
                value={values.condition}
                onChange={(e) => set("condition", e.target.value)}
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {t(CONDITION_LABEL[c])}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className={styles.fieldset}>
          <h2 className={styles.fieldsetTitle}>{t({ ro: "Textul anunțului", ru: "Текст объявления" })}</h2>

          <div className={styles.fieldRow}>
            <label className={`${styles.field} ${styles.fieldWide}`}>
              <span className={styles.fieldLabel}>{t({ ro: "Titlu — română", ru: "Заголовок — румынский" })}</span>
              <input
                className={`field ${bad("titleRo")}`}
                value={values.titleRo}
                onChange={(e) => set("titleRo", e.target.value)}
                placeholder="Apartament cu 2 camere, str. Kiev 8, Râșcani"
              />
            </label>

            <label className={`${styles.field} ${styles.fieldWide}`}>
              <span className={styles.fieldLabel}>{t({ ro: "Titlu — rusă", ru: "Заголовок — русский" })}</span>
              <input
                className="field"
                value={values.titleRu}
                onChange={(e) => set("titleRu", e.target.value)}
                placeholder="2-комнатная квартира, ул. Киевская 8, Рышкановка"
              />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>{t({ ro: "Descriere — română", ru: "Описание — румынский" })}</span>
            <textarea
              className="field"
              rows={7}
              value={values.descriptionRo}
              onChange={(e) => set("descriptionRo", e.target.value)}
            />
            <span className={styles.fieldNote}>
              {t({
                ro: "Un paragraf de context, apoi „Compartimentare:” și „Facilități:”. Sub 400 de caractere, panoul îl semnalează ca prea scurt.",
                ru: "Абзац контекста, затем «Планировка:» и «Удобства:». Короче 400 знаков панель отметит как слишком краткое.",
              })}
            </span>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>{t({ ro: "Descriere — rusă", ru: "Описание — русский" })}</span>
            <textarea
              className="field"
              rows={7}
              value={values.descriptionRu}
              onChange={(e) => set("descriptionRu", e.target.value)}
            />
          </label>
        </section>

        <section className={styles.fieldset}>
          <h2 className={styles.fieldsetTitle}>{t({ ro: "Fotografia și agentul", ru: "Фото и агент" })}</h2>

          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t({ ro: "Agentul responsabil", ru: "Ответственный агент" })}</span>
              <select
                className="field"
                value={values.agentSlug}
                onChange={(e) => set("agentSlug", e.target.value)}
              >
                {AGENTS.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t({ ro: "Fotografia principală", ru: "Главное фото" })}</span>
              <select className="field" value={values.photo} onChange={(e) => set("photo", e.target.value)}>
                {PHOTO_CHOICES.map((group) => (
                  <optgroup key={group.group.ro} label={t(group.group)}>
                    {group.files.map((file) => (
                      <option key={file} value={file}>
                        {file.replace("/img/", "")}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>

            <div className={styles.preview}>
              <div className="ph">
                {values.photo && (
                  <Image src={values.photo} alt="" fill sizes="240px" />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.fieldset}>
          <h2 className={styles.fieldsetTitle}>{t({ ro: "Publicare", ru: "Публикация" })}</h2>

          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t({ ro: "Status", ru: "Статус" })}</span>
              <select className="field" value={values.status} onChange={(e) => set("status", e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t(STATUS_LABEL[s])}
                  </option>
                ))}
              </select>
            </label>

            <label className={`${styles.field} ${styles.fieldCheck}`}>
              <input
                type="checkbox"
                checked={values.hidden}
                onChange={(e) => set("hidden", e.target.checked)}
              />
              <span>{t({ ro: "Ascunde de pe site", ru: "Скрыть с сайта" })}</span>
            </label>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t({ ro: "Marcaje", ru: "Метки" })}</span>
            <div className={styles.chips}>
              {FLAGS.map((flag) => {
                const on = flags.includes(flag);
                return (
                  <button
                    key={flag}
                    type="button"
                    className={`${styles.chip} ${on ? styles.chipOn : ""}`}
                    onClick={() =>
                      setFlags((current) =>
                        on ? current.filter((f) => f !== flag) : [...current, flag]
                      )
                    }
                    aria-pressed={on}
                  >
                    {t(FLAG_LABEL[flag])}
                  </button>
                );
              })}
            </div>
            <span className={styles.fieldNote}>
              {t({
                ro: "Primele două se afișează peste fotografie.",
                ru: "Первые две показываются поверх фотографии.",
              })}
            </span>
          </div>
        </section>
      </div>

      <div className={styles.formFoot}>
        <button type="submit" className="btn" disabled={busy}>
          {busy ? t({ ro: "Se salvează…", ru: "Сохраняем…" }) : t({ ro: "Salvează", ru: "Сохранить" })}
        </button>
        <Link href="/admin/proprietati" className="btn-line">
          {t({ ro: "Renunță", ru: "Отмена" })}
        </Link>
      </div>
    </form>
  );
}
