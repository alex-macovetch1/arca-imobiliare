"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PageIntro from "@/components/PageIntro";
import PropertyCard from "@/components/PropertyCard";
import { Arch } from "@/components/Logo";
import { AGENCY, UI } from "@/lib/content";
import { formatCount, formatPrice } from "@/lib/format";
import { useFavorites } from "@/lib/favorites";
import { useLang } from "@/lib/lang";
import type { Property, T } from "@/lib/types";
import styles from "./favorites.module.css";

const F = {
  kicker: { ro: "Lista dumneavoastră", ru: "Ваш список" },
  title: { ro: "Proprietăți salvate", ru: "Сохранённые объекты" },
  lead: {
    ro: "Lista stă în browserul acestui dispozitiv, fără cont și fără parolă. Trimiteți-ne codurile și mergem la vizionare în aceeași zi.",
    ru: "Список хранится в браузере этого устройства, без аккаунта и пароля. Пришлите нам коды — и поедем на просмотр в тот же день.",
  },
  emptyLead: {
    ro: "Apăsați inima de pe orice anunț și apartamentul apare aici. Nimic nu pleacă de pe dispozitivul dumneavoastră.",
    ru: "Нажмите на сердце в любом объявлении, и квартира появится здесь. Ничего не уходит с вашего устройства.",
  },
  browse: { ro: "Vezi proprietățile", ru: "Смотреть объекты" },
  gone: {
    ro: "Un anunț salvat a fost retras între timp și nu mai apare în listă.",
    ru: "Одно из сохранённых объявлений сняли, и оно больше не показывается в списке.",
  },
  sumTitle: { ro: "Total pe listă", ru: "Всего в списке" },
  sendTitle: { ro: "Le arătăm pe toate într-o singură zi", ru: "Покажем всё за один день" },
  sendText: {
    ro: "Sunați-ne cu codurile de mai sus și facem un traseu: trei-patru vizionări una după alta, în aceeași după-amiază.",
    ru: "Позвоните с кодами выше, и мы составим маршрут: три-четыре просмотра подряд, в один и тот же день.",
  },
  codes: { ro: "Codurile de pe listă", ru: "Коды из списка" },
} satisfies Record<string, T>;

export default function FavoritesView({ items }: { items: Property[] }) {
  const { t, lang } = useLang();
  const ids = useFavorites();
  const byId = useMemo(() => new Map(items.map((p) => [p.id, p])), [items]);

  /* The list lives in localStorage, so the first server render has nothing.
     Waiting for mount keeps the empty state from flashing over a full list. */
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const saved = ids
    .map((id) => byId.get(id))
    .filter((p): p is Property => p !== undefined && p.status !== "arhivat");

  const missing = ready && saved.length < ids.length;
  const total = saved
    .filter((p) => p.deal === "vanzare")
    .reduce((sum, p) => sum + p.price, 0);

  return (
    <>
      <PageIntro
        kicker={F.kicker}
        title={F.title}
        lead={saved.length > 0 ? F.lead : F.emptyLead}
        meta={
          ready && saved.length > 0
            ? {
                ro: formatCount(saved.length, "proprietate salvată", "proprietăți salvate", "ro"),
                ru: `${saved.length} сохранённых объектов`,
              }
            : undefined
        }
      />

      <div className="wrap">
        {!ready || saved.length === 0 ? (
          <div className={styles.empty}>
            <Arch className={styles.arch} />
            <p className={styles.emptyTitle}>{t(UI.emptySaved)}</p>
            <Link href="/proprietati" className="btn">
              {t(F.browse)}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid-cards">
              {saved.map((p, i) => (
                <PropertyCard key={p.id} property={p} delay={Math.min(i, 5) * 60} />
              ))}
            </div>

            {missing && <p className={`legal ${styles.gone}`}>{t(F.gone)}</p>}

            <div className={styles.foot}>
              <div className={styles.footBlock}>
                <p className="kicker">{t(F.codes)}</p>
                <p className={`num ${styles.codes}`}>{saved.map((p) => p.id).join(" · ")}</p>
                {total > 0 && (
                  <p className={`num ${styles.sum}`}>
                    {t(F.sumTitle)}: {formatPrice(total)}
                  </p>
                )}
              </div>

              <div className={styles.footBlock}>
                <h2 className={styles.sendTitle}>{t(F.sendTitle)}</h2>
                <p className={styles.sendText}>{t(F.sendText)}</p>
                <a href={AGENCY.mobileHref} className="btn">
                  {t(UI.callNow)} {AGENCY.mobile}
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
