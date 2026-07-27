"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { KIND_PLURAL, SECTOR_LABEL, UI } from "@/lib/content";
import { formatCount, formatPrice, formatRent, formatRooms } from "@/lib/format";
import { useLang } from "@/lib/lang";
import { SECTORS } from "@/lib/sectors";
import type { Deal, Kind, T } from "@/lib/types";
import { IconChevron, IconSearch } from "./Icons";
import styles from "./SearchBar.module.css";

const KINDS: Kind[] = ["apartament", "casa", "teren", "comercial", "birou"];

/** Fixed steps, not a slider: a buyer thinks in round numbers, not in pixels. */
const SALE_STEPS = [
  20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 120000, 140000, 160000, 180000,
  200000, 250000, 300000,
];
const RENT_STEPS = [200, 300, 400, 500, 600, 700, 800, 1000, 1200, 1500, 2000, 3000];

const ROOMS = ["1", "2", "3", "4"];

const CHIPS: { label: T; href: string }[] = [
  { label: { ro: "1 cameră", ru: "1 комната" }, href: "/proprietati?camere=1" },
  { label: { ro: "2 camere", ru: "2 комнаты" }, href: "/proprietati?camere=2" },
  { label: { ro: "3 camere", ru: "3 комнаты" }, href: "/proprietati?camere=3" },
  { label: { ro: "Bloc nou", ru: "Новостройка" }, href: "/proprietati?fond=bloc-nou" },
  {
    label: { ro: `Până în ${formatPrice(80000)}`, ru: `До ${formatPrice(80000)}` },
    href: "/proprietati?pretMax=80000",
  },
  {
    label: { ro: "Chirie în Centru", ru: "Аренда в Центре" },
    href: "/proprietati?tranzactie=chirie&sector=centru",
  },
];

