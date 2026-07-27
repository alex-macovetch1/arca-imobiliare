"use client";

import { useEffect, useRef, useState } from "react";
import { DEAL_LABEL, KIND_PLURAL, SECTOR_LABEL, UI } from "@/lib/content";
import { formatPrice } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { Deal, Kind, Property, Sector } from "@/lib/types";
import { IconClose, IconSearch } from "./Icons";
import type { Filters as FilterState } from "./FiltersCore";
import {
  activeCount,
  CITY_SECTOR_VALUES,
  countFor,
  extraCount,
  KIND_VALUES,
  priceSteps,
  ROOM_VALUES,
  SUBURB_SECTOR_VALUES,
} from "./FiltersCore";
import styles from "./Filters.module.css";

type Props = {
  filters: FilterState;
  /** The whole portfolio: every count in the bar is measured against it. */
  base: Property[];
  onChange: (next: FilterState) => void;
  panelOpen: boolean;
  onTogglePanel: () => void;
};

const DEALS: Deal[] = ["vanzare", "chirie"];

const COPY = {
  roomsLabel: { ro: "Camere", ru: "Комнаты" },
  roomsFour: { ro: "4+", ru: "4+" },
  searchInside: { ro: "Stradă, complex sau cod ofertă", ru: "Улица, комплекс или код объявления" },
  clearLocation: { ro: "Șterge locațiile", ru: "Очистить" },
  roomsAria: { ro: "camere", ru: "комнат" },
  // Shorter than "Fără minim" — the closed select has 124px and Russian needs
  // every one of them.
  priceFrom: { ro: "Preț de la", ru: "Цена от" },
  priceTo: { ro: "Preț până în", ru: "Цена до" },
};

