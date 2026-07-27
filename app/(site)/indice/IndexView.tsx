"use client";

import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { INDEX_DISCLAIMER, SECTOR_IN, SECTOR_LABEL, UI } from "@/lib/content";
import { formatCount, formatDate, formatPrice, formatPricePerSqm, formatRent } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { IndexRow, PriceBand, RentStat } from "@/lib/market-index";
import { SECTOR_BY_SLUG } from "@/lib/sectors";
import type { T } from "@/lib/types";
import styles from "./index.module.css";

const C = {
  kicker: { ro: "Indicele ARCA", ru: "Индекс ARCA" },
  title: {
    ro: "Cât costă metrul pătrat, pe sectoare",
    ru: "Сколько стоит квадратный метр, по секторам",
  },
  lead: {
    ro: "Publicăm cifrele cu care lucrăm noi. Fiecare rând este mediana ofertelor active din portofoliul ARCA din sectorul respectiv — atât cât se cere astăzi, nu cât s-a vândut acum un an.",
    ru: "Мы публикуем те же цифры, с которыми работаем сами. Каждая строка — медиана активных предложений портфеля ARCA по сектору: столько просят сегодня, а не столько продали год назад.",
  },
  city: { ro: "Media pe oraș", ru: "В среднем по городу" },
  cityNote: {
    ro: "Mediana tuturor apartamentelor și caselor de vânzare din portofoliu.",
    ru: "Медиана всех квартир и домов портфеля, выставленных на продажу.",
  },
  rentCity: { ro: "Chirie mediană", ru: "Медианная аренда" },
  band: { ro: "Interval uzual", ru: "Обычный диапазон" },
  bandNote: {
    ro: "Bara arată intervalul în care intră jumătatea din mijloc a ofertelor; linia verticală este mediana.",
    ru: "Полоса показывает диапазон средней половины предложений; вертикальная линия — медиана.",
  },
  sector: { ro: "Sector", ru: "Сектор" },
  medianCol: { ro: "Mediana €/m²", ru: "Медиана €/м²" },
  rentCol: { ro: "Chirie", ru: "Аренда" },
  offersCol: { ro: "Oferte active", ru: "Активных предложений" },
  thin: { ro: "Prea puține oferte", ru: "Слишком мало предложений" },
  thinNote: {
    ro: "Cu o singură ofertă activă nu publicăm mediană: ar fi un preț, nu un indice. Sunați și vă spunem la telefon ce se cere acolo.",
    ru: "С одним активным предложением медиану не публикуем: это была бы цена, а не индекс. Позвоните — скажем по телефону, сколько там просят.",
  },
  method: { ro: "Cum calculăm", ru: "Как мы считаем" },
  methodHeading: {
    ro: "Patru reguli, aceleași în fiecare lună",
    ru: "Четыре правила, одни и те же каждый месяц",
  },
  methodSteps: [
    {
      ro: "Luăm toate apartamentele și casele de vânzare active din portofoliul ARCA și împărțim prețul cerut la suprafața utilă.",
      ru: "Берём все активные квартиры и дома портфеля ARCA, выставленные на продажу, и делим запрашиваемую цену на общую площадь.",
    },
    {
      ro: "Pentru fiecare sector calculăm mediana și intervalul în care intră jumătatea din mijloc a ofertelor. Sectoarele cu o singură ofertă activă rămân fără cifră, iar numărul de oferte din spatele fiecărei mediane e scris lângă ea.",
      ru: "По каждому сектору считаем медиану и диапазон, в который попадает средняя половина предложений. Секторы с одним активным предложением остаются без цифры, а количество предложений за каждой медианой написано рядом с ней.",
    },
    {
      ro: "Terenurile, spațiile comerciale și birourile nu intră în calcul: au altă logică de preț și ar deforma banda locativă.",
      ru: "Участки, коммерческие помещения и офисы в расчёт не входят: у них другая логика цены, и они исказили бы жилой диапазон.",
    },
    {
      ro: "Cifra se schimbă odată cu portofoliul, la fiecare listare nouă sau vândută. Nu o rotunjim în sus și nu o ajustăm după sezon.",
      ru: "Цифра меняется вместе с портфелем, с каждым новым или проданным объектом. Мы не округляем её вверх и не подгоняем под сезон.",
    },
  ] as T[],
  useTitle: { ro: "Ce puteți face cu cifrele astea", ru: "Что делать с этими цифрами" },
  sellCard: {
    ro: "Aveți un apartament de vândut",
    ru: "У вас есть квартира на продажу",
  },
  sellText: {
    ro: "Estimatorul de pe pagina de vânzare pornește de la aceste benzi și adaugă starea, numărul de camere și suprafața. Rezultatul e un interval, nu un preț rotund.",
    ru: "Оценщик на странице продажи стартует от этих диапазонов и добавляет состояние, число комнат и площадь. Результат — интервал, а не круглая цифра.",
  },
  sellLink: { ro: "Estimează apartamentul", ru: "Оценить квартиру" },
  buyCard: { ro: "Căutați ceva de cumpărat", ru: "Вы ищете, что купить" },
  buyText: {
    ro: "Fiecare rând din tabel duce direct la ofertele active din sectorul respectiv, cu prețul pe metru pătrat afișat pe fiecare card.",
    ru: "Каждая строка таблицы ведёт прямо к активным предложениям сектора, с ценой за квадратный метр на каждой карточке.",
  },
  buyLink: { ro: "Vezi toate ofertele", ru: "Смотреть все предложения" },
  updatedAt: { ro: "Actualizat", ru: "Обновлено" },
  see: { ro: "Vezi ofertele", ru: "Смотреть предложения" },
} satisfies Record<string, T | T[]>;

