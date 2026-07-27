"use client";

import { useEffect, useRef, useState } from "react";
import { AGENCY } from "@/lib/content";
import { useLang } from "@/lib/lang";
import type { T } from "@/lib/types";
import styles from "./Stats.module.css";

type Figure = { value: number; suffix?: T; label: T };

/**
 * Counts from zero the first time the band enters the viewport. The final
 * figure is what renders on the server, so the numbers are in the HTML for a
 * reader without JavaScript — the count-up is decoration layered on top.
 */
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    setShown(0);

    let raf = 0;
    let start = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const step = (ts: number) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / 1200, 1);
          // Cubic ease-out: the last digits settle instead of snapping.
          setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className="num">
      {shown}
    </span>
  );
}

export default function Stats({ properties }: { properties: number }) {
  const { t } = useLang();

  const figures: Figure[] = [
    {
      value: AGENCY.stats.years,
      label: { ro: "ani pe piața din Chișinău", ru: "лет на рынке Кишинёва" },
    },
    {
      value: properties,
      label: { ro: "proprietăți în portofoliu", ru: "объектов в портфеле" },
    },
    {
      value: AGENCY.stats.deals2025,
      label: { ro: "tranzacții în 2025", ru: "сделок в 2025 году" },
    },
    {
      value: AGENCY.stats.replyMinutes,
      suffix: { ro: "min", ru: "мин" },
      label: { ro: "timp mediu de răspuns", ru: "среднее время ответа" },
    },
  ];

  return (
    <section className={`${styles.band} sec`}>
      <div className="wrap">
        <div className={`${styles.top} rv`}>
          <div>
            <p className="kicker kicker-dark">{t({ ro: "De ce ARCA", ru: "Почему ARCA" })}</p>
            <h2 className={styles.title}>
              {t({ ro: "Cifre, nu promisiuni", ru: "Цифры, а не обещания" })}
            </h2>
          </div>
          <p className={styles.lead}>
            {t({
              ro: "Lucrăm cu un portofoliu pe care îl fotografiem și îl verificăm noi, act cu act. De aceea îl ținem mic și de aceea știm pe de rost fiecare bloc din el.",
              ru: "Мы работаем с портфелем, который сами снимаем и сами проверяем — документ за документом. Поэтому он небольшой, и поэтому мы знаем в нём каждый дом наизусть.",
            })}
          </p>
        </div>

        <div className={styles.figures}>
          {figures.map((f, i) => (
            <div
              key={f.label.ro}
              className={`${styles.fig} rv`}
              style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
            >
              <p className={styles.value}>
                <Counter value={f.value} />
                {f.suffix && <span className={styles.suffix}>{t(f.suffix)}</span>}
              </p>
              <p className={styles.label}>{t(f.label)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
