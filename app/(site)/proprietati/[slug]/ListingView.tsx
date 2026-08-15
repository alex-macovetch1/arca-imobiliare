"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AgentCard from "@/components/AgentCard";
import { Fake } from "@/components/DemoBar";
import Gallery, { type GalleryBadge } from "@/components/Gallery";
import { IconArrowRight, IconHeart, IconPin, IconShare } from "@/components/Icons";
import MortgageCalculator from "@/components/MortgageCalculator";
import PriceIndexBand from "@/components/PriceIndexBand";
import SimilarList from "@/components/SimilarList";
import ViewingForm from "@/components/ViewingForm";
import {
  AMENITY_LABEL,
  BUILDING_LABEL,
  CONDITION_LABEL,
  DEAL_LABEL,
  FLAG_LABEL,
  FUND_LABEL,
  HEATING_LABEL,
  KIND_LABEL,
  KIND_PLURAL,
  LAYOUT_LABEL,
  PARKING_LABEL,
  SECTOR_IN,
  SECTOR_LABEL,
  UI,
} from "@/lib/content";
import {
  EUR_MDL,
  formatArea,
  formatDate,
  formatDealPrice,
  formatLand,
  formatMeters,
  formatPrice,
  formatPricePerSqm,
  formatStreet,
  formatYear,
  toMDL,
} from "@/lib/format";
import { COMPLEX_BY_SLUG, complexName } from "@/lib/complexes";
import { toggleFavorite, useIsFavorite } from "@/lib/favorites";
import { useLang } from "@/lib/lang";
import { pricePosition } from "@/lib/market-index";
import type { Agent, Property, T } from "@/lib/types";
import { L, POI_GROUPS, ceilingFigure, floorFigure } from "./copy";
import styles from "./listing.module.css";

const SECTIONS: { id: string; label: T }[] = [
  { id: "prezentare", label: UI.overview },
  { id: "caracteristici", label: UI.features },
  { id: "facilitati", label: UI.amenities },
  { id: "localizare", label: UI.locationSection },
  { id: "costuri", label: UI.costs },
  { id: "similare", label: UI.similar },
];

type Props = { property: Property; agent: Agent; similar: Property[] };

/** The affirmative mark on an amenity. Kept here: nothing else on the site says it. */
function Tick({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  );
}

