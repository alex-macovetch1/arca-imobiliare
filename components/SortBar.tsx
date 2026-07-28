"use client";

import { useEffect, useRef, useState } from "react";
import { UI } from "@/lib/content";
import { formatCount } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { SortKey, ViewKey } from "./FiltersCore";
import { SORT_VALUES } from "./FiltersCore";
import styles from "./SortBar.module.css";

type Props = {
  total: number;
  sort: SortKey;
  view: ViewKey;
  onSort: (s: SortKey) => void;
  onView: (v: ViewKey) => void;
};

const SORT_LABEL: Record<SortKey, { ro: string; ru: string }> = {
  nou: UI.sortNewest,
  "pret-asc": UI.sortPriceAsc,
  "pret-desc": UI.sortPriceDesc,
  "epm-asc": UI.sortSqmAsc,
  "supraf-desc": UI.sortAreaDesc,
};

const MAP_VIEW = { ro: "Hartă", ru: "Карта" };

const VIEW_LABEL: Record<ViewKey, { ro: string; ru: string }> = {
  grila: UI.gridView,
  lista: UI.listView,
  harta: MAP_VIEW,
};

const VIEW_KEYS: ViewKey[] = ["grila", "lista", "harta"];

const icon = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

const VIEW_ICON: Record<ViewKey, React.ReactNode> = {
  grila: (
    <svg {...icon}>
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
    </svg>
  ),
  lista: (
    <svg {...icon}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  harta: (
    <svg {...icon}>
      <path d="M9 4L4 6v14l5-2 6 2 5-2V4l-5 2-6-2zM9 4v14M15 6v14" />
    </svg>
  ),
};

/**
 * A filter that returns a different number has to look like it did something.
 * The figure runs to its new value instead of swapping.
 */
function useCountUp(value: number, ms: number): number {
  const [shown, setShown] = useState(value);
  const current = useRef(value);

  useEffect(() => {
    const start = current.current;
    if (start === value) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      current.current = value;
      setShown(value);
      return;
    }

    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = Math.round(start + (value - start) * eased);
      current.current = next;
      setShown(next);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);

  return shown;
}

export default function SortBar({ total, sort, view, onSort, onView }: Props) {
  const { t, lang } = useLang();
  const running = useCountUp(total, 250);

  return (
    <div className={styles.row}>
      <p className={styles.count}>
        <span key={total} className={`${styles.countNum} num`} aria-hidden="true">
          {formatCount(running, t(UI.propertiesOne), t(UI.properties), lang)}
        </span>
        <span className={styles.srOnly} aria-live="polite">
          {formatCount(total, t(UI.propertiesOne), t(UI.properties), lang)}
        </span>
      </p>

      <div className={styles.tools}>
        <label className={styles.sort}>
          <span className={styles.srOnly}>{t(UI.sort)}</span>
          <select
            className={styles.select}
            value={sort}
            onChange={(e) => onSort(e.target.value as SortKey)}
          >
            {SORT_VALUES.map((s) => (
              <option key={s} value={s}>
                {t(SORT_LABEL[s])}
              </option>
            ))}
          </select>
          <span className={styles.caret} aria-hidden="true" />
        </label>

        <div className={styles.views} role="group" aria-label={t(UI.listView)}>
          <span
            className={styles.viewInd}
            style={{ "--i": VIEW_KEYS.indexOf(view) } as React.CSSProperties}
            aria-hidden="true"
          />
          {VIEW_KEYS.map((v) => (
            <button
              key={v}
              type="button"
              className={`${styles.view} ${view === v ? styles.viewOn : ""}`}
              onClick={() => onView(v)}
              aria-pressed={view === v}
              title={t(VIEW_LABEL[v])}
            >
              {VIEW_ICON[v]}
              <span className={styles.viewText}>{t(VIEW_LABEL[v])}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
