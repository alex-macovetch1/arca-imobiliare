"use client";

import Image from "next/image";
import Link from "next/link";
import { UI } from "@/lib/content";
import { formatCount } from "@/lib/format";
import { useLang } from "@/lib/lang";
import type { Agent } from "@/lib/types";
import { IconPhone } from "./Icons";
import styles from "./AgentStrip.module.css";

export type AgentCard = { agent: Agent; count: number };

/** In Moldova the call goes to a person, not to an agency: the number is
 *  printed in full on the homepage, not hidden behind the agent's page. */
export default function AgentStrip({ items }: { items: AgentCard[] }) {
  const { t, lang } = useLang();

  return (
    <section className="wrap sec">
      <div className={`${styles.head} rv`}>
        <div>
          <p className="kicker">{t({ ro: "Echipa", ru: "Команда" })}</p>
          <h2 className={styles.title}>{t({ ro: "Agenții tăi", ru: "Ваши агенты" })}</h2>
        </div>
        <Link href="/agenti" className={styles.all}>
          {t({ ro: "Toți agenții →", ru: "Все агенты →" })}
        </Link>
      </div>

      <div className={styles.grid}>
        {items.map(({ agent, count }, i) => (
          <article
            key={agent.slug}
            className={`${styles.card} rv`}
            style={{ "--d": `${i * 80}ms` } as React.CSSProperties}
          >
            <Link href={`/agenti/${agent.slug}`} className={`ph ph-portrait ${styles.ph}`}>
              <Image
                src={agent.photo.src}
                alt={t(agent.photo.alt)}
                fill
                sizes="(max-width: 1099px) 50vw, 262px"
              />
            </Link>

            <h3 className={styles.name}>
              <Link href={`/agenti/${agent.slug}`} className={styles.nameLink}>
                {agent.name}
              </Link>
            </h3>
            <p className={styles.role}>{t(agent.role)}</p>

            <a href={agent.phoneHref} className={styles.phone}>
              <IconPhone size={16} />
              {agent.phone}
            </a>

            <Link href={`/agenti/${agent.slug}`} className={styles.link}>
              {formatCount(count, t(UI.propertiesOne), t(UI.properties), lang)} →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
