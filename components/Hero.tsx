"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import { Fake } from "./DemoBar";
import styles from "./Hero.module.css";

/**
 * The opening frame is a room, not a facade: people buy the inside. The
 * headline sits on the photograph rather than in a card below it, so the
 * picture and the promise arrive together. Height stops short of the viewport
 * on purpose — the fold has to show that something follows.
 */
export default function Hero({ total }: { total: number }) {
  const { t } = useLang();

  return (
    <section className={styles.hero}>
      <Image
        src="/img/apt-01.jpg"
        alt={t({
          ro: "Living luminos într-un apartament din Chișinău",
          ru: "Светлая гостиная в кишинёвской квартире",
        })}
        fill
        priority
        sizes="100vw"
        className={styles.img}
      />

      <div className={`wrap ${styles.inner}`}>
        <h1 className={styles.title}>
          <span className={`say ${styles.say}`}>{t({ ro: "Acasă", ru: "Дом" })}</span>{" "}
          {t({ ro: "începe aici.", ru: "начинается здесь." })}
        </h1>

        <p className={styles.lead}>
          {t({
            ro: `${total} de oferte în Chișinău și suburbii, fiecare cu prețul pe metru pătrat pus lângă mediana sectorului.`,
            ru: `${total} предложений в Кишинёве и пригородах — у каждого цена за квадратный метр рядом с медианой сектора.`,
          })}{" "}
          <Fake dark />
        </p>

        <div className={styles.actions}>
          <Link href="/proprietati" className={styles.primary}>
            {t({ ro: "Vezi ofertele", ru: "Смотреть предложения" })}
          </Link>
          <Link href="/vinde" className={styles.ghost}>
            {t({ ro: "Vreau să vând", ru: "Хочу продать" })}
          </Link>
        </div>
      </div>

    </section>
  );
}
