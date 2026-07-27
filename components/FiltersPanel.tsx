"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AGENTS } from "@/lib/agents";
import {
  AMENITY_LABEL,
  BUILDING_LABEL,
  CONDITION_LABEL,
  FLAG_LABEL,
  FUND_LABEL,
  HEATING_LABEL,
  KIND_PLURAL,
  SECTOR_LABEL,
  UI,
} from "@/lib/content";
import { formatArea, formatCount, formatPrice } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { Kind, Property } from "@/lib/types";
import { IconClose, IconSearch } from "./Icons";
import { complexName } from "@/lib/complexes";
import type { Filters as FilterState } from "./FiltersCore";
import {
  AMENITY_VALUES,
  AREA_STEPS,
  BATH_VALUES,
  BUILDING_VALUES,
  CITY_SECTOR_VALUES,
  clearExtraFilters,
  CONDITION_VALUES,
  countFor,
  FLAG_VALUES,
  FUND_VALUES,
  HEATING_VALUES,
  KIND_VALUES,
  priceSteps,
  ROOM_VALUES,
  SUBURB_SECTOR_VALUES,
} from "./FiltersCore";
import styles from "./FiltersPanel.module.css";

type Props = {
  filters: FilterState;
  base: Property[];
  total: number;
  onChange: (next: FilterState) => void;
  onClose: () => void;
};

const COPY = {
  title: { ro: "Mai multe filtre", ru: "Больше фильтров" },
  fund: { ro: "Fond locativ", ru: "Тип жилья" },
  condition: { ro: "Starea apartamentului", ru: "Состояние квартиры" },
  area: { ro: "Suprafață utilă", ru: "Полезная площадь" },
  baths: { ro: "Număr de băi", ru: "Санузлы" },
  floor: { ro: "Etaj", ru: "Этаж" },
  building: { ro: "Tip clădire", ru: "Тип дома" },
  heating: { ro: "Încălzire", ru: "Отопление" },
  agent: { ro: "Agent", ru: "Агент" },
  complex: { ro: "Ansamblu rezidențial", ru: "Жилой комплекс" },
  anyAgent: { ro: "Toți agenții", ru: "Все агенты" },
  anyComplex: { ro: "Toate ansamblurile", ru: "Все комплексы" },
  flags: { ro: "Marcaje", ru: "Отметки" },
  amenities: { ro: "Facilități", ru: "Удобства" },
  show: { ro: "Arată", ru: "Показать" },
  bathsAny: { ro: "Oricâte", ru: "Любое" },
  bathsThree: { ro: "3+", ru: "3+" },
};

