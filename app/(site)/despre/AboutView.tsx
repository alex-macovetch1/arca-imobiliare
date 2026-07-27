"use client";

import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@/components/Icons";
import OfficeMap from "@/components/OfficeMap";
import PageIntro from "@/components/PageIntro";
import { AGENTS } from "@/lib/agents";
import { AGENCY } from "@/lib/content";
import { useLang } from "@/lib/lang";
import type { T } from "@/lib/types";
import styles from "./about.module.css";

const STORY: T[] = [
  {
    ro: "ARCA a început în 2012, într-un birou de douăzeci de metri pătrați de pe Ștefan cel Mare, cu doi oameni și un dosar cu treizeci și patru de apartamente. Primul an l-am făcut aproape integral pe Centru și Râșcani, fiindcă acolo puteam merge pe jos la fiecare vizionare. Nu era o strategie, era bugetul.",
    ru: "ARCA началась в 2012 году, в кабинете на двадцать квадратных метров на Штефана чел Маре, с двумя людьми и папкой из тридцати четырёх квартир. Первый год мы почти целиком отработали на Центре и Рышкановке, потому что туда можно было дойти пешком на каждый просмотр. Это была не стратегия, а бюджет.",
  },
  {
    ro: "Al doilea lucru pe care l-am învățat, după preț, a fost fotografia. În 2014 am cumpărat un obiectiv larg și am început să fotografiem noi fiecare apartament, în loc să preluăm pozele proprietarului. Numărul de apeluri pe anunț s-a dublat în două luni. De atunci n-am mai publicat niciodată o proprietate pe care nu am văzut-o cu ochii noștri.",
    ru: "Второе, чему мы научились после цены, — фотография. В 2014-м мы купили широкоугольный объектив и начали снимать каждую квартиру сами, вместо того чтобы брать фото у собственника. Количество звонков по объявлению удвоилось за два месяца. С тех пор мы ни разу не опубликовали объект, который не видели своими глазами.",
  },
  {
    ro: "Astăzi suntem patru agenți și ținem un portofoliu deliberat mic. Nu urmărim să avem cele mai multe anunțuri din Chișinău — urmărim ca fiecare anunț de pe site să fie real, disponibil și cu prețul verificat față de sectorul lui. De acolo vine și Indicele ARCA: dacă tot măsurăm piața pentru noi, e corect să vadă și cumpărătorul cifrele.",
    ru: "Сегодня нас четверо, и мы намеренно держим небольшой портфель. Мы не стремимся иметь больше всех объявлений в Кишинёве — мы стремимся к тому, чтобы каждое объявление на сайте было настоящим, доступным и с ценой, сверенной со своим сектором. Отсюда и Индекс ARCA: если мы всё равно измеряем рынок для себя, честно показать цифры и покупателю.",
  },
];

const QUOTE: T = {
  ro: "Un client care cumpără o dată la zece ani nu are cum să știe la ce să se uite. Treaba noastră e să știm noi și să spunem cu voce tare, inclusiv când răspunsul e „nu cumpăra asta”.",
  ru: "Клиент, который покупает раз в десять лет, не может знать, на что смотреть. Наша работа — знать это за него и говорить вслух, в том числе когда ответ «не покупайте это».",
};

