"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { IconPhone } from "@/components/Icons";
import LeadRequestForm from "@/components/LeadRequestForm";
import PageIntro from "@/components/PageIntro";
import { AGENTS } from "@/lib/agents";
import { AGENCY, CONDITION_LABEL, INDEX_DISCLAIMER, SECTOR_LABEL } from "@/lib/content";
import { formatArea, formatPrice, formatPricePerSqm } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { PriceBand } from "@/lib/market-index";
import type { Condition, Sector, T } from "@/lib/types";
import styles from "./sell.module.css";

/* City sectors first, suburbs after — the order a seller reads them in. */
const SECTOR_CHOICES: Sector[] = [
  "centru",
  "botanica",
  "buiucani",
  "riscani",
  "ciocana",
  "telecentru",
  "posta-veche",
  "durlesti",
  "stauceni",
  "codru",
  "dumbrava",
  "ialoveni",
];

const CONDITION_CHOICES: Condition[] = [
  "euroreparatie",
  "design-individual",
  "reparatie-cosmetica",
  "varianta-alba",
  "varianta-sura",
  "necesita-reparatie",
];

/** What the state of an apartment does to its price per square metre. */
const CONDITION_FACTOR: Record<Condition, number> = {
  euroreparatie: 1.07,
  "design-individual": 1.12,
  "reparatie-cosmetica": 1,
  "varianta-alba": 0.88,
  "varianta-sura": 0.82,
  "necesita-reparatie": 0.78,
};

/**
 * A one-room flat sells for more per square metre than a four-room one: the
 * kitchen and the bathroom cost the same in both, and there are fewer buyers
 * for the large ones.
 */
const ROOM_FACTOR: Record<string, number> = { "1": 1.06, "2": 1, "3": 0.97, "4": 0.94 };

const STEPS: { title: T; text: T }[] = [
  {
    title: { ro: "Evaluare în 24 de ore", ru: "Оценка за 24 часа" },
    text: {
      ro: "Venim la fața locului, măsurăm, verificăm actele și vă dăm în scris intervalul realist de preț, cu ofertele comparabile din sectorul dumneavoastră. Gratuit și fără obligația de a semna ceva.",
      ru: "Приезжаем на место, замеряем, проверяем документы и даём письменно реальный ценовой диапазон с сопоставимыми предложениями по вашему сектору. Бесплатно и без обязательства что-либо подписывать.",
    },
  },
  {
    title: { ro: "Fotografie și promovare", ru: "Фотосъёмка и продвижение" },
    text: {
      ro: "Fotograful agenției lucrează la lumină de zi, cu obiectiv larg. Anunțul se scrie în română și în rusă, se publică pe site, pe 999.md și în rețelele noastre, iar prima săptămână o promovăm plătit.",
      ru: "Фотограф агентства снимает при дневном свете широкоугольным объективом. Объявление пишется на румынском и русском, публикуется на сайте, на 999.md и в наших соцсетях, а первую неделю мы продвигаем платно.",
    },
  },
  {
    title: { ro: "Vânzare cu acte gata", ru: "Продажа с готовыми документами" },
    text: {
      ro: "Filtrăm cumpărătorii înainte de vizionare, negociem în numele dumneavoastră și pregătim dosarul pentru notar. Comisionul se achită doar la semnare — dacă nu se vinde, nu plătiți nimic.",
      ru: "Отсеиваем покупателей до просмотра, ведём переговоры от вашего имени и готовим пакет для нотариуса. Комиссия платится только при подписании — если не продали, вы не платите ничего.",
    },
  },
];

const INCLUDED: T[] = [
  { ro: "Ședință foto profesională, inclusă în comision", ru: "Профессиональная фотосъёмка, включена в комиссию" },
  { ro: "Anunț scris în română și în rusă", ru: "Объявление на румынском и русском" },
  { ro: "Promovare pe 999.md și în rețelele agenției", ru: "Продвижение на 999.md и в соцсетях агентства" },
  { ro: "Filtrarea cumpărătorilor înainte de vizionare", ru: "Отбор покупателей до просмотра" },
  { ro: "Verificarea actelor și asistență juridică", ru: "Проверка документов и юридическое сопровождение" },
  { ro: "Comision doar la semnarea contractului", ru: "Комиссия только при подписании договора" },
];