export default function FiltersPanel({ filters, base, total, onChange, onClose }: Props) {
  const { t, lang } = useLang();

  // On a phone the panel covers the page; letting the results scroll behind it
  // makes the drawer feel like it belongs to another site.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1099px)");
    if (!mq.matches) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const [q, setQ] = useState(filters.q);
  const latest = useRef({ filters, onChange });

  useEffect(() => {
    latest.current = { filters, onChange };
  });

  useEffect(() => setQ(filters.q), [filters.q]);
  useEffect(() => {
    const { filters: f, onChange: fire } = latest.current;
    if (q === f.q) return;
    const id = setTimeout(() => fire({ ...f, q, page: 1 }), 350);
    return () => clearTimeout(id);
  }, [q]);

  const set = (next: Partial<FilterState>) => onChange({ ...filters, ...next, page: 1 });
  const count = (next: Partial<FilterState>) => countFor(base, filters, next);
  const steps = priceSteps(filters.deal);
  const money = (v: number) => formatPrice(v);

  const complexes = useMemo(() => {
    const found = new Set<string>();
    for (const p of base) if (p.complexSlug) found.add(p.complexSlug);
    return [...found].sort((a, b) => complexName(a).localeCompare(complexName(b)));
  }, [base]);

  const toggle = <V extends string>(list: V[], v: V): V[] =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  return (
    <div className={styles.band}>
      <div className={`wrap ${styles.panel}`} role="group" aria-label={t(COPY.title)}>
        <div className={styles.head}>
          <p className={styles.headTitle}>{t(COPY.title)}</p>
          <button type="button" className={styles.close} onClick={onClose} aria-label={t(UI.close)}>
            <IconClose />
          </button>
        </div>

        {/* On a phone the bar collapses to two buttons, so the primary filters
            move in here rather than disappearing. */}
        <div className={styles.basics}>
          <Block title={t(UI.search)}>
            <div className={styles.searchRow}>
              <IconSearch size={18} className={styles.searchIcon} />
              <input
                type="search"
                className={styles.search}
                value={q}
                placeholder={t(UI.searchPlaceholder)}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </Block>

          <Block title={t(UI.propertyType)}>
            <label className={styles.selectWrap}>
              <span className={styles.srOnly}>{t(UI.propertyType)}</span>
              <select
                className={styles.select}
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
          </Block>

          <Block title={t(UI.location)}>
            <div className={styles.sectors}>
              {[
                { title: t(UI.chisinau), values: CITY_SECTOR_VALUES },
                { title: t(UI.suburbs), values: SUBURB_SECTOR_VALUES },
              ].map((group) => (
                <div key={group.title}>
                  <p className={styles.groupTitle}>{group.title}</p>
                  {group.values.map((s) => {
                    const n = count({ sectors: [s] });
                    const on = filters.sectors.includes(s);
                    return (
                      <label key={s} className={styles.check}>
                        <input
                          type="checkbox"
                          checked={on}
                          disabled={!n && !on}
                          onChange={() => set({ sectors: toggle(filters.sectors, s) })}
                        />
                        <span>{t(SECTOR_LABEL[s])}</span>
                        <span className={`${styles.n} num`}>{n}</span>
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          </Block>

          <Block title={t(UI.rooms)}>
            <div className={styles.chips}>
              {ROOM_VALUES.map((r) => (
                <Chip
                  key={r}
                  label={r === 4 ? "4+" : String(r)}
                  n={count({ rooms: [r] })}
                  on={filters.rooms.includes(r)}
                  onClick={() =>
                    set({
                      rooms: filters.rooms.includes(r)
                        ? filters.rooms.filter((v) => v !== r)
                        : [...filters.rooms, r],
                    })
                  }
                />
              ))}
            </div>
          </Block>

          <Block title={t(UI.price)}>
            <div className={styles.pair}>
              <label className={styles.selectWrap}>
                <span className={styles.srOnly}>{t(UI.noMin)}</span>
                <select
                  className={styles.select}
                  value={filters.priceMin ?? ""}
                  onChange={(e) =>
                    set({ priceMin: e.target.value ? Number(e.target.value) : undefined })
                  }
                >
                  <option value="">{t(UI.noMin)}</option>
                  {steps
                    .filter((v) => filters.priceMax === undefined || v < filters.priceMax)
                    .map((v) => (
                      <option key={v} value={v}>
                        {money(v)}
                      </option>
                    ))}
                </select>
              </label>

              <label className={styles.selectWrap}>
                <span className={styles.srOnly}>{t(UI.noMax)}</span>
                <select
                  className={styles.select}
                  value={filters.priceMax ?? ""}
                  onChange={(e) =>
                    set({ priceMax: e.target.value ? Number(e.target.value) : undefined })
                  }
                >
                  <option value="">{t(UI.noMax)}</option>
                  {steps
                    .filter((v) => filters.priceMin === undefined || v > filters.priceMin)
                    .map((v) => (
                      <option key={v} value={v}>
                        {money(v)}
                      </option>
                    ))}
                </select>
              </label>
            </div>
          </Block>
        </div>

        <div className={styles.grid}>
          <div className={styles.col}>
            <Block title={t(COPY.fund)}>
              <div className={styles.chips}>
                {FUND_VALUES.map((v) => (
                  <Chip
                    key={v}
                    label={t(FUND_LABEL[v])}
                    n={count({ funds: [v] })}
                    on={filters.funds.includes(v)}
                    onClick={() => set({ funds: toggle(filters.funds, v) })}
                  />
                ))}
              </div>
            </Block>

            <Block title={t(COPY.condition)}>
              <div className={styles.chips}>
                {CONDITION_VALUES.map((v) => (
                  <Chip
                    key={v}
                    label={t(CONDITION_LABEL[v])}
                    n={count({ conditions: [v] })}
                    on={filters.conditions.includes(v)}
                    onClick={() => set({ conditions: toggle(filters.conditions, v) })}
                  />
                ))}
              </div>
            </Block>
          </div>

          <div className={styles.col}>
            <Block title={t(COPY.area)}>
              <div className={styles.pair}>
                <label className={styles.selectWrap}>
                  <span className={styles.srOnly}>{t(UI.area)}</span>
                  <select
                    className={styles.select}
                    value={filters.areaMin ?? ""}
                    onChange={(e) =>
                      set({ areaMin: e.target.value ? Number(e.target.value) : undefined })
                    }
                  >
                    <option value="">{t(UI.anyArea)}</option>
                    {AREA_STEPS.filter((v) => filters.areaMax === undefined || v < filters.areaMax).map(
                      (v) => (
                        <option key={v} value={v}>
                          {formatArea(v, lang)}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label className={styles.selectWrap}>
                  <span className={styles.srOnly}>{t(UI.area)}</span>
                  <select
                    className={styles.select}
                    value={filters.areaMax ?? ""}
                    onChange={(e) =>
                      set({ areaMax: e.target.value ? Number(e.target.value) : undefined })
                    }
                  >
                    <option value="">{t(UI.anyArea)}</option>
                    {AREA_STEPS.filter((v) => filters.areaMin === undefined || v > filters.areaMin).map(
                      (v) => (
                        <option key={v} value={v}>
                          {formatArea(v, lang)}
                        </option>
                      )
                    )}
                  </select>
                </label>
              </div>
            </Block>

            <Block title={t(COPY.baths)}>
              <div className={styles.chips}>
                <Chip
                  label={t(COPY.bathsAny)}
                  on={filters.baths === undefined}
                  onClick={() => set({ baths: undefined })}
                />
                {BATH_VALUES.map((v) => (
                  <Chip
                    key={v}
                    label={v === 3 ? t(COPY.bathsThree) : String(v)}
                    n={count({ baths: v })}
                    on={filters.baths === v}
                    onClick={() => set({ baths: filters.baths === v ? undefined : v })}
                  />
                ))}
              </div>
            </Block>

            <Block title={t(COPY.floor)}>
              <label className={styles.check}>
                <input
                  type="checkbox"
                  checked={filters.noTopFloor}
                  onChange={() => set({ noTopFloor: !filters.noTopFloor })}
                />
                <span>{t(UI.excludeTopFloor)}</span>
                <span className={`${styles.n} num`}>{count({ noTopFloor: true })}</span>
              </label>
              <label className={styles.check}>
                <input
                  type="checkbox"
                  checked={filters.noGroundFloor}
                  onChange={() => set({ noGroundFloor: !filters.noGroundFloor })}
                />
                <span>{t(UI.excludeGroundFloor)}</span>
                <span className={`${styles.n} num`}>{count({ noGroundFloor: true })}</span>
              </label>
            </Block>
          </div>

          <div className={styles.col}>
            <Block title={t(COPY.building)}>
              <div className={styles.chips}>
                {BUILDING_VALUES.map((v) => (
                  <Chip
                    key={v}
                    label={t(BUILDING_LABEL[v])}
                    n={count({ buildings: [v] })}
                    on={filters.buildings.includes(v)}
                    onClick={() => set({ buildings: toggle(filters.buildings, v) })}
                  />
                ))}
              </div>
            </Block>

            <Block title={t(COPY.heating)}>
              <div className={styles.chips}>
                {HEATING_VALUES.map((v) => (
                  <Chip
                    key={v}
                    label={t(HEATING_LABEL[v])}
                    n={count({ heatings: [v] })}
                    on={filters.heatings.includes(v)}
                    onClick={() => set({ heatings: toggle(filters.heatings, v) })}
                  />
                ))}
              </div>
            </Block>
          </div>

          <div className={styles.col}>
            <Block title={t(COPY.agent)}>
              <label className={styles.selectWrap}>
                <span className={styles.srOnly}>{t(COPY.agent)}</span>
                <select
                  className={styles.select}
                  value={filters.agent ?? ""}
                  onChange={(e) => set({ agent: e.target.value || undefined })}
                >
                  <option value="">{t(COPY.anyAgent)}</option>
                  {AGENTS.map((a) => {
                    const n = count({ agent: a.slug });
                    return (
                      <option key={a.slug} value={a.slug} disabled={!n}>
                        {a.name} ({n})
                      </option>
                    );
                  })}
                </select>
              </label>
            </Block>

            <Block title={t(COPY.complex)}>
              <label className={styles.selectWrap}>
                <span className={styles.srOnly}>{t(COPY.complex)}</span>
                <select
                  className={styles.select}
                  value={filters.complex ?? ""}
                  onChange={(e) => set({ complex: e.target.value || undefined })}
                >
                  <option value="">{t(COPY.anyComplex)}</option>
                  {complexes.map((slug) => {
                    const n = count({ complex: slug });
                    return (
                      <option key={slug} value={slug} disabled={!n}>
                        {complexName(slug)} ({n})
                      </option>
                    );
                  })}
                </select>
              </label>
            </Block>

            <Block title={t(COPY.flags)}>
              {FLAG_VALUES.map((v) => (
                <label key={v} className={styles.check}>
                  <input
                    type="checkbox"
                    checked={filters.flags.includes(v)}
                    onChange={() => set({ flags: toggle(filters.flags, v) })}
                  />
                  <span>{t(FLAG_LABEL[v])}</span>
                  <span className={`${styles.n} num`}>{count({ flags: [v] })}</span>
                </label>
              ))}
            </Block>
          </div>
        </div>

        <Block title={t(COPY.amenities)}>
          <div className={styles.chips}>
            {AMENITY_VALUES.map((v) => (
              <Chip
                key={v}
                label={t(AMENITY_LABEL[v])}
                n={count({ amenities: [...filters.amenities, v] })}
                on={filters.amenities.includes(v)}
                onClick={() => set({ amenities: toggle(filters.amenities, v) })}
              />
            ))}
          </div>
        </Block>

        <div className={styles.foot}>
          <button
            type="button"
            className="link"
            onClick={() => onChange(clearExtraFilters(filters))}
          >
            {t(UI.resetFilters)}
          </button>
          <p className={`${styles.total} num`}>
            {formatCount(total, t(UI.propertiesOne), t(UI.properties), lang)}
          </p>
          <button type="button" className="link" onClick={onClose}>
            {t(UI.close)}
          </button>
        </div>

        <div className={styles.stickyFoot}>
          <button type="button" className={`btn ${styles.showBtn}`} onClick={onClose}>
            {t(COPY.show)} {formatCount(total, t(UI.propertiesOne), t(UI.properties), lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.block}>
      <p className={styles.blockTitle}>{title}</p>
      {children}
    </div>
  );
}

function Chip({
  label,
  n,
  on,
  onClick,
}: {
  label: string;
  n?: number;
  on: boolean;
  onClick: () => void;
}) {
  const dead = n === 0 && !on;
  return (
    <button
      type="button"
      className={`${styles.chip} ${on ? styles.chipOn : ""}`}
      onClick={onClick}
      disabled={dead}
      aria-pressed={on}
    >
      {label}
      {n !== undefined && <span className={`${styles.n} num`}>{n}</span>}
    </button>
  );
}