export default function ListingView({ property: p, agent, similar }: Props) {
  const { t, lang } = useLang();

  const [active, setActive] = useState(SECTIONS[0].id);
  const [copied, setCopied] = useState(false);
  const [wholeText, setWholeText] = useState(false);
  const [mapOn, setMapOn] = useState(false);

  /* Saved listings live in the browser, without an account. The same store
     backs the heart on the card and the counter in the header. */
  const saved = useIsFavorite(p.id);
  const position = pricePosition(p);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: t(p.title), url });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      /* nothing to do: the address bar still holds the link */
    }
  }

  /* --- the anchor bar follows the section under the header --- */
  useEffect(() => {
    const nodes = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (n): n is HTMLElement => n !== null
    );
    if (nodes.length === 0) return;

    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const first = SECTIONS.find((s) => visible.has(s.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-130px 0px -60% 0px" }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const badges: GalleryBadge[] = p.flags.map((f) => ({
    label: FLAG_LABEL[f],
    clay: f === "pret-redus",
  }));

  const paragraphs = useMemo(() => t(p.description).split("\n\n"), [p.description, t]);
  const shown = wholeText ? paragraphs : paragraphs.slice(0, 1);

  const stats: { label: T; value: string }[] = [
    ...(p.rooms > 0 ? [{ label: L.roomsShort, value: String(p.rooms) }] : []),
    { label: UI.area, value: formatArea(p.area, lang) },
    { label: UI.floorLabel, value: floorFigure(p.floor, p.floors, t) },
    { label: UI.year, value: String(p.year) },
  ];

  const facts: { label: T; value: string }[] = [
    { label: UI.fund, value: `${t(FUND_LABEL[p.fund])}, ${p.year}` },
    { label: UI.condition, value: t(CONDITION_LABEL[p.condition]) },
    {
      label: p.layout ? UI.layout : UI.propertyType,
      value: p.layout ? t(LAYOUT_LABEL[p.layout]) : t(KIND_LABEL[p.kind]),
    },
    { label: UI.available, value: t(p.availableFrom) },
  ];

  /* The five figures a buyer checks before reading a word. Everything else in
     this section is a detail, and reads as one. */
  const figures: { label: T; value: string }[] = [
    ...(p.rooms > 0 ? [{ label: L.roomsShort, value: String(p.rooms) }] : []),
    { label: UI.area, value: formatArea(p.area, lang) },
    { label: UI.floorLabel, value: floorFigure(p.floor, p.floors, t) },
    { label: UI.year, value: String(p.year) },
    { label: L.pricePerSqmShort, value: formatPricePerSqm(p.pricePerSqm, lang) },
  ];

  const rows: { label: T; value: React.ReactNode }[] = [];
  const add = (label: T, value: React.ReactNode) => {
    if (value !== null && value !== undefined && value !== "") rows.push({ label, value });
  };

  /* Rooms, area, floor and the year are the figures above; repeating them here
     is what made this read like a spreadsheet. */
  add(UI.propertyType, t(KIND_LABEL[p.kind]));
  add(L.dealRow, t(DEAL_LABEL[p.deal]));
  if (p.bedrooms) add(L.bedrooms, String(p.bedrooms));
  add(L.bathrooms, String(p.bathrooms));
  if (p.livingArea) add(L.livingArea, formatArea(p.livingArea, lang));
  if (p.kitchenArea) add(L.kitchenArea, formatArea(p.kitchenArea, lang));
  if (p.landArea) add(L.land, formatLand(p.landArea, lang));
  add(UI.fund, t(FUND_LABEL[p.fund]));
  add(L.yearBuilt, formatYear(p.year, p.yearStatus, lang));
  add(L.buildingType, t(BUILDING_LABEL[p.buildingType]));
  add(UI.condition, t(CONDITION_LABEL[p.condition]));
  if (p.ceilingHeight) add(L.ceiling, ceilingFigure(p.ceilingHeight, lang));
  add(L.heating, t(HEATING_LABEL[p.heating]));
  add(L.balconies, p.balconies > 0 ? String(p.balconies) : t(L.none));
  if (p.layout) add(UI.layout, t(LAYOUT_LABEL[p.layout]));
  add(L.parking, t(PARKING_LABEL[p.parking]));
  if (p.developer) add(L.developer, p.developer);
  if (p.complexSlug)
    add(
      L.complex,
      // A listing typed into the panel can name a complex we have no page for.
      COMPLEX_BY_SLUG[p.complexSlug] ? (
        <Link href={`/complexe/${p.complexSlug}`} className="link">
          {complexName(p.complexSlug)}
        </Link>
      ) : (
        complexName(p.complexSlug)
      )
    );
  add(L.availability, t(p.availableFrom));
  add(L.offerCode, p.id);

  const poiGroups = POI_GROUPS.map((g) => ({
    title: g.title,
    items: p.poi.filter((x) => g.kinds.includes(x.kind)),
  })).filter((g) => g.items.length > 0);

  const { lat, lng } = p.coords;
  const box = [lng - 0.0075, lat - 0.0035, lng + 0.0075, lat + 0.0035]
    .map((n) => n.toFixed(5))
    .join(",");
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(box)}&layer=mapnik&marker=${lat},${lng}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <article className={styles.page}>
      <div className="wrap">
        <div className={styles.top}>
          <nav className={styles.crumbs} aria-label={t(L.trail)}>
            <Link href="/">{t(L.home)}</Link>
            <span aria-hidden="true">›</span>
            <Link href="/proprietati">{t(L.properties)}</Link>
            <span aria-hidden="true">›</span>
            <Link href={`/proprietati?tranzactie=${p.deal}`}>{t(DEAL_LABEL[p.deal])}</Link>
            <span aria-hidden="true">›</span>
            <Link href={`/proprietati?tip=${p.kind}`}>{t(KIND_PLURAL[p.kind])}</Link>
            <span aria-hidden="true">›</span>
            <Link href={`/proprietati?sector=${p.sector}`}>{t(SECTOR_LABEL[p.sector])}</Link>
            <span className={styles.crumbMeta}>
              {t(UI.code)}: {p.id} · {t(UI.updated)} {formatDate(p.updatedAt, lang)}
            </span>
          </nav>

          <header className={styles.title}>
            <p className="kicker">{t(SECTOR_LABEL[p.sector])}</p>
            <h1 className={styles.h1}>{t(p.title)}</h1>
            <p className={styles.address}>
              <IconPin size={18} />
              <span>{formatStreet(p.street, lang)}</span>
              {p.landmark && <span className={styles.landmark}>· {t(p.landmark)}</span>}
              <a href="#localizare" className="link">
                {t(UI.seeOnMap)}
              </a>
            </p>
          </header>

          <div className={styles.stats}>
            <div className={styles.priceCell}>
              <p className={`num ${styles.price}`}>{formatDealPrice(p, lang)}</p>
              <p className={styles.sqm}>
                {formatPricePerSqm(p.pricePerSqm, lang)}
                {p.deal === "chirie" ? ` ${t(L.perSqmMonth)}` : ""}
              </p>
              {p.previousPrice && (
                <p className={`num ${styles.oldPrice}`}>{formatPrice(p.previousPrice)}</p>
              )}
              {p.negotiable && !p.previousPrice && (
                <p className={styles.negotiable}>{t(UI.negotiable)}</p>
              )}
            </div>

            {stats.map((s) => (
              <div key={s.label.ro} className={styles.statCell}>
                <p className={`num ${styles.statValue}`}>{s.value}</p>
                <p className={styles.statLabel}>{t(s.label)}</p>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={`btn-line ${styles.action} ${saved ? styles.actionOn : ""}`}
              onClick={() => toggleFavorite(p.id)}
              aria-pressed={saved}
            >
              <IconHeart size={18} filled={saved} />
              {saved ? t(UI.saved) : t(UI.save)}
            </button>
            <button type="button" className={`btn-line ${styles.action}`} onClick={share}>
              <IconShare size={18} />
              {copied ? t(L.linkCopied) : t(UI.share)}
            </button>

            <div className={styles.flags}>
              {p.flags.map((f) => (
                <span key={f} className={styles.flag}>
                  {t(FLAG_LABEL[f])}
                </span>
              ))}
              {/* Price, address and every badge on this page are invented. */}
              <Fake />
            </div>
          </div>

          <div className={styles.gallery}>
            <Gallery photos={p.photos} badges={badges} vt={p.slug} />
          </div>
        </div>
      </div>

      <nav className={styles.anchors} aria-label={t(L.onThisPage)}>
        <div className={`wrap ${styles.anchorsInner}`}>
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`${styles.anchor} ${active === s.id ? styles.anchorOn : ""}`}
            >
              {t(s.label)}
            </a>
          ))}
        </div>
      </nav>

      <div className="wrap">
        <div className={styles.body}>
          <div className={styles.main}>
            <ul className={styles.facts}>
              {facts.map((f) => (
                <li key={f.label.ro} className={styles.fact}>
                  <span className={styles.factLabel}>{t(f.label)}</span>
                  <span className={styles.factValue}>{f.value}</span>
                </li>
              ))}
            </ul>

            <section id="prezentare" className={`rv ${styles.section}`}>
              <div className={styles.head}>
                <span className={styles.rule} aria-hidden="true" />
                <h2>{t(UI.overview)}</h2>
              </div>
              <div className={styles.text}>
                {shown.map((par, i) => (
                  <p key={i}>{par}</p>
                ))}
              </div>
              {paragraphs.length > 1 && !wholeText && (
                <button
                  type="button"
                  className={`link ${styles.readAll}`}
                  onClick={() => setWholeText(true)}
                >
                  {t(UI.readAll)}
                </button>
              )}
            </section>

            <section id="caracteristici" className={`rv ${styles.section}`}>
              <div className={styles.head}>
                <span className={styles.rule} aria-hidden="true" />
                <h2>{t(UI.features)}</h2>
              </div>

              <ul className={styles.figures}>
                {figures.map((f, i) => (
                  <li
                    key={f.label.ro}
                    className={styles.figure}
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <span className={`num ${styles.figureValue}`}>{f.value}</span>
                    <span className={styles.figureLabel}>{t(f.label)}</span>
                  </li>
                ))}
              </ul>

              <dl className={styles.table}>
                {rows.map((r) => (
                  <div key={r.label.ro} className={styles.tableRow}>
                    <dt className={styles.dt}>{t(r.label)}</dt>
                    <dd className={styles.dd}>{r.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {p.amenities.length > 0 && (
              <section id="facilitati" className={`rv ${styles.section}`}>
                <div className={styles.head}>
                  <span className={styles.rule} aria-hidden="true" />
                  <h2>{t(UI.amenities)}</h2>
                </div>
                <ul className={styles.chips}>
                  {p.amenities.map((a, i) => (
                    <li
                      key={a}
                      className={styles.chip}
                      style={{ "--i": i } as React.CSSProperties}
                    >
                      <Tick />
                      {t(AMENITY_LABEL[a])}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section id="localizare" className={`rv ${styles.section}`}>
              <div className={styles.head}>
                <span className={styles.rule} aria-hidden="true" />
                <h2>{t(UI.locationSection)}</h2>
              </div>

              {/* The embed pulls a third-party script and its tiles, so it stays
                  unmounted until it is asked for. The frame keeps its ratio
                  either way, so opening the map cannot move the page. */}
              <div className={styles.map}>
                {mapOn ? (
                  <iframe
                    src={mapSrc}
                    title={`${t(L.mapTitle)} — ${formatStreet(p.street, lang)}`}
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <button
                    type="button"
                    className={styles.poster}
                    onClick={() => setMapOn(true)}
                  >
                    <Image
                      src="/harti/chisinau.jpg"
                      alt={t(L.planAlt)}
                      fill
                      sizes="(max-width: 1099px) 100vw, 732px"
                      className={styles.posterImg}
                    />
                    <span className={styles.posterPlate}>
                      <span className={styles.posterAddress}>
                        <IconPin size={18} />
                        {formatStreet(p.street, lang)}, {t(SECTOR_LABEL[p.sector])}
                      </span>
                      <span className={styles.posterAction}>{t(L.showMap)}</span>
                    </span>
                  </button>
                )}
              </div>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`link ${styles.mapLink}`}
              >
                {t(L.openInMaps)}
              </a>

              {poiGroups.length > 0 && (
                <div className={styles.poi}>
                  <h3 className={styles.h3}>{t(UI.pointsOfInterest)}</h3>
                  <div className={styles.poiGrid}>
                    {poiGroups.map((g) => (
                      <div key={g.title.ro}>
                        <p className={styles.poiTitle}>{t(g.title)}</p>
                        <ul>
                          {g.items.map((item, i) => (
                            <li key={i} className={styles.poiItem}>
                              <span>{t(item.name)}</span>
                              <span className={`num ${styles.poiMeters}`}>
                                {formatMeters(item.meters, lang)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section id="costuri" className={`rv ${styles.section}`}>
              <div className={styles.head}>
                <span className={styles.rule} aria-hidden="true" />
                <h2>{t(UI.costs)}</h2>
              </div>
              {p.deal === "vanzare" ? (
                <>
                  {position && (
                    <div className={styles.position}>
                      <PriceIndexBand position={position} sector={p.sector} />
                    </div>
                  )}
                  <p className={`lead ${styles.sectionLead}`}>{t(L.costsLead)}</p>
                  <MortgageCalculator price={p.price} />
                </>
              ) : (
                <p className={`lead ${styles.sectionLead}`}>{t(L.rentCosts)}</p>
              )}
              <p className={`legal ${styles.mdl}`}>
                {toMDL(p.price)} · {t(L.inMdl)} {String(EUR_MDL).replace(".", ",")} MDL/€
              </p>
            </section>
          </div>

          <aside className={styles.side} id="programare">
            <AgentCard agent={agent} />
            <ViewingForm property={p} agent={agent} />
            <p className={styles.sideMeta}>
              {t(UI.code)}: {p.id} ·{" "}
              <a
                href={`mailto:${agent.email}?subject=${encodeURIComponent(`ARCA ${p.id}`)}`}
                className="link"
              >
                {t(UI.reportError)}
              </a>
            </p>
          </aside>
        </div>
      </div>

      {similar.length > 0 && (
        <section id="similare" className={`wrap sec ${styles.anchored}`}>
          <div className={`rv ${styles.head}`}>
            <span className={styles.rule} aria-hidden="true" />
            <h2>{t(UI.similar)}</h2>
          </div>
          <div className={styles.similar}>
            <SimilarList properties={similar} />
          </div>
          <Link href={`/proprietati?sector=${p.sector}`} className={`link ${styles.more}`}>
            {t(L.allInSector)} {t(SECTOR_IN[p.sector])}
            <IconArrowRight size={16} />
          </Link>
        </section>
      )}

      {/* Sticky rather than fixed: it rides the article and never covers the
          footer once the page runs out. */}
      <div className={styles.bottomBar}>
        <a href={agent.phoneHref} className={`btn-line ${styles.bottomBtn}`}>
          {t(UI.call)}
        </a>
        <a href="#programare" className={`btn ${styles.bottomBtn}`}>
          {t(UI.bookViewing)}
        </a>
      </div>
    </article>
  );
}
