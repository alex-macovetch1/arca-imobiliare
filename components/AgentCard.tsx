"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import type { Agent, T } from "@/lib/types";
import { IconArrowRight, IconViber, IconWhatsapp } from "./Icons";
import styles from "./AgentCard.module.css";

const A = {
  yourAgent: { ro: "Agentul proprietății", ru: "Агент объекта" },
  portfolio: { ro: "Vezi proprietățile agentului", ru: "Смотреть объекты агента" },
  since: { ro: "în ARCA din", ru: "в ARCA с" },
  deals: { ro: "tranzacții", ru: "сделок" },
} satisfies Record<string, T>;

/**
 * The number is printed, never hidden behind a form: half the calls in Moldova
 * start from the agent's face and phone, not from the agency.
 */
export default function AgentCard({ agent }: { agent: Agent }) {
  const { t } = useLang();

  return (
    <div className={styles.card}>
      <p className="kicker">{t(A.yourAgent)}</p>

      <div className={styles.head}>
        <div className={styles.avatar}>
          <Image
            src={agent.photo.src}
            alt={t(agent.photo.alt)}
            fill
            sizes="72px"
            className={styles.avatarImg}
          />
        </div>
        <div className={styles.who}>
          <p className={`serif ${styles.name}`}>{agent.name}</p>
          <p className={styles.role}>{t(agent.role)}</p>
        </div>
      </div>

      <a href={agent.phoneHref} className={`num ${styles.phone}`}>
        {agent.phone}
      </a>

      <p className={styles.meta}>
        <span className="num">{agent.deals}</span> {t(A.deals)} · {t(A.since)}{" "}
        <span className="num">{agent.since}</span>
      </p>

      <div className={styles.channels}>
        <a
          href={agent.whatsapp}
          className={`btn-line ${styles.channel}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconWhatsapp size={18} />
          WhatsApp
        </a>
        <a href={agent.viber} className={`btn-line ${styles.channel}`}>
          <IconViber size={18} />
          Viber
        </a>
      </div>

      <Link href={`/agenti/${agent.slug}`} className={styles.portfolio}>
        <span className="link">{t(A.portfolio)}</span>
        <IconArrowRight size={16} />
      </Link>
    </div>
  );
}
