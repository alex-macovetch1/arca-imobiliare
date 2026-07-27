"use client";

import Image from "next/image";
import Link from "next/link";
import { IconPhone, IconViber, IconWhatsapp } from "@/components/Icons";
import LeadRequestForm from "@/components/LeadRequestForm";
import PropertyCard from "@/components/PropertyCard";
import { AGENCY, SECTOR_LABEL } from "@/lib/content";
import { useLang } from "@/lib/lang";
import type { Agent, Property, T } from "@/lib/types";
import styles from "./agent.module.css";

const LANGUAGE_LABEL = {
  ro: { ro: "Română", ru: "Румынский" },
  ru: { ro: "Rusă", ru: "Русский" },
  en: { ro: "Engleză", ru: "Английский" },
} as const;

const CURRENT_YEAR = 2026;

export default function AgentView({ agent, properties }: { agent: Agent; properties: Property[] }) {
  const { t, lang } = useLang();
  const yearsHere = CURRENT_YEAR - agent.since;

  const figures: { value: string; label: T }[] = [
    {
      value: String(agent.deals),
      label: { ro: "Tranzacții încheiate", ru: "Закрытых сделок" },
    },
    {
      value: String(yearsHere),
      label: { ro: "Ani în ARCA", ru: "Лет в ARCA" },
    },
    {
      value: String(properties.length),
      label: { ro: "Proprietăți în lucru", ru: "Объектов в работе" },
    },
    {
      value: `${AGENCY.stats.replyMinutes} min`,
      label: { ro: "Timp mediu de răspuns", ru: "Среднее время ответа" },
    },
  ];

  return (
    <>
      <nav className={`wrap ${styles.crumbs}`} aria-label={t({ ro: "Navigare", ru: "Навигация" })}>
        <Link href="/">{t({ ro: "Acasă", ru: "Главная" })}</Link>
        <span aria-hidden="true">›</span>
        <Link href="/agenti">{t({ ro: "Agenți", ru: "Агенты" })}</Link>
        <span aria-hidden="true">›</span>
        <span className={styles.crumbNow}>{agent.name}</span>
      </nav>

      <header className={`wrap ${styles.head}`}>
        <div className={`rvimg ${styles.portraitBox}`}>
          <div className="ph ph-portrait">
            <Image
              src={agent.photo.src}
              alt={t(agent.photo.alt)}
              fill
              priority
              sizes="(max-width:900px) 100vw, 380px"
            />
          </div>
        </div>

        <div className={styles.headBody}>
          <p className="kicker rv">{t(agent.role)}</p>
          <h1 className={`rv ${styles.name}`} style={{ "--d": "60ms" } as React.CSSProperties}>
            {agent.name}
          </h1>

          {agent.quote && (
            <blockquote className={`rv ${styles.quote}`} style={{ "--d": "120ms" } as React.CSSProperties}>
              {t(agent.quote)}
            </blockquote>
          )}

          <dl className={`rv ${styles.facts}`} style={{ "--d": "180ms" } as React.CSSProperties}>
            <div className={styles.fact}>
              <dt className={styles.factLabel}>{t({ ro: "Sectoare", ru: "Секторы" })}</dt>
              <dd className={styles.factValue}>
                {agent.sectors.map((s) => t(SECTOR_LABEL[s])).join(" · ")}
              </dd>
            </div>
            <div className={styles.fact}>
              <dt className={styles.factLabel}>{t({ ro: "Limbi", ru: "Языки" })}</dt>
              <dd className={styles.factValue}>
                {agent.languages.map((l) => t(LANGUAGE_LABEL[l])).join(" · ")}
              </dd>
            </div>
            <div className={styles.fact}>
              <dt className={styles.factLabel}>{t({ ro: "În imobiliare din", ru: "В недвижимости с" })}</dt>
              <dd className={`num ${styles.factValue}`}>{agent.since}</dd>
            </div>
          </dl>

          <div className={`rv ${styles.contact}`} style={{ "--d": "240ms" } as React.CSSProperties}>
            <a href={agent.phoneHref} className={`btn ${styles.callBtn}`}>
              <IconPhone size={17} />
              <span className="num">{agent.phone}</span>
            </a>
            <a href={agent.whatsapp} className="btn-line" target="_blank" rel="noreferrer">
              <IconWhatsapp size={17} />
              WhatsApp
            </a>
            <a href={agent.viber} className="btn-line">
              <IconViber size={17} />
              Viber
            </a>
          </div>

          <a href={`mailto:${agent.email}`} className={`link ${styles.email}`}>
            {agent.email}
          </a>
        </div>
      </header>

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

      <section className={`wrap ${styles.bioSection}`}>
        <p className="kicker rv">{t({ ro: "Despre", ru: "О себе" })}</p>
        <div className={`rv ${styles.bio}`} style={{ "--d": "120ms" } as React.CSSProperties}>
          {t(agent.bio)
            .split("\n")
            .filter(Boolean)
            .map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
        </div>
      </section>

      {properties.length > 0 && (
        <section className={`wrap ${styles.listSection}`}>
          <div className={`rv ${styles.listHead}`}>
            <div>
              <p className="kicker">{t({ ro: "Portofoliu", ru: "Портфель" })}</p>
              <h2 className={styles.listTitle}>
                {t({ ro: "Ce are în lucru", ru: "Что сейчас в работе" })}
              </h2>
            </div>
            <p className={`spec num ${styles.listCount}`}>
              {agent.name} ·{" "}
              {lang === "ru"
                ? `${properties.length} объектов`
                : `${properties.length} ${properties.length === 1 ? "proprietate" : "proprietăți"}`}
            </p>
          </div>

          <div className={`grid-cards ${styles.cards}`}>
            {properties.map((property, i) => (
              <PropertyCard key={property.id} property={property} delay={Math.min(i, 5) * 60} />
            ))}
          </div>
        </section>
      )}

      <section className={styles.writeSection}>
        <div className={`wrap ${styles.writeInner}`}>
          <div className="rv">
            <p className="kicker">{t({ ro: "Contact direct", ru: "Прямой контакт" })}</p>
            <h2 className={styles.writeTitle}>{t({ ro: "Scrie-i direct", ru: "Написать напрямую" })}</h2>
            <p className={`lead ${styles.writeLead}`}>
              {t({
                ro: "Mesajul ajunge doar la agentul acesta, nu la un birou general. Dacă e mai simplu la telefon, sunați — răspunde și sâmbăta.",
                ru: "Сообщение приходит только этому агенту, а не в общий офис. Если проще по телефону — звоните, он отвечает и в субботу.",
              })}
            </p>
            <a href={agent.phoneHref} className={`${styles.writePhone} num`}>
              {agent.phone}
            </a>
          </div>

          <div className={`rv ${styles.writeForm}`} style={{ "--d": "120ms" } as React.CSSProperties}>
            <LeadRequestForm
              source="agent"
              agentSlug={agent.slug}
              fields={["name", "phone", "email", "message"]}
              defaultMessage={{
                ro: `Bună ziua, aș vrea să discut cu ${agent.name} despre o proprietate.`,
                ru: `Здравствуйте, хотел(а) бы обсудить объект с ${agent.name}.`,
              }}
              submitLabel={{ ro: "Trimite mesajul →", ru: "Отправить сообщение →" }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
