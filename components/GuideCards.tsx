"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import type { T } from "@/lib/types";
import styles from "./GuideCards.module.css";

type Card = {
  href: string;
  image: string;
  alt: T;
  kicker: T;
  title: T;
  text: T;
  action: T;
};

const CARDS: Card[] = [
  {
    href: "/ghid",
    image: "/img/apt-09.jpg",
    alt: {
      ro: "Zonă de luat masa într-un apartament din Chișinău",
      ru: "Обеденная зона в кишинёвской квартире",
    },
    kicker: { ro: "Cumpărați prima dată?", ru: "Покупаете впервые?" },
    title: { ro: "Ghidul cumpărătorului", ru: "Гид покупателя" },
    text: {
      ro: "Pașii unei tranzacții, actele care se verifică înainte de avans și cele zece minute de la vizionare care vă scutesc de un an de regrete.",
      ru: "Шаги сделки, документы, которые проверяются до задатка, и те десять минут на просмотре, которые избавляют от года сожалений.",
    },
    action: { ro: "Citește ghidul", ru: "Читать гид" },
  },
  {
    href: "/credit",
    image: "/img/block-06.jpg",
    alt: {
      ro: "Fațada unui bloc nou din Chișinău",
      ru: "Фасад новостройки в Кишинёве",
    },
    kicker: { ro: "Cumpărați cu credit?", ru: "Покупаете в кредит?" },
    title: { ro: "Credit ipotecar", ru: "Ипотека" },
    text: {
      ro: "Cât ar fi rata lunară, ce avans cer băncile din Moldova, ce acte se pregătesc și în cât timp se aprobă un dosar.",
      ru: "Каким будет ежемесячный платёж, какой взнос просят банки Молдовы, какие документы готовить и за сколько одобряют досье.",
    },
    action: { ro: "Deschide calculatorul", ru: "Открыть калькулятор" },
  },
];

/** Two doors out of the homepage for the visitor who is not ready to search. */
export default function GuideCards() {
  const { t } = useLang();

  return (
    <section className="wrap sec">
      <div className={styles.grid}>
        {CARDS.map((card, i) => (
          <article
            key={card.href}
            className={`${styles.card} rv`}
            style={{ "--d": `${Math.min(i, 5) * 60}ms` } as React.CSSProperties}
          >
            <Link href={card.href} className={styles.link}>
              <span className={`ph ${styles.photo} rvimg`}>
                <Image
                  src={card.image}
                  alt={t(card.alt)}
                  fill
                  sizes="(max-width: 899px) 100vw, 561px"
                />
              </span>

              <span className={styles.body}>
                <span className="kicker">{t(card.kicker)}</span>
                <span className={styles.title}>{t(card.title)}</span>
                <span className={styles.text}>{t(card.text)}</span>
                <span className={styles.action}>{t(card.action)} →</span>
              </span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
