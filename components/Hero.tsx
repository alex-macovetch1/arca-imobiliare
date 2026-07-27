"use client";

import Image from "next/image";
import { useLang } from "@/lib/lang";
import styles from "./Hero.module.css";

/**
 * The opening photograph. It carries no type: the headline and the search live
 * in the white card that overlaps its lower edge, so the picture stays whole.
 * The height is fixed in vh with a floor and a ceiling — never 100vh, because
 * the visitor has to see that something follows.
 */
export default function Hero() {
  const { t } = useLang();

  return (
    <section className={styles.hero}>
      <Image
        src="/img/hero.jpg"
        alt={t({
          ro: "Fațadă interbelică pe o stradă din centrul Chișinăului",
          ru: "Довоенный фасад на улице в центре Кишинёва",
        })}
        fill
        priority
        sizes="100vw"
        className={styles.img}
      />
    </section>
  );
}