export default function Filters({ filters, base, onChange, panelOpen, onTogglePanel }: Props) {
  const { t } = useLang();
  const [locOpen, setLocOpen] = useState(false);
  const [q, setQ] = useState(filters.q);
  const locRef = useRef<HTMLDivElement>(null);
  const latest = useRef({ filters, onChange });

  useEffect(() => {
    latest.current = { filters, onChange };
  });

  // The text field is the one control that must not write the URL on every
  // keystroke: the back button would fill up with half-typed street names.
  useEffect(() => setQ(filters.q), [filters.q]);
  useEffect(() => {
    const { filters: f, onChange: fire } = latest.current;
    if (q === f.q) return;
    const id = setTimeout(() => fire({ ...f, q, page: 1 }), 350);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    if (!locOpen) return;
    const onDown = (e: MouseEvent) => {
      if (locRef.current && !locRef.current.contains(e.target as Node)) setLocOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLocOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [locOpen]);

  const set = (next: Partial<FilterState>) => onChange({ ...filters, ...next, page: 1 });
  const count = (next: Partial<FilterState>) => countFor(base, filters, next);
  const steps = priceSteps(filters.deal);
  const active = activeCount(filters);
  const extra = extraCount(filters);

  // Plain amounts in the steps: the active tab already says whether this is a
  // sale or a rent, and "1 000 €/мес." does not fit a 124px control.
  const money = (v: number) => formatPrice(v);

  const toggleSector = (s: Sector) =>
    set({
      sectors: filters.sectors.includes(s)
        ? filters.sectors.filter((v) => v !== s)
        : [...filters.sectors, s],
    });

  const sectorGroup = (values: Sector[], title: string) => (
    <div className={styles.group}>
      <p className={styles.groupTitle}>{title}</p>
      {values.map((s) => {
        const n = count({ sectors: [s] });
        const on = filters.sectors.includes(s);
        return (
          <label key={s} className={`${styles.check} ${!n && !on ? styles.off : ""}`}>
            <input
              type="checkbox"
              checked={on}
              disabled={!n && !on}
              onChange={() => toggleSector(s)}
            />
            <span>{t(SECTOR_LABEL[s])}</span>
            <span className={`${styles.n} num`}>{n}</span>
          </label>
        );
      })}
    </div>
  );

  const deals = (
    <div className={styles.segmented} role="group">
      {DEALS.map((d) => (
        <button
          key={d}
          type="button"
          className={`${styles.seg} ${filters.deal === d ? styles.segOn : ""}`}
          onClick={() => set({ deal: d, priceMin: undefined, priceMax: undefined })}
          aria-pressed={filters.deal === d}
        >
          {t(DEAL_LABEL[d])}
        </button>
      ))}
    </div>
  );

  const filtersButton = (badge: number) => (
    <button
      type="button"
      className={`${styles.control} ${styles.panelBtn} ${panelOpen ? styles.panelOn : ""}`}
      onClick={onTogglePanel}
      aria-expanded={panelOpen}
    >
      {t(UI.filters)}
      {badge > 0 && <span className={`${styles.badge} num`}>{badge}</span>}
    </button>
  );

  return (
    <div className={styles.wrap}>
      <div className="wrap">
        {/* desktop row */}
        <div className={styles.bar}>
          {deals}

          <label className={`${styles.selectWrap} ${styles.kindSelect}`}>
            <span className={styles.srOnly}>{t(UI.propertyType)}</span>
            <select
              className={styles.control}
              value={filters.kinds.length === 1 ? filters.kinds[0] : ""}
              onChange={(e) => set({ kinds: e.target.value ? [e.target.value as Kind] : [] })}
            >
              <option value="">
                {t(UI.allTypes)} ({count({ kinds: [] })})
              </option>
              {KIND_VALUES.map((k) => {
                const n = count({ kinds: [k] });
                return (
                  <option key={k} value={k} disabled={!n}>
                    {t(KIND_PLURAL[k])} ({n})
                  </option>
                );
              })}
            </select>
          </label>

          <div className={styles.pop} ref={locRef}>
            <button
              type="button"
              className={`${styles.control} ${locOpen ? styles.controlOn : ""}`}
              onClick={() => setLocOpen((v) => !v)}
              aria-expanded={locOpen}
            >
              {t(UI.location)}
              {filters.sectors.length > 0 && (
                <span className={`${styles.badge} num`}>{filters.sectors.length}</span>
              )}
            </button>

            {locOpen && (
              <div className={styles.popPanel}>
                <div className={styles.searchRow}>
                  <IconSearch size={18} className={styles.searchIcon} />
                  <input
                    type="search"
                    className={styles.search}
                    value={q}
                    placeholder={t(COPY.searchInside)}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>

                <div className={styles.groups}>
                  {sectorGroup(CITY_SECTOR_VALUES, t(UI.chisinau))}
                  {sectorGroup(SUBURB_SECTOR_VALUES, t(UI.suburbs))}
                </div>

                <div className={styles.popFoot}>
                  <button
                    type="button"
                    className="link"
                    onClick={() => set({ sectors: [] })}
                    disabled={!filters.sectors.length}
                  >
                    {t(COPY.clearLocation)}
                  </button>
                  <button type="button" className="link" onClick={() => setLocOpen(false)}>
                    {t(UI.close)}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.rooms} role="group" aria-label={t(COPY.roomsLabel)}>
            {ROOM_VALUES.map((r) => {
              const n = count({ rooms: [r] });
              const on = filters.rooms.includes(r);
              return (
                <button
                  key={r}
                  type="button"
                  className={`${styles.room} ${on ? styles.roomOn : ""}`}
                  disabled={!n && !on}
                  aria-pressed={on}
                  aria-label={`${r === 4 ? "4+" : r} ${t(COPY.roomsAria)} (${n})`}
                  onClick={() =>
                    set({
                      rooms: on ? filters.rooms.filter((v) => v !== r) : [...filters.rooms, r],
                    })
                  }
                >
                  {r === 4 ? t(COPY.roomsFour) : r}
                </button>
              );
            })}
          </div>

          <label className={`${styles.selectWrap} ${styles.priceSelect}`}>
            <span className={styles.srOnly}>{t(UI.price)}</span>
            <select
              className={styles.control}
              value={filters.priceMin ?? ""}
              onChange={(e) => set({ priceMin: e.target.value ? Number(e.target.value) : undefined })}
            >
              <option value="">{t(COPY.priceFrom)}</option>
              {steps
                .filter((v) => filters.priceMax === undefined || v < filters.priceMax)
                .map((v) => (
                  <option key={v} value={v}>
                    {money(v)}
                  </option>
                ))}
            </select>
          </label>

          <label className={`${styles.selectWrap} ${styles.priceSelect}`}>
            <span className={styles.srOnly}>{t(UI.price)}</span>
            <select
              className={styles.control}
              value={filters.priceMax ?? ""}
              onChange={(e) => set({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
            >
              <option value="">{t(COPY.priceTo)}</option>
              {steps
                .filter((v) => filters.priceMin === undefined || v > filters.priceMin)
                .map((v) => (
                  <option key={v} value={v}>
                    {money(v)}
                  </option>
                ))}
            </select>
          </label>

          {filtersButton(extra)}

          {active > 0 && (
            <button
              type="button"
              className={styles.reset}
              onClick={() => onChange({ ...filters, ...RESET, page: 1 })}
            >
              <IconClose size={16} />
              {t(UI.reset)}
            </button>
          )}
        </div>

        {/* phone row */}
        <div className={styles.barMobile}>
          {deals}
          {filtersButton(active)}
          {active > 0 && (
            <button
              type="button"
              className={styles.resetMobile}
              onClick={() => onChange({ ...filters, ...RESET, page: 1 })}
              aria-label={t(UI.reset)}
            >
              <IconClose size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Everything a visitor can set, back to nothing. The deal, sort and view stay. */
const RESET = {
  kinds: [],
  sectors: [],
  rooms: [],
  priceMin: undefined,
  priceMax: undefined,
  areaMin: undefined,
  areaMax: undefined,
  conditions: [],
  funds: [],
  baths: undefined,
  buildings: [],
  heatings: [],
  amenities: [],
  flags: [],
  agent: undefined,
  complex: undefined,
  noTopFloor: false,
  noGroundFloor: false,
  q: "",
} satisfies Partial<FilterState>;
