"use client";

import { useEffect, useRef, useState } from "react";
import { DEAL_LABEL, KIND_PLURAL, SECTOR_LABEL, UI } from "@/lib/content";
import { formatPrice, formatRent } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { Deal, Kind, Property, Sector, T } from "@/lib/types";
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

type PopId = "tip" | "loc" | "pret";

const DEALS: Deal[] = ["vanzare", "chirie"];

/** Under this width a pill hands its choices to the full-screen panel instead
    of opening a dropdown the scrolling row would clip. */
const PHONE = "(max-width: 1099px)";

const COPY = {
  roomsLabel: { ro: "Camere", ru: "Комнаты" },
  roomsFour: { ro: "4+", ru: "4+" },
  searchInside: { ro: "Stradă, complex sau cod ofertă", ru: "Улица, комплекс или код объявления" },
  clearLocation: { ro: "Șterge locațiile", ru: "Очистить" },
  roomsAria: { ro: "camere", ru: "комнат" },
  from: { ro: "de la", ru: "от" },
  to: { ro: "până în", ru: "до" },
  fromTitle: { ro: "De la", ru: "От" },
  toTitle: { ro: "Până în", ru: "До" },
  anyBound: { ro: "Oricât", ru: "Любая" },
  clearPrice: { ro: "Șterge prețul", ru: "Сбросить цену" },
};

const Sliders = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M3 8h4M11 8h10M3 16h10M17 16h4" />
    <circle cx="9" cy="8" r="2" />
    <circle cx="15" cy="16" r="2" />
  </svg>
);

const Check = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 12.5l5.5 5.5L20 6.5" />
  </svg>
);

