"use client";

import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { AGENCY, SECTOR_LABEL, UI } from "@/lib/content";
import { formatCount, formatPricePerSqm } from "@/lib/format";
import { useLang } from "@/lib/lang";
import { SECTOR_BY_SLUG } from "@/lib/sectors";
import type { Sector, T } from "@/lib/types";
import styles from "./guide.module.css";

export interface SectorNote {
  sector: Sector;
  median: number;
  offers: number;
}

const G = {
  kicker: { ro: "Ghidul cumpărătorului", ru: "Гид покупателя" },
  title: {
    ro: "Cum se cumpără un apartament în Chișinău",
    ru: "Как покупают квартиру в Кишинёве",
  },
  lead: {
    ro: "Fără teorie și fără termeni de broșură: pașii prin care trece fiecare tranzacție a noastră, ce se verifică la acte, ce se întreabă la vizionare și cum arată sectoarele unul lângă altul.",
    ru: "Без теории и брошюрных терминов: шаги, через которые проходит каждая наша сделка, что проверяется в документах, что спрашивают на просмотре и как выглядят секторы рядом друг с другом.",
  },
  stepsKicker: { ro: "Pașii", ru: "Шаги" },
  stepsTitle: { ro: "De la buget la chei", ru: "От бюджета до ключей" },
  steps: [
    {
      title: { ro: "Fixați bugetul real", ru: "Определите реальный бюджет" },
      text: {
        ro: "Bugetul nu e prețul apartamentului: adăugați notarul, cadastrul, comisionul și cel puțin o mie de euro pentru primele reparații. Dacă mergeți pe credit, cereți preaprobarea înainte de prima vizionare — schimbă complet cum negociați.",
        ru: "Бюджет — это не цена квартиры: добавьте нотариуса, кадастр, комиссию и хотя бы тысячу евро на первый ремонт. Если идёте в кредит, получите предодобрение до первого просмотра — это полностью меняет то, как вы торгуетесь.",
      },
    },
    {
      title: { ro: "Alegeți zona înainte de apartament", ru: "Сначала район, потом квартира" },
      text: {
        ro: "Un apartament se poate repara, sectorul nu. Mergeți pe stradă seara, la ora la care veți ajunge acasă, și uitați-vă unde parchează lumea. Diferența de preț dintre două sectoare vecine se recuperează greu dacă zona nu vi se potrivește.",
        ru: "Квартиру можно отремонтировать, район — нет. Пройдитесь по улице вечером, в то время, когда вы будете возвращаться домой, и посмотрите, где паркуются люди. Разницу в цене между соседними секторами трудно оправдать, если район вам не подходит.",
      },
    },
    {
      title: { ro: "Vizionați trei într-o zi", ru: "Смотрите три за один день" },
      text: {
        ro: "Un apartament văzut singur pare întotdeauna bun sau prost. Trei văzute în aceeași după-amiază se compară singure. Faceți poze la tablou electric, la ferestre din interior și la casa scării — acolo se vede cum e întreținut blocul.",
        ru: "Одна квартира сама по себе всегда кажется либо хорошей, либо плохой. Три, увиденные за один день, сравниваются сами. Фотографируйте электрощиток, окна изнутри и подъезд — там видно, как содержится дом.",
      },
    },
    {
      title: { ro: "Verificați actele înainte de avans", ru: "Проверьте документы до задатка" },
      text: {
        ro: "Extras din registrul bunurilor imobile proaspăt, actul din care proprietarul a devenit proprietar, lipsa grevărilor și cine e viza de reședință în apartament. Dacă e vândut prin procură, cerem să vorbim cu proprietarul. Un apartament cu acte curate nu are nevoie de grabă.",
        ru: "Свежая выписка из реестра недвижимости, документ, по которому собственник стал собственником, отсутствие обременений и кто прописан в квартире. Если продают по доверенности, мы просим поговорить с собственником. Квартире с чистыми документами спешка не нужна.",
      },
    },
    {
      title: { ro: "Negociați cu argumente, nu cu procente", ru: "Торгуйтесь аргументами, не процентами" },
      text: {
        ro: "„Dați mai ieftin cu 10%” nu mișcă pe nimeni. Ferestrele care trebuie schimbate, blocul fără lift la etajul șase, mediana sectorului — astea mișcă. De aceea publicăm indicele: ca discuția să pornească de la o cifră, nu de la o senzație.",
        ru: "«Скиньте 10%» никого не двигает. Окна, которые надо менять, дом без лифта на шестом этаже, медиана сектора — вот это двигает. Поэтому мы и публикуем индекс: чтобы разговор начинался с цифры, а не с ощущения.",
      },
    },
    {
      title: { ro: "Semnați la notar, plătiți după înregistrare", ru: "Подписывайте у нотариуса, платите после регистрации" },
      text: {
        ro: "Contractul se autentifică la notar, iar dreptul de proprietate se înregistrează la cadastru. Banii se transferă în ziua semnării, iar predarea apartamentului se face cu proces-verbal, cu indicii contoarelor scriși în el.",
        ru: "Договор удостоверяется у нотариуса, а право собственности регистрируется в кадастре. Деньги переводятся в день подписания, а квартира передаётся по акту, с записанными в нём показаниями счётчиков.",
      },
    },
  ] as { title: T; text: T }[],
  checkKicker: { ro: "La vizionare", ru: "На просмотре" },
  checkTitle: { ro: "Zece minute care vă scutesc de un an", ru: "Десять минут, которые экономят год" },
  checks: [
    {
      ro: "Deschideți robinetul de la baie și de la bucătărie în același timp și verificați presiunea.",
      ru: "Откройте кран в ванной и на кухне одновременно и проверьте напор.",
    },
    {
      ro: "Uitați-vă în colțurile tavanului, mai ales la ultimul etaj și la parter — acolo apare umezeala.",
      ru: "Посмотрите в углы потолка, особенно на последнем этаже и на первом — там появляется сырость.",
    },
    {
      ro: "Întrebați cât a fost factura la încălzire în ianuarie. Un răspuns evaziv e un răspuns.",
      ru: "Спросите, каким был счёт за отопление в январе. Уклончивый ответ — тоже ответ.",
    },
    {
      ro: "Verificați dacă geamurile se închid până la capăt și dacă balconul e închis legal.",
      ru: "Проверьте, закрываются ли окна до конца и легально ли остеклён балкон.",
    },
    {
      ro: "Întrebați cine e administratorul blocului și dacă asociația are datorii.",
      ru: "Спросите, кто управляет домом и есть ли у ассоциации долги.",
    },
    {
      ro: "Ieșiți din bloc și uitați-vă unde ați parca seara, nu la prânz.",
      ru: "Выйдите из дома и посмотрите, где вы припарковались бы вечером, а не днём.",
    },
  ] as T[],
  sectorsKicker: { ro: "Sectoarele", ru: "Секторы" },
  sectorsTitle: { ro: "Chișinăul, sector cu sector", ru: "Кишинёв, сектор за сектором" },
  sectorsLead: {
    ro: "Cifra de sub fiecare sector este mediana ofertelor noastre active de acolo. Se schimbă odată cu portofoliul.",
    ru: "Цифра под каждым сектором — медиана наших активных предложений там. Она меняется вместе с портфелем.",
  },
  seeSector: { ro: "Vezi ofertele", ru: "Смотреть предложения" },
  helpTitle: { ro: "Vreți să mergem împreună?", ru: "Хотите, поедем вместе?" },
  helpText: {
    ro: "Cumpărătorul nu ne plătește comision: acesta se achită de vânzător, la semnare. Practic, mergeți la vizionări cu un agent care a văzut sute de apartamente, fără să vă coste ceva în plus.",
    ru: "Покупатель нам комиссию не платит: её платит продавец при подписании. Фактически вы едете на просмотры с агентом, видевшим сотни квартир, и это не стоит вам ничего сверху.",
  },
  toIndex: { ro: "Indicele ARCA", ru: "Индекс ARCA" },
  toCredit: { ro: "Credit ipotecar", ru: "Ипотека" },
  toList: { ro: "Apartamente de vânzare", ru: "Квартиры на продажу" },
  linksTitle: { ro: "Mai departe", ru: "Дальше" },
} satisfies Record<string, T | T[] | { title: T; text: T }[]>;