const FAQ: { q: T; a: T }[] = [
  {
    q: { ro: "Cât durează o vânzare în Chișinău?", ru: "Сколько длится продажа в Кишинёве?" },
    a: {
      ro: "Un apartament corect evaluat se vinde în 45-70 de zile. Cele supraevaluate stau șase luni și se vând oricum la prețul pieței, doar că după trei reduceri publice care sperie cumpărătorii.",
      ru: "Корректно оценённая квартира продаётся за 45-70 дней. Переоценённые стоят по полгода и всё равно уходят по рыночной цене — только после трёх публичных снижений, которые отпугивают покупателей.",
    },
  },
  {
    q: { ro: "Ce acte îmi trebuie ca să pun apartamentul în vânzare?", ru: "Какие документы нужны, чтобы выставить квартиру?" },
    a: {
      ro: "Buletinul, extrasul din registrul bunurilor imobile și actul în baza căruia ați devenit proprietar. Dacă apartamentul e cumpărat în timpul căsătoriei, mai trebuie acordul soțului sau soției, la notar.",
      ru: "Удостоверение личности, выписка из реестра недвижимости и документ, на основании которого вы стали собственником. Если квартира куплена в браке, нужно ещё нотариальное согласие супруга или супруги.",
    },
  },
  {
    q: { ro: "Trebuie să semnez exclusivitate?", ru: "Нужно ли подписывать эксклюзив?" },
    a: {
      ro: "Nu. Lucrăm și fără exclusivitate. Cu exclusivitate însă investim în promovare plătită și ședință foto extinsă, fiindcă știm că munca nu se pierde — de aceea acele apartamente se vând, în medie, cu două săptămâni mai repede.",
      ru: "Нет. Мы работаем и без эксклюзива. Но с эксклюзивом мы вкладываемся в платное продвижение и расширенную фотосъёмку, зная, что работа не пропадёт, — поэтому такие квартиры продаются в среднем на две недели быстрее.",
    },
  },
  {
    q: { ro: "Cine plătește comisionul?", ru: "Кто платит комиссию?" },
    a: {
      ro: "Vânzătorul, 2% din prețul final, la semnarea contractului la notar. Nu cerem avans, nu percepem taxe de listare și nu luăm comision de la cumpărător pentru aceeași tranzacție.",
      ru: "Продавец, 2% от финальной цены, при подписании договора у нотариуса. Мы не берём аванс, не берём плату за размещение и не берём комиссию с покупателя по той же сделке.",
    },
  },
  {
    q: { ro: "Pot vinde dacă apartamentul e ipotecat?", ru: "Можно ли продать квартиру в ипотеке?" },
    a: {
      ro: "Da, se face frecvent. Banca eliberează grevarea la momentul tranzacției, din banii cumpărătorului. Trebuie doar coordonat calendarul cu banca — ne ocupăm noi de partea aceasta.",
      ru: "Да, это делается регулярно. Банк снимает обременение в момент сделки, из денег покупателя. Нужно только согласовать график с банком — эту часть берём на себя мы.",
    },
  },
  {
    q: { ro: "Ce fac dacă vreau doar să știu prețul?", ru: "А если я просто хочу узнать цену?" },
    a: {
      ro: "Este perfect în regulă. Evaluarea e gratuită și nu vine la pachet cu un contract. Mulți proprietari ne cheamă o dată pe an, ca să știe unde stau, și abia peste doi ani vând.",
      ru: "Это совершенно нормально. Оценка бесплатна и не идёт в комплекте с договором. Многие собственники зовут нас раз в год, чтобы понимать, где они стоят, и продают только через два года.",
    },
  },
];

const round500 = (value: number) => Math.round(value / 500) * 500;