const METHOD: { title: T; text: T; image: string }[] = [
  {
    title: { ro: "Selectăm, nu listăm", ru: "Отбираем, а не публикуем" },
    text: {
      ro: "Din zece proprietăți care ne sunt propuse într-o lună, luăm în portofoliu între trei și cinci. Refuzăm prețurile nerealiste, apartamentele cu acte neclare și proprietarii care nu vor să lase fotograful înăuntru. E mai puțin de vândut, dar nimic din ce vedeți pe site nu vă pierde ziua.",
      ru: "Из десяти объектов, которые нам предлагают за месяц, в портфель мы берём три-пять. Отказываем при нереальной цене, неясных документах и собственникам, которые не пускают фотографа. Продавать меньше, зато ничто на сайте не потратит ваш день впустую.",
    },
    image: "/img/apt-02.jpg",
  },
  {
    title: { ro: "Fotografiem noi", ru: "Снимаем сами" },
    text: {
      ro: "Fiecare apartament e fotografiat de agenție, la lumină de zi, cu aceeași lentilă și aceeași temperatură de culoare. Nu folosim poze de la proprietar, nu punem watermark peste jumătate de cadru și nu retușăm pereții. Fotografiile de pe site sunt apartamentul, nu o versiune mai bună a lui.",
      ru: "Каждую квартиру снимает агентство, при дневном свете, одним объективом и с одной цветовой температурой. Мы не используем фото собственника, не ставим водяной знак на пол-кадра и не ретушируем стены. Фотографии на сайте — это квартира, а не её улучшенная версия.",
    },
    image: "/img/apt-09.jpg",
  },
  {
    title: { ro: "Verificăm actele", ru: "Проверяем документы" },
    text: {
      ro: "Înainte de anunț cerem extrasul din registrul bunurilor imobile și verificăm proprietarii, grevările și corespondența dintre suprafața din acte și cea reală. Dacă apare o problemă, o spunem cumpărătorului la prima vizionare, nu la notar.",
      ru: "До публикации мы запрашиваем выписку из реестра недвижимости и проверяем собственников, обременения и соответствие площади в документах фактической. Если находим проблему, говорим покупателю на первом просмотре, а не у нотариуса.",
    },
    image: "/img/block-03.jpg",
  },
  {
    title: { ro: "Rămânem după semnătură", ru: "Остаёмся после подписи" },
    text: {
      ro: "Contractul la notar nu e sfârșitul tranzacției. Rămânem pentru transferul contoarelor, predarea cheilor, actul de primire-predare și, dacă e nevoie, pentru discuția cu asociația de locatari. Costă timpul nostru, nu banii dumneavoastră.",
      ru: "Договор у нотариуса — не конец сделки. Мы остаёмся на переоформление счётчиков, передачу ключей, акт приёма-передачи и, если нужно, на разговор с товариществом жильцов. Это стоит нашего времени, а не ваших денег.",
    },
    image: "/img/house-02.jpg",
  },
];

const SERVICES: { title: T; text: T; href: string; cta: T }[] = [
  {
    title: { ro: "Vânzare-cumpărare", ru: "Купля-продажа" },
    text: {
      ro: "Evaluare, ședință foto, promovare în română și rusă, filtrarea cumpărătorilor și asistență până la notar. Comisionul se plătește la semnare, nu în avans.",
      ru: "Оценка, фотосъёмка, продвижение на румынском и русском, отбор покупателей и сопровождение до нотариуса. Комиссия платится при подписании, а не авансом.",
    },
    href: "/vinde",
    cta: { ro: "Vinde cu ARCA", ru: "Продать с ARCA" },
  },
  {
    title: { ro: "Închiriere și administrare", ru: "Аренда и управление" },
    text: {
      ro: "Contracte pe termen lung, verificarea chiriașilor și administrarea completă pentru proprietarii care stau în altă țară: încasare, reparații mici, comunicarea cu asociația.",
      ru: "Долгосрочные договоры, проверка арендаторов и полное управление для собственников, живущих за границей: сбор платежей, мелкий ремонт, общение с товариществом.",
    },
    href: "/proprietati?tranzactie=chirie",
    cta: { ro: "Vezi chiriile", ru: "Смотреть аренду" },
  },
  {
    title: { ro: "Evaluare și consultanță juridică", ru: "Оценка и юридическая консультация" },
    text: {
      ro: "Evaluare scrisă în 24 de ore, verificarea actelor înainte de avans și redactarea antecontractului împreună cu juristul agenției.",
      ru: "Письменная оценка за 24 часа, проверка документов до задатка и составление предварительного договора вместе с юристом агентства.",
    },
    href: "/contact",
    cta: { ro: "Scrie-ne", ru: "Написать нам" },
  },
];