interface Props {
  rows: IndexRow[];
  city: PriceBand;
  cityRent: RentStat;
  max: number;
  updated: string;
}

export default function IndexView({ rows, city, cityRent, max, updated }: Props) {
  const { t, lang } = useLang();
  const withBand = rows.filter((r) => r.sale);
  const thin = rows.filter((r) => !r.sale);

  return (
    <>
      <PageIntro
        kicker={C.kicker}
        title={C.title}
        lead={C.lead}
        meta={{
          ro: `Actualizat ${formatDate(updated, "ro")} · ${formatCount(city.count + cityRent.count, "ofertă", "oferte", "ro")} în calcul`,
          ru: `Обновлено ${formatDate(updated, "ru")} · ${city.count + cityRent.count} предложений в расчёте`,
        }}
      />

      <section className="wrap">
        <div className={`${styles.city} rv`}>
          <div className={styles.cityMain}>
            <p className="kicker">{t(C.city)}</p>
            <p className={`num ${styles.cityFigure}`}>{formatPricePerSqm(city.median, lang)}</p>
            <p className={styles.cityNote}>{t(C.cityNote)}</p>
          </div>

          <dl className={styles.citySide}>
            <div className={styles.citySideRow}>
              <dt>{t(C.band)}</dt>
              <dd className="num">
                {formatPricePerSqm(city.p25, lang)} – {formatPricePerSqm(city.p75, lang)}
              </dd>
            </div>
            <div className={styles.citySideRow}>
              <dt>{t(C.rentCity)}</dt>
              <dd className="num">{formatRent(cityRent.median, lang)}</dd>
            </div>
            <div className={styles.citySideRow}>
              <dt>{t(UI.offers)}</dt>
              <dd className="num">{city.count + cityRent.count}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="wrap sec">
        <div className={`${styles.tableHead} rv`}>
          <span className={styles.colSector}>{t(C.sector)}</span>
          <span className={styles.colBand}>{t(C.band)}</span>
          <span className={styles.colMedian}>{t(C.medianCol)}</span>
          <span className={styles.colRent}>{t(C.rentCol)}</span>
        </div>

        <ul className={styles.rows}>
          {withBand.map((row, i) => {
            const band = row.sale as PriceBand;
            const left = (band.p25 / max) * 100;
            const width = Math.max(2, ((band.p75 - band.p25) / max) * 100);
            const mid = (band.median / max) * 100;

            return (
              <li
                key={row.sector}
                className={`${styles.row} rv`}
                style={{ "--d": `${Math.min(i, 6) * 50}ms` } as React.CSSProperties}
              >
                <Link href={`/proprietati?sector=${row.sector}`} className={styles.rowLink}>
                  <span className={styles.colSector}>
                    <span className={styles.sectorName}>{t(SECTOR_LABEL[row.sector])}</span>
                    <span className={`spec num ${styles.sectorMeta}`}>
                      {formatCount(row.offers, t(UI.propertiesOne), t(UI.properties), lang)}
                    </span>
                  </span>

                  <span className={styles.colBand}>
                    <span className={styles.track} aria-hidden="true">
                      <span
                        className={styles.fill}
                        style={{ left: `${left}%`, width: `${width}%` }}
                      />
                      <span className={styles.tick} style={{ left: `${mid}%` }} />
                    </span>
                    <span className={`spec num ${styles.bandFigures}`}>
                      {formatPricePerSqm(band.p25, lang)} – {formatPricePerSqm(band.p75, lang)}
                    </span>
                  </span>

                  <span className={`num ${styles.colMedian}`}>
                    {formatPricePerSqm(band.median, lang)}
                  </span>

                  <span className={`num ${styles.colRent}`}>
                    {/* The column header disappears on a phone; the row carries its own. */}
                    <span className={styles.rentLabel}>{t(C.rentCol)}: </span>
                    {row.rent ? formatRent(row.rent.median, lang) : "—"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className={`legal ${styles.bandNote} rv`}>{t(C.bandNote)}</p>

        {thin.length > 0 && (
          <div className={`${styles.thin} rv`}>
            <p className={styles.thinTitle}>{t(C.thin)}</p>
            <p className={styles.thinList}>
              {thin.map((row, i) => (
                <span key={row.sector}>
                  {i > 0 && <span aria-hidden="true"> · </span>}
                  <Link href={`/proprietati?sector=${row.sector}`} className="link">
                    {t(SECTOR_LABEL[row.sector])}
                  </Link>
                </span>
              ))}
            </p>
            <p className="legal">{t(C.thinNote)}</p>
          </div>
        )}

        <p className={`legal ${styles.disclaimer} rv`}>{t(INDEX_DISCLAIMER)}</p>
      </section>

      <section className={styles.methodSection}>
        <div className={`wrap ${styles.methodInner}`}>
          <div className="rv">
            <p className="kicker kicker-dark">{t(C.method)}</p>
            <h2 className={styles.methodTitle}>{t(C.methodHeading)}</h2>
          </div>
          <ol className={styles.method}>
            {(C.methodSteps as T[]).map((step, i) => (
              <li
                key={step.ro}
                className={`${styles.methodStep} rv`}
                style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
              >
                <span className={`num ${styles.methodNo}`}>{String(i + 1).padStart(2, "0")}</span>
                <p>{t(step)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap sec">
        <div className={styles.cards}>
          <div className={`${styles.card} rv`}>
            <h2 className={styles.cardTitle}>{t(C.sellCard)}</h2>
            <p className={styles.cardText}>{t(C.sellText)}</p>
            <Link href="/vinde" className="btn">
              {t(C.sellLink)}
            </Link>
          </div>
          <div className={`${styles.card} rv`} style={{ "--d": "80ms" } as React.CSSProperties}>
            <h2 className={styles.cardTitle}>{t(C.buyCard)}</h2>
            <p className={styles.cardText}>{t(C.buyText)}</p>
            <Link href="/proprietati" className="btn-line">
              {t(C.buyLink)}
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <div className={`${styles.sectors} rv`}>
          {withBand.slice(0, 6).map((row) => {
            const info = SECTOR_BY_SLUG[row.sector];
            return (
              <article key={row.sector} className={styles.sectorCard}>
                <h3 className={styles.sectorTitle}>{t(SECTOR_LABEL[row.sector])}</h3>
                <p className={styles.sectorBlurb}>{t(info.blurb)}</p>
                <Link href={`/proprietati?sector=${row.sector}`} className="link">
                  {t(C.see)} {t(SECTOR_IN[row.sector])} →
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