export default function SearchBar({ total }: { total: number }) {
  const { t, lang } = useLang();
  const router = useRouter();
  const id = useId();

  const [deal, setDeal] = useState<Deal>("vanzare");
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("");
  const [sector, setSector] = useState("");
  const [rooms, setRooms] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // The hour is read after mount: rendering it on the server would hand the
  // client a different string and break hydration.
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  useEffect(() => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(Math.floor(now.getMinutes() / 10) * 10).padStart(2, "0");
    setUpdatedAt(`${hh}:${mm}`);
  }, []);

  const steps = deal === "vanzare" ? SALE_STEPS : RENT_STEPS;

  function switchDeal(next: Deal) {
    setDeal(next);
    // Sale steps start at 20 000 and rent at 200: keeping the old figure would
    // send someone to an empty result page.
    setPriceMax("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams();
    query.set("tranzactie", deal);
    const term = q.trim();
    if (term) query.set("q", term);
    if (kind) query.set("tip", kind);
    if (sector) query.set("sector", sector);
    if (rooms) query.set("camere", rooms);
    if (priceMax) query.set("pretMax", priceMax);
    router.push(`/proprietati?${query.toString()}`);
  }

  const roomLabel = (v: string) =>
    v === "4" ? (lang === "ru" ? "4+ комн." : "4+ camere") : formatRooms(Number(v), lang);

  const city = SECTORS.filter((s) => !s.suburb);
  const suburbs = SECTORS.filter((s) => s.suburb);

  return (
    <section className={styles.zone}>
      <div className="wrap">
        <div className={styles.card}>
          <p className="kicker">
            {t({ ro: "Agenție imobiliară · Chișinău", ru: "Агентство недвижимости · Кишинёв" })}
          </p>

          <h1 className={styles.h1}>
            {t({ ro: "Acasă începe aici.", ru: "Дом начинается здесь." })}
          </h1>

          <p className={styles.sub}>
            {t({
              ro: "Apartamente, case și spații comerciale în Chișinău și suburbii.",
              ru: "Квартиры, дома и коммерческие помещения в Кишинёве и пригородах.",
            })}
          </p>

          <div
            className={styles.tabs}
            role="group"
            aria-label={t({ ro: "Tip de tranzacție", ru: "Тип сделки" })}
          >
            <button
              type="button"
              className={`${styles.tab} ${deal === "vanzare" ? styles.tabOn : ""}`}
              aria-pressed={deal === "vanzare"}
              onClick={() => switchDeal("vanzare")}
            >
              {t({ ro: "Vânzare", ru: "Продажа" })}
            </button>
            <button
              type="button"
              className={`${styles.tab} ${deal === "chirie" ? styles.tabOn : ""}`}
              aria-pressed={deal === "chirie"}
              onClick={() => switchDeal("chirie")}
            >
              {t({ ro: "Chirie", ru: "Аренда" })}
            </button>
          </div>

          <form className={styles.form} onSubmit={submit}>
            <div className={styles.q}>
              <label className={styles.label} htmlFor={`${id}-q`}>
                {t({ ro: "Ce cauți", ru: "Что ищете" })}
              </label>
              <input
                id={`${id}-q`}
                className="field"
                type="search"
                inputMode="search"
                maxLength={80}
                autoComplete="off"
                placeholder={t(UI.searchPlaceholder)}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <button type="submit" className={`btn ${styles.submit}`}>
              <IconSearch size={18} />
              {t(UI.search)}
            </button>

            <div className={styles.cell}>
              <label className={styles.label} htmlFor={`${id}-kind`}>
                {t(UI.propertyType)}
              </label>
              <div className={styles.pick}>
                <select
                  id={`${id}-kind`}
                  className="field"
                  value={kind}
                  onChange={(e) => setKind(e.target.value)}
                >
                  <option value="">{t(UI.allTypes)}</option>
                  {KINDS.map((k) => (
                    <option key={k} value={k}>
                      {t(KIND_PLURAL[k])}
                    </option>
                  ))}
                </select>
                <IconChevron className={styles.chev} size={16} />
              </div>
            </div>

            <div className={styles.cell}>
              <label className={styles.label} htmlFor={`${id}-sector`}>
                {t(UI.location)}
              </label>
              <div className={styles.pick}>
                <select
                  id={`${id}-sector`}
                  className="field"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                >
                  <option value="">{t({ ro: "Toate sectoarele", ru: "Все секторы" })}</option>
                  <optgroup label={t(UI.chisinau)}>
                    {city.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {t(SECTOR_LABEL[s.slug])}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={t(UI.suburbs)}>
                    {suburbs.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {t(SECTOR_LABEL[s.slug])}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <IconChevron className={styles.chev} size={16} />
              </div>
            </div>

            <div className={styles.cell}>
              <label className={styles.label} htmlFor={`${id}-rooms`}>
                {t(UI.rooms)}
              </label>
              <div className={styles.pick}>
                <select
                  id={`${id}-rooms`}
                  className="field"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                >
                  <option value="">{t(UI.anyCount)}</option>
                  {ROOMS.map((r) => (
                    <option key={r} value={r}>
                      {roomLabel(r)}
                    </option>
                  ))}
                </select>
                <IconChevron className={styles.chev} size={16} />
              </div>
            </div>

            <div className={styles.cell}>
              <label className={styles.label} htmlFor={`${id}-price`}>
                {deal === "vanzare"
                  ? t({ ro: "Preț maxim", ru: "Максимальная цена" })
                  : t({ ro: "Chirie maximă", ru: "Максимальная аренда" })}
              </label>
              <div className={styles.pick}>
                <select
                  id={`${id}-price`}
                  className="field"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                >
                  <option value="">{t(UI.noMax)}</option>
                  {steps.map((v) => (
                    <option key={v} value={v}>
                      {deal === "vanzare" ? formatPrice(v) : formatRent(v, lang)}
                    </option>
                  ))}
                </select>
                <IconChevron className={styles.chev} size={16} />
              </div>
            </div>
          </form>
        </div>

        <p className={styles.trust}>
          <span>
            {formatCount(total, t(UI.propertiesOne), t(UI.properties), lang)}{" "}
            {t({ ro: "în portofoliu", ru: "в портфеле" })}
          </span>
          {updatedAt && (
            <>
              <span className={styles.dot} aria-hidden="true" />
              <span>
                {t({
                  ro: `Actualizat azi, ora ${updatedAt}`,
                  ru: `Обновлено сегодня в ${updatedAt}`,
                })}
              </span>
            </>
          )}
        </p>

        <div className={styles.chips}>
          {CHIPS.map((c) => (
            <Link key={c.href} href={c.href} className={styles.chip}>
              {t(c.label)}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
