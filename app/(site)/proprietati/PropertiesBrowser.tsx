"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Fake } from "@/components/DemoBar";
import Filters from "@/components/Filters";
import FiltersPanel from "@/components/FiltersPanel";
import type { Filters as FilterState } from "@/components/FiltersCore";
import {
  activeChips,
  activeCount,
  applyFilters,
  clearFilters,
  parseFilters,
  PER_PAGE,
  relaxations,
  sortProperties,
  toQuery,
} from "@/components/FiltersCore";
import { IconChevron, IconClose, IconPhone } from "@/components/Icons";
import { Arch } from "@/components/Logo";
import MapPanel from "@/components/MapPanel";
import PropertyCard from "@/components/PropertyCard";
import SortBar from "@/components/SortBar";
import {
  AGENCY,
  DEAL_LABEL,
  KIND_PLURAL,
  LINK_GROUPS,
  SECTOR_IN,
  SECTOR_LABEL,
  UI,
} from "@/lib/content";
import { formatCount, formatPricePerSqm, normalizePhone } from "@/lib/format";
import { useLang } from "@/lib/lang";
import { sectorMedian } from "@/lib/market-index";
import { SECTOR_BY_SLUG } from "@/lib/sectors";
import type { Property, T } from "@/lib/types";
import styles from "./PropertiesBrowser.module.css";

const COPY = {
  home: { ro: "Acasă", ru: "Главная" },
  properties: { ro: "Proprietăți", ru: "Объекты" },
  genericTitle: { ro: "Proprietăți", ru: "Объекты" },
  forSale: { ro: "de vânzare", ru: "на продажу" },
  forRent: { ro: "de închiriat", ru: "в аренду" },
  inChisinau: { ro: "în Chișinău", ru: "в Кишинёве" },
  emptyLead: {
    ro: "Portofoliul se schimbă în fiecare săptămână. Relaxează un filtru sau spune-ne ce cauți și căutăm noi.",
    ru: "Портфель меняется каждую неделю. Ослабьте один фильтр или скажите, что ищете, и мы подберём.",
  },
  ctaTitle: { ro: "Nu găsești ce cauți?", ru: "Не нашли то, что искали?" },
  ctaText: {
    ro: "Spune-ne ce cauți și ce buget ai. Jumătate din ofertele noastre pleacă înainte să apuce să fie publicate.",
    ru: "Скажите, что ищете и какой у вас бюджет. Половина наших предложений уходит до публикации.",
  },
  ctaDone: {
    ro: "Vă sunăm în cel mult o oră, în programul agenției.",
    ru: "Перезвоним в течение часа, в рабочее время агентства.",
  },
  searchingFor: { ro: "Caut", ru: "Ищу" },
  seoTitle: { ro: "Despre acest sector", ru: "Об этом секторе" },
  medianLine: {
    ro: "Mediana ofertelor ARCA din acest sector",
    ru: "Медиана предложений ARCA в этом секторе",
  },
  indexLink: { ro: "Vezi Indicele ARCA", ru: "Смотреть Индекс ARCA" },
  searchesTitle: { ro: "Căutări frecvente", ru: "Частые запросы" },
  page: { ro: "Pagina", ru: "Страница" },
};

/* The two shortcut sets the footer stopped carrying: they are filter links, so
   the results page is where they belong. */
const SEARCH_GROUPS = [LINK_GROUPS.camere, LINK_GROUPS.tipuri];

/* The bar above already carries these on its own pills, and a pill that holds a
   value says the value out loud. Repeating them underneath as removable chips
   printed the search twice; the row now shows only what lives inside the
   "Filtre" panel, which has no other visible trace on the page. */
const SAID_BY_THE_BAR = /^(q|tip-|sector-|camere-|pretMin|pretMax)/;

const ROOMS_TITLE: Record<number, T> = {
  1: { ro: "cu 1 cameră", ru: "1-комнатные" },
  2: { ro: "cu 2 camere", ru: "2-комнатные" },
  3: { ro: "cu 3 camere", ru: "3-комнатные" },
  4: { ro: "cu 4+ camere", ru: "4-комнатные и больше" },
};

