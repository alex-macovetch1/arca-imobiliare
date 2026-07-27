"use client";

import Image from "next/image";
import Link from "next/link";
import LeadRequestForm from "@/components/LeadRequestForm";
import PageIntro from "@/components/PageIntro";
import { IconArrowRight, IconPhone } from "@/components/Icons";
import { AGENTS } from "@/lib/agents";
import { AGENCY, SECTOR_LABEL } from "@/lib/content";
import { formatCount } from "@/lib/format";
import { useLang } from "@/lib/lang";
import styles from "./agents.module.css";

const LANGUAGE_LABEL = {
  ro: { ro: "română", ru: "румынский" },
  ru: { ro: "rusă", ru: "русский" },
  en: { ro: "engleză", ru: "английский" },
} as const;

export default function AgentsView({ counts }: { counts: Record<string, number> }) {
  const { t, lang } = useLang();
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <>
      <PageIntro
        kicker={{ ro: "Echipa", ru: "Команда" }}
        title={{ ro: "Agenții ARCA", ru: "Агенты ARCA" }}
        lead={{
          ro: "Patru oameni, fiecare cu sectoarele lui. Nu împărțim clienții pe rând: dacă sunați pentru un apartament din Botanica, vorbiți cu agentul care cunoaște fiecare bloc de acolo.",
          ru: "Четыре человека, у каждого свои секторы. Мы не распределяем клиентов по очереди: если вы звоните по квартире в Ботанике, вы говорите с агентом, который знает там каждый дом.",
        }}
        meta={{
          ro: `${AGENTS.length} agenți · ${formatCount(total, "proprietate", "proprietăți", "ro")} în lucru`,
          ru: `${AGENTS.length} агента · ${total} объектов в работе`,
        }}
      />

      <section className={`wrap ${styles.gridSection}`}>
        <ul className={styles.grid}>
          {AGENTS.map((agent, index) => (
            <li
              key={agent.slug}
              className={`rv ${styles.card}`}
              style={{ "--d": `${index * 70}ms` } as React.CSSProperties}
            >
              <Link href={`/agenti/${agent.slug}`} className={`ph ph-portrait ${styles.portrait}`}>
                <Image
                  src={agent.photo.src}
                  alt={t(agent.photo.alt)}
                  fill
                  sizes="(max-width:700px) 100vw, (max-width:1099px) 50vw, 270px"
                />
              </Link>

              <div className={styles.body}>
                <h2 className={styles.name}>
                  <Link href={`/agenti/${agent.slug}`}>{agent.name}</Link>
                </h2>
                <p className={styles.role}>{t(agent.role)}</p>

                <dl className={styles.facts}>
                  <dt className={styles.dt}>{t({ ro: "Sectoare", ru: "Секторы" })}</dt>
                  <dd className={styles.dd}>
                    {agent.sectors.map((s) => t(SECTOR_LABEL[s])).join(", ")}
                  </dd>

                  <dt className={styles.dt}>{t({ ro: "Limbi", ru: "Языки" })}</dt>
                  <dd className={styles.dd}>
                    {agent.languages.map((l) => t(LANGUAGE_LABEL[l])).join(", ")}
                  </dd>
                </dl>

                <a href={agent.phoneHref} className={styles.phone}>
                  <IconPhone size={17} />
                  <span className="num">{agent.phone}</span>
                </a>

                <Link href={`/agenti/${agent.slug}`} className={styles.more}>
                  <span>
                    {lang === "ru"
                      ? `${counts[agent.slug] ?? 0} объектов`
                      : formatCount(counts[agent.slug] ?? 0, "proprietate", "proprietăți", "ro")}
                  </span>
                  <IconArrowRight size={17} />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.hiring}>
        <div className={`wrap ${styles.hiringInner}`}>
          <div className="rv">
            <p className="kicker kicker-dark">{t({ ro: "Recrutare", ru: "Вакансии" })}</p>
            <h2 className={styles.hiringTitle}>
              {t({ ro: "Vrei să lucrezi la ARCA?", ru: "Хотите работать в ARCA?" })}
            </h2>
            <p className={styles.hiringText}>
              {t({
                ro: "Căutăm agenți care rămân în meserie, nu care încearcă o lună. Oferim portofoliu propriu de la prima săptămână, fotograf și marketing plătite de agenție, și un comision care crește după al zecelea contract. Experiența ajută, dar nu e obligatorie.",
                ru: "Мы ищем агентов, которые остаются в профессии, а не пробуют месяц. Даём собственный портфель с первой недели, фотографа и маркетинг за счёт агентства и комиссию, которая растёт после десятого договора. Опыт помогает, но не обязателен.",
              })}
            </p>
            <p className={styles.hiringNote}>
              {t({
                ro: `Sau sunați direct la ${AGENCY.phone}, întrebați de Andrei.`,
                ru: `Или позвоните напрямую: ${AGENCY.phone}, спросите Андрея.`,
              })}
            </p>
          </div>

          <div className={`rv ${styles.hiringForm}`} style={{ "--d": "100ms" } as React.CSSProperties}>
            <LeadRequestForm
              source="contact"
              dark
              fields={["name", "phone", "message"]}
              messagePlaceholder={{
                ro: "Scrieți în două rânduri ce ați lucrat până acum.",
                ru: "Напишите в двух строках, чем занимались до сих пор.",
              }}
              submitLabel={{ ro: "Trimite candidatura →", ru: "Отправить заявку →" }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