export default function AboutView({ portfolio }: { portfolio: number }) {
  const { t } = useLang();

  const figures: { value: string; label: T }[] = [
    { value: String(AGENCY.stats.years), label: { ro: "Ani pe piață", ru: "Лет на рынке" } },
    { value: String(portfolio), label: { ro: "Proprietăți în portofoliu", ru: "Объектов в портфеле" } },
    { value: String(AGENCY.stats.deals2025), label: { ro: "Tranzacții în 2025", ru: "Сделок в 2025" } },
    { value: String(AGENTS.length), label: { ro: "Agenți", ru: "Агентов" } },
    {
      value: `${AGENCY.stats.replyMinutes} min`,
      label: { ro: "Timp mediu de răspuns", ru: "Среднее время ответа" },
    },
  ];

  return (
    <>
      <PageIntro
        kicker={{ ro: "Despre agenție", ru: "Об агентстве" }}
        title={{
          ro: "14 ani în imobiliarele Chișinăului",
          ru: "14 лет на рынке недвижимости Кишинёва",
        }}
        lead={{
          ro: "ARCA e o agenție mică, cu portofoliu ținut deliberat scurt și cu patru oameni care își cunosc sectoarele stradă cu stradă. Nu avem cele mai multe anunțuri din oraș și nu ne propunem să le avem.",
          ru: "ARCA — небольшое агентство с намеренно коротким портфелем и четырьмя людьми, которые знают свои секторы улица за улицей. У нас не самое большое число объявлений в городе, и мы к этому не стремимся.",
        }}
      />

      <div className={`wrap-wide ${styles.heroWrap}`}>
        <div className={`ph rvimg ${styles.hero}`}>
          <Image
            src="/img/office.jpg"
            alt={t({
              ro: "Biroul ARCA de pe bulevardul Ștefan cel Mare",
              ru: "Офис ARCA на бульваре Штефан чел Маре",
            })}
            fill
            priority
            sizes="(max-width:1440px) 100vw, 1440px"
          />
        </div>
      </div>

      <section className={`wrap ${styles.storySection}`}>
        <div className={styles.storyGrid}>
          <p className="kicker rv">{t({ ro: "Povestea", ru: "История" })}</p>
          <div className={styles.story}>
            {STORY.map((paragraph, i) => (
              <p
                key={paragraph.ro.slice(0, 24)}
                className="rv"
                style={{ "--d": `${Math.min(i, 5) * 60}ms` } as React.CSSProperties}
              >
                {t(paragraph)}
              </p>
            ))}

            <blockquote className={`rv ${styles.quote}`}>
              <p>{t(QUOTE)}</p>
              <footer className={styles.quoteFoot}>
                Andrei Cebotari · {t({ ro: "fondator", ru: "основатель" })}
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className={`wrap ${styles.figuresSection}`}>
        <ul className={`rv ${styles.figures}`}>
          {figures.map((f) => (
            <li key={f.label.ro} className={styles.figure}>
              <span className={`num ${styles.figureValue}`}>{f.value}</span>
              <span className={styles.figureLabel}>{t(f.label)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={`wrap ${styles.methodSection}`}>
        <p className="kicker rv">{t({ ro: "Cum lucrăm", ru: "Как мы работаем" })}</p>
        <h2 className={`rv ${styles.methodTitle}`}>
          {t({ ro: "Patru reguli pe care nu le negociem", ru: "Четыре правила, которые мы не обсуждаем" })}
        </h2>

        <ol className={styles.method}>
          {METHOD.map((band, i) => (
            <li key={band.title.ro} className={`rv ${styles.band} ${i % 2 ? styles.bandFlip : ""}`}>
              <div className={`ph rvimg ${styles.bandPhoto}`}>
                <Image
                  src={band.image}
                  alt={t(band.title)}
                  fill
                  sizes="(max-width:900px) 100vw, 480px"
                />
              </div>
              <div className={styles.bandBody}>
                <span className={`num ${styles.bandNumber}`}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.bandTitle}>{t(band.title)}</h3>
                <p className={styles.bandText}>{t(band.text)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={`wrap ${styles.servicesSection}`}>
        <p className="kicker rv">{t({ ro: "Serviciile noastre", ru: "Наши услуги" })}</p>
        <ul className={`grid-cards ${styles.services}`}>
          {SERVICES.map((service, i) => (
            <li
              key={service.title.ro}
              className={`rv ${styles.service}`}
              style={{ "--d": `${Math.min(i, 5) * 60}ms` } as React.CSSProperties}
            >
              <h3 className={styles.serviceTitle}>{t(service.title)}</h3>
              <p className={styles.serviceText}>{t(service.text)}</p>
              <Link href={service.href} className={styles.serviceLink}>
                <span>{t(service.cta)}</span>
                <IconArrowRight size={17} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={`wrap ${styles.teamSection}`}>
        <div className={`rv ${styles.teamHead}`}>
          <div>
            <p className="kicker">{t({ ro: "Echipa", ru: "Команда" })}</p>
            <h2 className={styles.teamTitle}>
              {t({ ro: "Oamenii care răspund la telefon", ru: "Люди, которые берут трубку" })}
            </h2>
          </div>
          <Link href="/agenti" className={styles.teamAll}>
            <span>{t({ ro: "Toți agenții", ru: "Все агенты" })}</span>
            <IconArrowRight size={17} />
          </Link>
        </div>

        <ul className={styles.team}>
          {AGENTS.map((agent, i) => (
            <li
              key={agent.slug}
              className={`rv ${styles.member}`}
              style={{ "--d": `${Math.min(i, 5) * 60}ms` } as React.CSSProperties}
            >
              <Link href={`/agenti/${agent.slug}`}>
                <div className="ph ph-portrait">
                  <Image
                    src={agent.photo.src}
                    alt={t(agent.photo.alt)}
                    fill
                    sizes="(max-width:700px) 50vw, 270px"
                  />
                </div>
                <h3 className={styles.memberName}>{agent.name}</h3>
                <p className={styles.memberRole}>{t(agent.role)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={`wrap ${styles.officeSection}`}>
        <div className={styles.officeGrid}>
          <div className="rv">
            <p className="kicker">{t({ ro: "Biroul", ru: "Офис" })}</p>
            <h2 className={styles.officeTitle}>
              {t({ ro: "Ne găsiți în Centru", ru: "Мы находимся в Центре" })}
            </h2>

            <dl className={styles.officeFacts}>
              <dt className={styles.officeDt}>{t({ ro: "Adresa", ru: "Адрес" })}</dt>
              <dd className={styles.officeDd}>{t(AGENCY.address)}</dd>

              <dt className={styles.officeDt}>{t({ ro: "Program", ru: "График" })}</dt>
              <dd className={styles.officeDd}>{t(AGENCY.schedule)}</dd>

              <dt className={styles.officeDt}>{t({ ro: "Telefon", ru: "Телефон" })}</dt>
              <dd className={styles.officeDd}>
                <a href={AGENCY.phoneHref} className="num">
                  {AGENCY.phone}
                </a>
                <br />
                <a href={AGENCY.mobileHref} className="num">
                  {AGENCY.mobile}
                </a>
              </dd>

              <dt className={styles.officeDt}>Email</dt>
              <dd className={styles.officeDd}>
                <a href={`mailto:${AGENCY.email}`}>{AGENCY.email}</a>
              </dd>
            </dl>

            <Link href="/contact" className={`btn ${styles.officeBtn}`}>
              {t({ ro: "Scrie-ne", ru: "Написать нам" })}
            </Link>
          </div>

          <div className="rv" style={{ "--d": "120ms" } as React.CSSProperties}>
            <OfficeMap ratio="tall" />
          </div>
        </div>
      </section>
    </>
  );
}