export default function GuideView({ notes }: { notes: SectorNote[] }) {
  const { t, lang } = useLang();

  return (
    <>
      <PageIntro kicker={G.kicker} title={G.title} lead={G.lead} />

      <section className="wrap">
        <div className={`${styles.head} rv`}>
          <p className="kicker">{t(G.stepsKicker)}</p>
          <h2 className={styles.h2}>{t(G.stepsTitle)}</h2>
        </div>

        <ol className={styles.steps}>
          {(G.steps as { title: T; text: T }[]).map((step, i) => (
            <li
              key={step.title.ro}
              className={`${styles.step} rv`}
              style={{ "--d": `${Math.min(i, 4) * 60}ms` } as React.CSSProperties}
            >
              <span className={`num ${styles.stepNo}`}>{String(i + 1).padStart(2, "0")}</span>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{t(step.title)}</h3>
                <p className={styles.stepText}>{t(step.text)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.checkSection}>
        <div className={`wrap ${styles.checkInner}`}>
          <div className="rv">
            <p className="kicker kicker-dark">{t(G.checkKicker)}</p>
            <h2 className={styles.checkTitle}>{t(G.checkTitle)}</h2>
          </div>
          <ul className={styles.checks}>
            {(G.checks as T[]).map((item, i) => (
              <li
                key={item.ro}
                className={`${styles.check} rv`}
                style={{ "--d": `${Math.min(i, 5) * 50}ms` } as React.CSSProperties}
              >
                {t(item)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap sec">
        <div className={`${styles.head} rv`}>
          <p className="kicker">{t(G.sectorsKicker)}</p>
          <h2 className={styles.h2}>{t(G.sectorsTitle)}</h2>
          <p className={`lead ${styles.sectorsLead}`}>{t(G.sectorsLead)}</p>
        </div>

        <div className={styles.sectors}>
          {notes.map((note) => {
            const info = SECTOR_BY_SLUG[note.sector];
            return (
              <article key={note.sector} className={`${styles.sector} rv`}>
                <div className={styles.sectorHead}>
                  <h3 className={styles.sectorName}>{t(SECTOR_LABEL[note.sector])}</h3>
                  <p className={`num ${styles.sectorFigure}`}>
                    {note.median > 0 ? formatPricePerSqm(note.median, lang) : "—"}
                  </p>
                </div>
                <p className={styles.sectorText}>{t(info.about)}</p>
                <p className={styles.sectorFoot}>
                  <Link href={`/proprietati?sector=${note.sector}`} className="link">
                    {t(G.seeSector)} {t(info.in)} →
                  </Link>
                  <span className={`spec num ${styles.sectorCount}`}>
                    {formatCount(note.offers, t(UI.propertiesOne), t(UI.properties), lang)}
                  </span>
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="wrap sec">
        <div className={`${styles.help} rv`}>
          <div>
            <h2 className={styles.h2}>{t(G.helpTitle)}</h2>
            <p className={`lead ${styles.helpText}`}>{t(G.helpText)}</p>
          </div>
          <div className={styles.helpActions}>
            <a href={AGENCY.mobileHref} className="btn">
              {t(UI.callNow)}
            </a>
            <Link href="/agenti" className="btn-line">
              {t({ ro: "Vezi echipa", ru: "Смотреть команду" })}
            </Link>
          </div>
        </div>

        <nav className={`${styles.links} rv`} aria-label={t(G.linksTitle)}>
          <Link href="/indice" className={styles.link}>
            {t(G.toIndex)} →
          </Link>
          <Link href="/credit" className={styles.link}>
            {t(G.toCredit)} →
          </Link>
          <Link href="/proprietati" className={styles.link}>
            {t(G.toList)} →
          </Link>
        </nav>
      </section>
    </>
  );
}
