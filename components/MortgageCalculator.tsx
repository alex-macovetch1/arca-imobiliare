"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice, formatRent, toMDL } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { Lang, T } from "@/lib/types";
import styles from "./MortgageCalculator.module.css";

const M = {
  price: { ro: "Prețul proprietății", ru: "Стоимость объекта" },
  down: { ro: "Avans", ru: "Первоначальный взнос" },
  term: { ro: "Termen", ru: "Срок" },
  rate: { ro: "Dobândă anuală", ru: "Годовая ставка" },
  monthly: { ro: "Rata lunară", ru: "Ежемесячный платёж" },
  loan: { ro: "Suma creditului", ru: "Сумма кредита" },
  total: { ro: "Total de plată", ru: "Всего к выплате" },
  interest: { ro: "Total dobândă", ru: "Переплата по процентам" },
  income: { ro: "Venit lunar recomandat", ru: "Рекомендуемый доход в месяц" },
  full: { ro: "Calculator complet", ru: "Полный калькулятор" },
  note: {
    ro: "Calculul este orientativ și nu constituie ofertă de creditare. Băncile din Moldova cer de regulă un avans de minimum 15% și o rată care nu depășește 40% din venitul lunar.",
    ru: "Расчёт ориентировочный и не является кредитным предложением. Банки Молдовы обычно требуют первоначальный взнос от 15% и платёж не выше 40% ежемесячного дохода.",
  },
  rateNote: { ro: "% pe an", ru: "% годовых" },
} satisfies Record<string, T>;

/** "25 ani" / "25 лет" — Russian picks one of three forms, Romanian adds "de". */
function years(n: number, lang: Lang): string {
  if (lang === "ro") return n >= 20 ? `${n} de ani` : `${n} ani`;
  const last = n % 10;
  const teen = n % 100 >= 11 && n % 100 <= 14;
  if (!teen && last === 1) return `${n} год`;
  if (!teen && last >= 2 && last <= 4) return `${n} года`;
  return `${n} лет`;
}

type Props = {
  /** Asking price in EUR; the calculator starts from it and stays editable. */
  price: number;
  /** Off on /credit itself, where the link would point at the current page. */
  fullLink?: boolean;
};

export default function MortgageCalculator({ price, fullLink = true }: Props) {
  const { t, lang } = useLang();

  const [amount, setAmount] = useState(String(price));
  const [downPct, setDownPct] = useState(20);
  const [term, setTerm] = useState(25);
  const [rate, setRate] = useState("7.25");

  const result = useMemo(() => {
    const total = Math.max(0, Number(amount) || 0);
    const down = Math.round((total * downPct) / 100);
    const loan = Math.max(0, total - down);
    const r = (Number(rate) || 0) / 100 / 12;
    const n = term * 12;
    const monthly = r > 0 ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n;
    const paid = monthly * n;
    return {
      down,
      loan,
      monthly: Math.round(monthly),
      paid: Math.round(paid),
      interest: Math.round(paid - loan),
      income: Math.round(monthly / 0.4),
    };
  }, [amount, downPct, term, rate]);

  return (
    <div className={styles.card}>
      <div className={styles.controls}>
        <label className={styles.field}>
          <span className={styles.label}>{t(M.price)}</span>
          <span className={styles.inputWrap}>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={500}
              className={`field num ${styles.input}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span className={styles.suffix}>€</span>
          </span>
        </label>

        <div className={styles.field}>
          <span className={styles.row}>
            <label htmlFor="mc-down" className={styles.label}>
              {t(M.down)}
            </label>
            <span className={`num ${styles.value}`}>
              {downPct}% · {formatPrice(result.down)}
            </span>
          </span>
          <input
            id="mc-down"
            type="range"
            min={10}
            max={50}
            step={5}
            className={styles.range}
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.row}>
            <label htmlFor="mc-term" className={styles.label}>
              {t(M.term)}
            </label>
            <span className={`num ${styles.value}`}>{years(term, lang)}</span>
          </span>
          <input
            id="mc-term"
            type="range"
            min={5}
            max={30}
            step={1}
            className={styles.range}
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
          />
        </div>

        <label className={styles.field}>
          <span className={styles.label}>{t(M.rate)}</span>
          <span className={styles.inputWrap}>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={25}
              step={0.05}
              className={`field num ${styles.input}`}
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
            <span className={styles.suffix}>{t(M.rateNote)}</span>
          </span>
        </label>
      </div>

      <div className={styles.result}>
        <p className="kicker">{t(M.monthly)}</p>
        <p className={`num ${styles.big}`}>{formatRent(result.monthly, lang)}</p>
        <p className={`num ${styles.mdl}`}>{toMDL(result.monthly)}</p>

        <dl className={styles.lines}>
          <div className={styles.line}>
            <dt>{t(M.loan)}</dt>
            <dd className="num">{formatPrice(result.loan)}</dd>
          </div>
          <div className={styles.line}>
            <dt>{t(M.total)}</dt>
            <dd className="num">{formatPrice(result.paid)}</dd>
          </div>
          <div className={styles.line}>
            <dt>{t(M.interest)}</dt>
            <dd className="num">{formatPrice(result.interest)}</dd>
          </div>
          <div className={styles.line}>
            <dt>{t(M.income)}</dt>
            <dd className="num">{formatRent(result.income, lang)}</dd>
          </div>
        </dl>

        {fullLink && (
          <Link href="/credit" className={`link ${styles.full}`}>
            {t(M.full)}
          </Link>
        )}
        <p className={`legal ${styles.note}`}>{t(M.note)}</p>
      </div>
    </div>
  );
}