export default function Filters({ filters, base, onChange, panelOpen, onTogglePanel }: Props) {
  const { t, lang } = useLang();
  const [pop, setPop] = useState<PopId | null>(null);
  const [q, setQ] = useState(filters.q);
  const popRef = useRef<HTMLDivElement>(null);
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
    if (!pop) return;
    const close = () => setPop(null);
    const onDown = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
    };
  }, [pop]);

  const set = (next: Partial<FilterState>) => onChange({ ...filters, ...next, page: 1 });
  const count = (next: Partial<FilterState>) => countFor(base, filters, next);
  const steps = priceSteps(filters.deal);
  const active = activeCount(filters);
  const extra = extraCount(filters);

  const money = (v: number) => (filters.deal === "chirie" ? formatRent(v, lang) : formatPrice(v));

  const togglePop = (id: PopId) => {
    if (typeof window !== "undefined" && window.matchMedia(PHONE).matches) {
      if (!panelOpen) onTogglePanel();
      return;
    }
    setPop((v) => (v === id ? null : id));
  };

  /* ---- what each pill says once it carries a choice ---- */

  const kindOn = filters.kinds.length === 1 ? filters.kinds[0] : null;
  const kindLabel: T | null = kindOn ? KIND_PLURAL[kindOn] : null;

  const locLabel: T | null = filters.sectors.length
    ? filters.sectors.length === 1
      ? SECTOR_LABEL[filters.sectors[0]]
      : {
          ro: `${t(SECTOR_LABEL[filters.sectors[0]])} +${filters.sectors.length - 1}`,
          ru: `${t(SECTOR_LABEL[filters.sectors[0]])} +${filters.sectors.length - 1}`,
        }
    : filters.q.trim()
      ? { ro: `„${filters.q}”`, ru: `«${filters.q}»` }
      : null;

  const priceLabel: T | null =
    filters.priceMin !== undefined && filters.priceMax !== undefined
      ? { ro: `${money(filters.priceMin)} – ${money(filters.priceMax)}`, ru: `${money(filters.priceMin)} – ${money(filters.priceMax)}` }
      : filters.priceMin !== undefined
        ? { ro: `${t(COPY.from)} ${money(filters.priceMin)}`, ru: `${t(COPY.from)} ${money(filters.priceMin)}` }
        : filters.priceMax !== undefined
          ? { ro: `${t(COPY.to)} ${money(filters.priceMax)}`, ru: `${t(COPY.to)} ${money(filters.priceMax)}` }
          : null;

  const roomsOn = [...filters.rooms].sort((a, b) => a - b);

  const pill = (id: PopId, label: T | null, fallback: T) => (
    <button
      type="button"
      className={`${styles.pill} ${label ? styles.pillOn : ""} ${pop === id ? styles.pillOpen : ""}`}
      onClick={() => togglePop(id)}
      aria-expanded={pop === id}
      aria-haspopup="true"
    >
      <span className={styles.pillText}>{label ? t(label) : t(fallback)}</span>
      <span className={styles.caret} aria-hidden="true" />
    </button>
  );

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
              onChange={() =>
                set({
                  sectors: on
                    ? filters.sectors.filter((v) => v !== s)
                    : [...filters.sectors, s],
                })
              }
            />
            <span>{t(SECTOR_LABEL[s])}</span>
            <span className={`${styles.n} num`}>{n}</span>
          </label>
        );
      })}
    </div>
  );

  const priceColumn = (bound: "min" | "max") => {
    const value = bound === "min" ? filters.priceMin : filters.priceMax;
    const usable = steps.filter((v) =>
      bound === "min"
        ? filters.priceMax === undefined || v < filters.priceMax
        : filters.priceMin === undefined || v > filters.priceMin
    );
    return (
      <div className={styles.group}>
        <p className={styles.groupTitle}>{t(bound === "min" ? COPY.fromTitle : COPY.toTitle)}</p>
        <div className={styles.optionScroll}>
          <button
            type="button"
            className={`${styles.option} ${value === undefined ? styles.optionOn : ""}`}
            onClick={() => set(bound === "min" ? { priceMin: undefined } : { priceMax: undefined })}
          >
            <span>{t(COPY.anyBound)}</span>
            {value === undefined && <Check />}
          </button>
          {usable.map((v) => (
            <button
              key={v}
              type="button"
              className={`${styles.option} ${value === v ? styles.optionOn : ""} num`}
              onClick={() => set(bound === "min" ? { priceMin: v } : { priceMax: v })}
            >
              {/* Plain amounts in the list: the deal pill already says whether
                  this is a sale or a rent, and the column is narrow. */}
              <span>{formatPrice(v)}</span>
              {value === v && <Check />}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.shell}>
      <div className="wrap">
        <div className={styles.bar}>
          {/* deal — a mode, not a filter, so it keeps its own segmented pill */}
          <div className={`${styles.seg} ${styles.segDeal}`} role="group">
            <span
              className={styles.segInd}
              style={{ "--i": DEALS.indexOf(filters.deal) } as React.CSSProperties}
              aria-hidden="true"
            />
            {DEALS.map((d) => (
              <button
                key={d}
                type="button"
                className={`${styles.segBtn} ${filters.deal === d ? styles.segBtnOn : ""}`}
                onClick={() => set({ deal: d, priceMin: undefined, priceMax: undefined })}
                aria-pressed={filters.deal === d}
              >
                {t(DEAL_LABEL[d])}
              </button>
            ))}
          </div>

          {/* type */}
          <div className={styles.pop} ref={pop === "tip" ? popRef : null}>
            {pill("tip", kindLabel, UI.allTypes)}
            {pop === "tip" && (
              <div className={`${styles.popPanel} ${styles.popNarrow}`}>
                <button
                  type="button"
                  className={`${styles.option} ${!kindOn ? styles.optionOn : ""}`}
                  onClick={() => {
                    set({ kinds: [] });
                    setPop(null);
                  }}
                >
                  <span>{t(UI.allTypes)}</span>
                  <span className={`${styles.n} num`}>{count({ kinds: [] })}</span>
                </button>
                {KIND_VALUES.map((k) => {
                  const n = count({ kinds: [k] });
                  const on = kindOn === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      className={`${styles.option} ${on ? styles.optionOn : ""}`}
                      disabled={!n && !on}
                      onClick={() => {
                        set({ kinds: on ? [] : [k as Kind] });
                        setPop(null);
                      }}
                    >
                      <span>{t(KIND_PLURAL[k])}</span>
                      <span className={`${styles.n} num`}>{n}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* location */}
          <div className={styles.pop} ref={pop === "loc" ? popRef : null}>
            {pill("loc", locLabel, UI.location)}
            {pop === "loc" && (
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
                  <button type="button" className="link" onClick={() => setPop(null)}>
                    {t(UI.close)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* rooms — one indicator per chosen figure, so a change slides */}
          <div className={`${styles.seg} ${styles.segRooms}`} role="group" aria-label={t(COPY.roomsLabel)}>
            {roomsOn.map((r, i) => (
              <span
                key={i}
                className={styles.segInd}
                style={{ "--i": ROOM_VALUES.indexOf(r) } as React.CSSProperties}
                aria-hidden="true"
              />
            ))}
            {ROOM_VALUES.map((r) => {
              const n = count({ rooms: [r] });
              const on = filters.rooms.includes(r);
              return (
                <button
                  key={r}
                  type="button"
                  className={`${styles.segBtn} ${styles.roomBtn} ${on ? styles.segBtnOn : ""}`}
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

          {/* price */}
          <div className={styles.pop} ref={pop === "pret" ? popRef : null}>
            {pill("pret", priceLabel, UI.price)}
            {pop === "pret" && (
              <div className={`${styles.popPanel} ${styles.popPrice}`}>
                <div className={styles.groups}>
                  {priceColumn("min")}
                  {priceColumn("max")}
                </div>
                <div className={styles.popFoot}>
                  <button
                    type="button"
                    className="link"
                    onClick={() => set({ priceMin: undefined, priceMax: undefined })}
                    disabled={filters.priceMin === undefined && filters.priceMax === undefined}
                  >
                    {t(COPY.clearPrice)}
                  </button>
                  <button type="button" className="link" onClick={() => setPop(null)}>
                    {t(UI.close)}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className={`${styles.pill} ${styles.panelBtn} ${panelOpen ? styles.pillOn : ""}`}
            onClick={onTogglePanel}
            aria-expanded={panelOpen}
          >
            <Sliders />
            <span className={styles.pillText}>{t(UI.filters)}</span>
            {extra > 0 && <span className={`${styles.badge} num`}>{extra}</span>}
          </button>

          {active > 0 && (
            <button
              type="button"
              className={styles.reset}
              onClick={() => onChange({ ...filters, ...RESET, page: 1 })}
            >
              <IconClose size={15} />
              {t(UI.clearAll)}
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