export default function SellView({
  city,
  bySector,
}: {
  city: PriceBand;
  bySector: Partial<Record<Sector, PriceBand>>;
}) {
  const { t, lang } = useLang();

  const [sector, setSector] = useState<Sector>("botanica");
  const [rooms, setRooms] = useState("2");
  const [area, setArea] = useState("67");
  const [condition, setCondition] = useState<Condition>("euroreparatie");

  const band = bySector[sector] ?? city;
  const areaNumber = Number(area.replace(",", "."));
  const valid = Number.isFinite(areaNumber) && areaNumber >= 20 && areaNumber <= 400;

  const estimate = useMemo(() => {
    if (!valid) return null;
    const factor = CONDITION_FACTOR[condition] * (ROOM_FACTOR[rooms] ?? 1);
    return {
      low: round500(areaNumber * band.p25 * factor),
      mid: round500(areaNumber * band.median * factor),
      high: round500(areaNumber * band.p75 * factor),
      sqm: Math.round(band.median * factor),
    };
  }, [areaNumber, band, condition, rooms, valid]);

  const prefix: T | undefined = estimate
    ? {
        ro: `Evaluare cerută: ${rooms === "4" ? "4+" : rooms} camere, ${formatArea(areaNumber, "ro")}, ${SECTOR_LABEL[sector].ro}, ${CONDITION_LABEL[condition].ro}. Estimare pe site: ${formatPrice(estimate.low)} – ${formatPrice(estimate.high)}.`,
        ru: `Запрос на оценку: ${rooms === "4" ? "4+" : rooms} комн., ${formatArea(areaNumber, "ru")}, ${SECTOR_LABEL[sector].ru}, ${CONDITION_LABEL[condition].ru}. Оценка на сайте: ${formatPrice(estimate.low)} – ${formatPrice(estimate.high)}.`,
      }
    : undefined;

  const salesAgents = AGENTS.filter((a) => a.slug !== "cristina-lungu");

  return (
    <>
      <PageIntro
        kicker={{ ro: "Pentru proprietari", ru: "Для собственников" }}
        title={{ ro: "Vindeți-vă apartamentul cu ARCA", ru: "Продайте квартиру с ARCA" }}
        lead={{
          ro: "Evaluare scrisă în 24 de ore, fotograf plătit de agenție și un singur agent care duce vânzarea până la notar. Comisionul se achită la semnare — până atunci nu plătiți nimic.",
          ru: "Письменная оценка за 24 часа, фотограф за счёт агентства и один агент, который доводит продажу до нотариуса. Комиссия платится при подписании — до этого вы не платите ничего.",
        }}
      >
        <div className={`rv ${styles.introActions}`} style={{ "--d": "240ms" } as React.CSSProperties}>
          <a href="#evaluare" className="btn">
            {t({ ro: "Solicită evaluarea gratuită", ru: "Заказать бесплатную оценку" })}
          </a>
          <a href={AGENCY.mobileHref} className={`btn-line ${styles.introPhone}`}>
            <IconPhone size={17} />
            <span className="num">{AGENCY.mobile}</span>
          </a>
        </div>
      </PageIntro>

      <div className={`wrap-wide ${styles.heroWrap}`}>
        <div className={`ph rvimg ${styles.hero}`}>
          <Image
            src="/img/apt-13.jpg"
            alt={t({
              ro: "Apartament pregătit pentru ședința foto de vânzare",
              ru: "Квартира, подготовленная к съёмке перед продажей",
            })}
            fill
            priority
            sizes="(max-width:1440px) 100vw, 1440px"
          />
        </div>
      </div>

      <section className={`wrap ${styles.stepsSection}`}>
        <p className="kicker rv">{t({ ro: "Cum decurge", ru: "Как это происходит" })}</p>
        <ol className={styles.steps}>
          {STEPS.map((step, i) => (
            <li
              key={step.title.ro}
              className={`rv ${styles.step}`}
              style={{ "--d": `${Math.min(i, 5) * 60}ms` } as React.CSSProperties}
            >
              <span className={`num ${styles.stepNumber}`}>{i + 1}</span>
              <h2 className={styles.stepTitle}>{t(step.title)}</h2>
              <p className={styles.stepText}>{t(step.text)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`wrap ${styles.includedSection}`}>
        <div className={styles.includedGrid}>
          <div className="rv">
            <p className="kicker">{t({ ro: "Ce primiți", ru: "Что вы получаете" })}</p>
            <h2 className={styles.includedTitle}>
              {t({ ro: "Totul e în comision", ru: "Всё входит в комиссию" })}
            </h2>
            <p className={styles.includedLead}>
              {t({
                ro: "Nu facturăm nimic separat: nici fotograful, nici traducerea anunțului, nici promovarea din prima săptămână.",
                ru: "Мы не выставляем отдельных счетов: ни за фотографа, ни за перевод объявления, ни за продвижение в первую неделю.",
              })}
            </p>
          </div>

          <ul className={styles.included}>
            {INCLUDED.map((item, i) => (
              <li
                key={item.ro}
                className={`rv ${styles.includedItem}`}
                style={{ "--d": `${Math.min(i, 5) * 60}ms` } as React.CSSProperties}
              >
                <span className={`num ${styles.includedIndex}`}>{String(i + 1).padStart(2, "0")}</span>
                <span>{t(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.estimatorSection} id="evaluare">
        <div className={`wrap ${styles.estimatorInner}`}>
          <div className="rv">
            <p className="kicker kicker-dark">{t({ ro: "Estimare rapidă", ru: "Быстрая оценка" })}</p>
            <h2 className={styles.estimatorTitle}>
              {t({ ro: "Cât valorează apartamentul dumneavoastră", ru: "Сколько стоит ваша квартира" })}
            </h2>
            <p className={styles.estimatorLead}>
              {t({
                ro: "Cifrele de mai jos vin din Indicele ARCA — medianele ofertelor active din portofoliul nostru, pe sector. Este un punct de plecare, nu o evaluare: prețul final îl decid etajul, vederea, blocul și starea reală, pe care le vedem doar la fața locului.",
                ru: "Цифры ниже берутся из Индекса ARCA — медиан активных предложений нашего портфеля по секторам. Это отправная точка, а не оценка: финальную цену определяют этаж, вид, дом и реальное состояние, которые видно только на месте.",
              })}
            </p>
            <p className={styles.estimatorNote}>{t(INDEX_DISCLAIMER)}</p>
            <Link href="/indice" className={`link ${styles.estimatorLink}`}>
              {t({ ro: "Vezi Indicele ARCA complet", ru: "Смотреть полный Индекс ARCA" })}
            </Link>
          </div>

          <div className={`rv ${styles.card}`} style={{ "--d": "120ms" } as React.CSSProperties}>
            <div className={styles.controls}>
              <label className={styles.control}>
                <span className={styles.controlLabel}>{t({ ro: "Sector", ru: "Сектор" })}</span>
                <select
                  className="field"
                  value={sector}
                  onChange={(e) => setSector(e.target.value as Sector)}
                >
                  {SECTOR_CHOICES.map((s) => (
                    <option key={s} value={s}>
                      {t(SECTOR_LABEL[s])}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.control}>
                <span className={styles.controlLabel}>{t({ ro: "Camere", ru: "Комнаты" })}</span>
                <select className="field" value={rooms} onChange={(e) => setRooms(e.target.value)}>
                  {["1", "2", "3", "4"].map((r) => (
                    <option key={r} value={r}>
                      {r === "4" ? "4+" : r}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.control}>
                <span className={styles.controlLabel}>
                  {t({ ro: "Suprafață, m²", ru: "Площадь, м²" })}
                </span>
                <input
                  className="field"
                  type="text"
                  inputMode="decimal"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </label>

              <label className={`${styles.control} ${styles.controlWide}`}>
                <span className={styles.controlLabel}>{t({ ro: "Starea", ru: "Состояние" })}</span>
                <select
                  className="field"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as Condition)}
                >
                  {CONDITION_CHOICES.map((c) => (
                    <option key={c} value={c}>
                      {t(CONDITION_LABEL[c])}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className={styles.result}>
              {estimate ? (
                <>
                  <p className={styles.resultLabel}>
                    {t({ ro: "Interval estimativ de vânzare", ru: "Ориентировочный диапазон продажи" })}
                  </p>
                  <p className={`num ${styles.resultRange}`}>
                    {formatPrice(estimate.low)} — {formatPrice(estimate.high)}
                  </p>

                  <div className={styles.scale} aria-hidden="true">
                    <span className={styles.scaleLine} />
                    <span className={styles.scaleMark} style={{ left: "0%" }} />
                    <span className={styles.scaleMark} style={{ left: "50%" }} />
                    <span className={styles.scaleMark} style={{ left: "100%" }} />
                  </div>

                  <div className={`num ${styles.scaleLabels}`}>
                    <span>{formatPrice(estimate.low)}</span>
                    <span className={styles.scaleMid}>{formatPrice(estimate.mid)}</span>
                    <span>{formatPrice(estimate.high)}</span>
                  </div>

                  <p className={`num ${styles.resultMeta}`}>
                    {formatPricePerSqm(estimate.sqm, lang)} ·{" "}
                    {lang === "ru"
                      ? `${band.count} предложений в базе`
                      : `${band.count} oferte în bază`}
                  </p>
                </>
              ) : (
                <p className={styles.resultEmpty}>
                  {t({
                    ro: "Scrieți o suprafață între 20 și 400 m².",
                    ru: "Укажите площадь от 20 до 400 м².",
                  })}
                </p>
              )}
            </div>

            <div className={styles.formInner}>
              <p className={styles.formTitle}>
                {t({
                  ro: "Vreți cifra exactă? Vă sunăm în aceeași zi.",
                  ru: "Нужна точная цифра? Перезвоним в тот же день.",
                })}
              </p>
              <LeadRequestForm
                source="vinde"
                dark
                fields={["name", "phone", "message"]}
                messagePrefix={prefix}
                messagePlaceholder={{
                  ro: "Etajul, anul blocului, orice detaliu care contează.",
                  ru: "Этаж, год постройки, любая важная деталь.",
                }}
                submitLabel={{ ro: "Solicit evaluarea →", ru: "Заказать оценку →" }}
                note={{
                  ro: "Evaluarea este gratuită și nu vă obligă la nimic.",
                  ru: "Оценка бесплатна и ни к чему вас не обязывает.",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={`wrap ${styles.agentsSection}`}>
        <div className={`rv ${styles.agentsHead}`}>
          <div>
            <p className="kicker">{t({ ro: "Cine se ocupă", ru: "Кто занимается" })}</p>
            <h2 className={styles.agentsTitle}>
              {t({ ro: "Agenții care duc vânzările", ru: "Агенты, которые ведут продажи" })}
            </h2>
          </div>
        </div>

        <ul className={styles.agents}>
          {salesAgents.map((agent, i) => (
            <li
              key={agent.slug}
              className={`rv ${styles.agent}`}
              style={{ "--d": `${Math.min(i, 5) * 60}ms` } as React.CSSProperties}
            >
              <Link href={`/agenti/${agent.slug}`} className="ph ph-portrait">
                <Image
                  src={agent.photo.src}
                  alt={t(agent.photo.alt)}
                  fill
                  sizes="(max-width:700px) 100vw, 358px"
                />
              </Link>
              <h3 className={styles.agentName}>
                <Link href={`/agenti/${agent.slug}`}>{agent.name}</Link>
              </h3>
              <p className={styles.agentRole}>{t(agent.role)}</p>
              <a href={agent.phoneHref} className={styles.agentPhone}>
                <IconPhone size={16} />
                <span className="num">{agent.phone}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={`wrap ${styles.faqSection}`}>
        <p className="kicker rv">{t({ ro: "Întrebările vânzătorului", ru: "Вопросы продавца" })}</p>
        <ul className={styles.faq}>
          {FAQ.map((item, i) => (
            <li
              key={item.q.ro}
              className={`rv ${styles.faqItem}`}
              style={{ "--d": `${Math.min(i, 5) * 60}ms` } as React.CSSProperties}
            >
              <h3 className={styles.faqQ}>{t(item.q)}</h3>
              <p className={styles.faqA}>{t(item.a)}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