function lower(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/** The H1 is the sentence the visitor would have typed into Google. */
function headline(f: FilterState): T {
  const kind = f.kinds.length === 1 ? KIND_PLURAL[f.kinds[0]] : COPY.genericTitle;
  const withRooms =
    f.rooms.length === 1 &&
    f.kinds.length === 1 &&
    (f.kinds[0] === "apartament" || f.kinds[0] === "casa");
  const rooms = withRooms ? ROOMS_TITLE[f.rooms[0]] : null;
  const deal = f.deal === "chirie" ? COPY.forRent : COPY.forSale;
  const where =
    f.sectors.length === 1 ? SECTOR_IN[f.sectors[0]] : f.sectors.length ? null : COPY.inChisinau;

  const ro = [kind.ro, rooms?.ro, deal.ro, where?.ro].filter(Boolean).join(" ");
  const ru = [rooms?.ru, rooms ? lower(kind.ru) : kind.ru, deal.ru, where?.ru]
    .filter(Boolean)
    .join(" ");
  return { ro, ru };
}

/** The portfolio arrives from the server, already merged with the panel's work. */
export default function PropertiesBrowser({ items }: { items: Property[] }) {
  const { t, lang } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [panelOpen, setPanelOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const lastPage = useRef(1);

  const filters = useMemo(() => parseFilters(params), [params]);

  const apply = (next: FilterState) => {
    const query = toQuery(next);
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const matched = useMemo(() => applyFilters(items, filters), [items, filters]);
  const sorted = useMemo(() => sortProperties(matched, filters.sort), [matched, filters.sort]);

  const pages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const page = Math.min(filters.page, pages);
  const shown = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Paging keeps the scroll position by default, which lands the visitor in the
  // middle of a fresh page of cards.
  useEffect(() => {
    if (lastPage.current !== page) {
      lastPage.current = page;
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  const chips = activeChips(filters);
  const panelChips = chips.filter((c) => !SAID_BY_THE_BAR.test(c.id));
  const title = headline(filters);
  const sector = filters.sectors.length === 1 ? SECTOR_BY_SLUG[filters.sectors[0]] : null;

  // The figure comes from the index, not from a local sum: /indice, /vinde and
  // the listing pages all have to quote the same median.
  const median = sector ? sectorMedian(sector.slug, filters.deal) : 0;

  const wanted = chips.map((c) => t(c.label)).join(" · ");

  return (
    <>
      <div className={`wrap ${styles.crumbs}`}>
        <nav aria-label={t(COPY.properties)}>
          <ol className={styles.crumbList}>
            <li>
              <Link href="/">{t(COPY.home)}</Link>
            </li>
            <li>
              <Link href="/proprietati">{t(COPY.properties)}</Link>
            </li>
            <li aria-current="page">{t(DEAL_LABEL[filters.deal])}</li>
            {filters.kinds.length === 1 && <li>{t(KIND_PLURAL[filters.kinds[0]])}</li>}
            {filters.sectors.length === 1 && <li>{t(SECTOR_LABEL[filters.sectors[0]])}</li>}
          </ol>
        </nav>
      </div>

      <Filters
        filters={filters}
        base={items}
        onChange={apply}
        panelOpen={panelOpen}
        onTogglePanel={() => setPanelOpen((v) => !v)}
      />

      {panelOpen && (
        <FiltersPanel
          filters={filters}
          base={items}
          total={sorted.length}
          onChange={apply}
          onClose={() => setPanelOpen(false)}
        />
      )}

      <div className={`wrap ${styles.main}`}>
        <div className={styles.head}>
          <h1>{t(title)}</h1>
          {sector && <p className="lead">{t(sector.blurb)}</p>}
          {/* The whole portfolio is invented: count, prices, addresses, badges. */}
          <Fake block />
        </div>

        <SortBar
          total={sorted.length}
          sort={filters.sort}
          view={filters.view}
          onSort={(sort) => apply({ ...filters, sort, page: 1 })}
          onView={(view) => apply({ ...filters, view })}
        />

        {panelChips.length > 0 && (
          <div className={styles.chipRow}>
            {panelChips.map((c) => (
              <button
                key={c.id}
                type="button"
                className={styles.chip}
                onClick={() => apply(c.next)}
              >
                {t(c.label)}
                <IconClose size={14} />
              </button>
            ))}
          </div>
        )}

        <div ref={resultsRef} className={styles.results}>
          {filters.view === "harta" && sorted.length > 0 && (
            <div className={styles.mapBlock}>
              <MapPanel items={sorted} />
            </div>
          )}

          {shown.length > 0 ? (
            <div className={filters.view === "lista" ? styles.list : "grid-cards"}>
              {shown.map((p, i) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  layout={filters.view === "lista" ? "list" : "grid"}
                  delay={Math.min(i, 5) * 60}
                  priority={i < 3 && page === 1}
                />
              ))}
              {page === pages && filters.view !== "lista" && <SearchRequest summary={wanted} />}
            </div>
          ) : (
            <EmptyState base={items} filters={filters} onApply={apply} summary={wanted} />
          )}

          {filters.view === "lista" && shown.length > 0 && page === pages && (
            <div className={styles.listCta}>
              <SearchRequest summary={wanted} />
            </div>
          )}
        </div>

        {pages > 1 && (
          <Pager page={page} pages={pages} onGo={(p) => apply({ ...filters, page: p })} />
        )}

        {sector && (
          <section className={`${styles.seo} rv`}>
            <p className="kicker">{t(COPY.seoTitle)}</p>
            <h2 className={styles.seoTitle}>{t(SECTOR_LABEL[sector.slug])}</h2>
            <p className={styles.seoText}>{t(sector.about)}</p>
            <p className={styles.seoFacts}>
              <span className="num">
                {formatCount(matched.length, t(UI.propertiesOne), t(UI.properties), lang)}
              </span>
              {median > 0 && (
                <>
                  <span className={styles.sep} aria-hidden="true" />
                  <span>
                    {t(COPY.medianLine)}:{" "}
                    <span className="num">{formatPricePerSqm(median, lang)}</span>
                  </span>
                </>
              )}
            </p>
            <Link href="/indice" className="link">
              {t(COPY.indexLink)}
            </Link>
          </section>
        )}

        <section className={`${styles.searches} rv`} aria-label={t(COPY.searchesTitle)}>
          <p className="kicker">{t(COPY.searchesTitle)}</p>
          <div className={styles.searchCols}>
            {SEARCH_GROUPS.map((group) => (
              <div key={group.title.ro} className={styles.searchCol}>
                <h2 className={styles.searchTitle}>{t(group.title)}</h2>
                <div className={styles.searchList}>
                  {group.links.map((l) => (
                    <Link key={l.href} href={l.href} className={styles.searchLink}>
                      {t(l.label)}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------------
   The empty state. Three buttons that actually widen the search, not an
   apology.
   --------------------------------------------------------------------------- */

function EmptyState({
  base,
  filters,
  onApply,
  summary,
}: {
  base: Property[];
  filters: FilterState;
  onApply: (f: FilterState) => void;
  summary: string;
}) {
  const { t } = useLang();
  const options = relaxations(base, filters);

  return (
    <div className={styles.empty}>
      <Arch className={styles.emptyArch} />
      <h2 className={styles.emptyTitle}>{t(UI.emptyTitle)}</h2>
      <p className={styles.emptyLead}>{t(COPY.emptyLead)}</p>

      {options.length > 0 && (
        <div className={styles.emptyOptions}>
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              className="btn-line"
              onClick={() => onApply(o.next)}
            >
              {t(o.label)}
              <span className={`${styles.emptyCount} num`}>{o.count}</span>
            </button>
          ))}
        </div>
      )}

      {activeCount(filters) > 0 && (
        <button
          type="button"
          className={`link ${styles.emptyReset}`}
          onClick={() => onApply(clearFilters(filters))}
        >
          {t(UI.clearAll)}
        </button>
      )}

      <div className={styles.emptyForm}>
        <SearchRequest summary={summary} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   The last tile in the grid: the search that goes to a human.
   --------------------------------------------------------------------------- */

function SearchRequest({ summary }: { summary: string }) {
  const { t, lang } = useLang();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError(t(UI.errorName));
      return;
    }
    if (!normalizePhone(phone)) {
      setError(t(UI.errorPhone));
      return;
    }
    if (!consent) {
      setError(t(UI.errorConsent));
      return;
    }

    setError(null);
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "cautare",
          name: name.trim(),
          phone: phone.trim(),
          message: summary ? `${t(COPY.searchingFor)}: ${summary}` : undefined,
          lang,
          consent: true,
        }),
      });
      const data: { ok?: boolean } = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error("rejected");
      setState("done");
    } catch {
      setState("idle");
      setError(t(UI.errorGeneric));
    }
  };

  if (state === "done") {
    return (
      <div className={styles.cta}>
        <p className="kicker kicker-dark">{t(UI.successTitle)}</p>
        <p className={styles.ctaText}>{t(COPY.ctaDone)}</p>
        <a href={AGENCY.mobileHref} className={styles.ctaPhone}>
          <IconPhone size={18} />
          {AGENCY.mobile}
        </a>
      </div>
    );
  }

  return (
    <form className={styles.cta} onSubmit={send} noValidate>
      <h2 className={styles.ctaTitle}>{t(COPY.ctaTitle)}</h2>
      <p className={styles.ctaText}>{t(COPY.ctaText)}</p>

      <label className={styles.srOnly} htmlFor="cauta-nume">
        {t(UI.firstName)}
      </label>
      <input
        id="cauta-nume"
        className={styles.ctaField}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t(UI.firstName)}
        autoComplete="given-name"
      />

      <label className={styles.srOnly} htmlFor="cauta-telefon">
        {t(UI.phone)}
      </label>
      <input
        id="cauta-telefon"
        className={styles.ctaField}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder={t(UI.phone)}
        inputMode="tel"
        autoComplete="tel"
      />

      <label className={styles.ctaConsent}>
        <input type="checkbox" checked={consent} onChange={() => setConsent((v) => !v)} />
        <span>{t(UI.consent)}</span>
      </label>

      {error && <p className={styles.ctaError}>{error}</p>}

      <button type="submit" className={`btn-line btn-line-dark ${styles.ctaBtn}`} disabled={state === "sending"}>
        {state === "sending" ? t(UI.sending) : t(UI.send)}
      </button>
    </form>
  );
}

/* ---------------------------------------------------------------------------
   Numbered pages. No infinite scroll: an agent has to be able to send page 2.
   --------------------------------------------------------------------------- */

function Pager({
  page,
  pages,
  onGo,
}: {
  page: number;
  pages: number;
  onGo: (p: number) => void;
}) {
  const { t } = useLang();
  const numbers: (number | "gap")[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) numbers.push(i);
    else if (numbers[numbers.length - 1] !== "gap") numbers.push("gap");
  }

  return (
    <nav className={styles.pager} aria-label={t(COPY.page)}>
      <button
        type="button"
        className={styles.pageArrow}
        onClick={() => onGo(page - 1)}
        disabled={page === 1}
        aria-label={t(UI.back)}
      >
        <IconChevron size={18} className={styles.arrowBack} />
      </button>

      {numbers.map((n, i) =>
        n === "gap" ? (
          <span key={`gap-${i}`} className={styles.pageGap}>
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            className={`${styles.pageBtn} num ${n === page ? styles.pageOn : ""}`}
            onClick={() => onGo(n)}
            aria-current={n === page ? "page" : undefined}
          >
            {n}
          </button>
        )
      )}

      <button
        type="button"
        className={styles.pageArrow}
        onClick={() => onGo(page + 1)}
        disabled={page === pages}
        aria-label={t(UI.next)}
      >
        <IconChevron size={18} />
      </button>
    </nav>
  );
}
