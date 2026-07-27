"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AGENCY, NAV, UI } from "@/lib/content";
import { useFavorites } from "@/lib/favorites";
import { useLang } from "@/lib/lang";
import { IconClose, IconHeart, IconMenu, IconPhone } from "./Icons";
import LangSwitch from "./LangSwitch";
import { Logo } from "./Logo";
import styles from "./Nav.module.css";

/**
 * Routes whose first section is a full-bleed photo. On those the header starts
 * transparent with white type and turns to paper past SOLID_AT. Add a route
 * here when you build a page that opens on a photograph — nothing else is
 * needed.
 */
const OVERLAY_ROUTES = ["/"];

/**
 * Routes that pin a bar of their own directly under the header — the filter row
 * on the results page, the anchor row on a listing. Retracting there would open
 * a strip of scrolling page above a bar that is not moving, so on these the
 * header stays put and the sub-bar keeps the offset it was built with.
 */
const PINNED_PREFIX = "/proprietati";

const SAVED_LABEL = { ro: "Proprietăți salvate", ru: "Сохранённые объекты" };

/** Where the header stops borrowing the photograph. */
const SOLID_AT = 60;
/** Above this the header always stays put — the top of a page is not a read. */
const KEEP_UNTIL = 150;
/** Enough travel to be a decision rather than a tremor. */
const STEP = 6;

type Spot = { x: number; w: number };

export default function Nav() {
  const { t, lang } = useLang();
  const path = usePathname();
  const saved = useFavorites();

  const [scrolled, setScrolled] = useState(false);
  const [away, setAway] = useState(false);
  const [menu, setMenu] = useState<"shut" | "open" | "closing">("shut");

  const navRef = useRef<HTMLElement | null>(null);
  const linkEls = useRef<(HTMLAnchorElement | null)[]>([]);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [hover, setHover] = useState<number | null>(null);

  const overlay = OVERLAY_ROUTES.includes(path);
  /* Derived, not stored: a page that does not open on a photo has to render its
     header on paper from the first frame, before any effect runs. */
  const solid = !overlay || scrolled;
  const retracts = !path.startsWith(PINNED_PREFIX);
  const open = menu === "open";

  useEffect(() => {
    let raf = 0;
    let last = window.scrollY;
    const read = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > SOLID_AT);
      // `last` only moves when the header does, so a slow scroll still adds up.
      if (y < KEEP_UNTIL) {
        setAway(false);
        last = y;
      } else if (y - last > STEP) {
        setAway(true);
        last = y;
      } else if (last - y > STEP) {
        setAway(false);
        last = y;
      }
    };
    read();
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // A route change under a persistent layout leaves the drawer open otherwise.
  useEffect(() => {
    setMenu((m) => (m === "shut" ? m : "closing"));
  }, [path]);

  // The drawer covers the page; letting the body scroll behind it feels broken.
  useEffect(() => {
    document.body.style.overflow = menu === "shut" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  useEffect(() => {
    if (menu !== "open") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu("closing");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menu]);

  // Safety net: if the exit animation never reports back, drop the drawer anyway.
  useEffect(() => {
    if (menu !== "closing") return;
    const id = window.setTimeout(() => setMenu("shut"), 400);
    return () => window.clearTimeout(id);
  }, [menu]);

  /* The underline is one element. It needs to know where every link starts and
     how wide it is — which changes with the language, the viewport and the
     moment the font swaps in, hence the observer on the links themselves. */
  useEffect(() => {
    const measure = () => {
      const next = linkEls.current.map((el) => ({
        x: el?.offsetLeft ?? 0,
        w: el?.offsetWidth ?? 0,
      }));
      setSpots((prev) =>
        prev.length === next.length && next.every((s, i) => s.x === prev[i].x && s.w === prev[i].w)
          ? prev
          : next,
      );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    if (navRef.current) ro.observe(navRef.current);
    for (const el of linkEls.current) if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [lang]);

  /* Two menu entries share the /proprietati pathname and differ only by query,
     which a pathname cannot tell apart. Lighting both would say the reader is
     in two places at once, so an entry that filters through the query string
     never claims the mark and the rule simply stays down. */
  const isCurrent = (href: string) => !href.includes("?") && path === href;
  const current = NAV.findIndex((item) => isCurrent(item.href));
  const mark = hover ?? current;
  const spot = mark >= 0 ? spots[mark] : undefined;

  const railStyle = {
    "--x": `${spot?.x ?? 0}px`,
    "--w": spot?.w ?? 0,
    "--o": spot && spot.w > 0 ? 1 : 0,
  } as CSSProperties;

  return (
    <>
      <header
        className={`${styles.bar} ${solid ? styles.solid : ""} ${
          away && retracts && !open ? styles.away : ""
        }`}
      >
        <div className={styles.inner}>
          <Link href="/" className={styles.brand} aria-label={AGENCY.name}>
            <Logo className={styles.logo} />
          </Link>

          <nav
            ref={navRef}
            className={styles.nav}
            aria-label={AGENCY.name}
            style={railStyle}
            onMouseLeave={() => setHover(null)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHover(null);
            }}
          >
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => {
                  linkEls.current[i] = el;
                }}
                className={`${styles.link} ${isCurrent(item.href) ? styles.linkOn : ""}`}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
              >
                {t(item.label)}
              </Link>
            ))}
            <span className={styles.ink} aria-hidden="true" />
          </nav>

          <div className={styles.side}>
            <Link
              href="/favorite"
              className={styles.saved}
              aria-label={t(SAVED_LABEL)}
              title={t(SAVED_LABEL)}
            >
              <IconHeart size={19} filled={saved.length > 0} />
              {saved.length > 0 && <span className={`num ${styles.savedCount}`}>{saved.length}</span>}
            </Link>
            <LangSwitch dark={!solid} />
            <a href={AGENCY.mobileHref} className={styles.phone}>
              <IconPhone size={18} />
              <span>{AGENCY.mobile}</span>
            </a>
            <a href={AGENCY.mobileHref} className={`btn ${styles.cta}`}>
              {t(UI.callNow)}
            </a>
            <button
              type="button"
              className={styles.burger}
              onClick={() => setMenu("open")}
              aria-label={t(UI.openMenu)}
              aria-expanded={open}
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </header>

      {menu !== "shut" && (
        <div
          className={`${styles.drawer} ${menu === "closing" ? styles.drawerOut : ""}`}
          role="dialog"
          aria-modal="true"
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget && menu === "closing") setMenu("shut");
          }}
        >
          <div className={styles.drawerTop}>
            <Logo className={styles.logoDark} />
            <button
              type="button"
              className={styles.close}
              onClick={() => setMenu("closing")}
              aria-label={t(UI.closeMenu)}
            >
              <IconClose />
            </button>
          </div>

          <nav className={styles.drawerNav}>
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.drawerLink}
                style={{ "--i": i } as CSSProperties}
              >
                {t(item.label)}
              </Link>
            ))}
            <Link
              href="/favorite"
              className={styles.drawerLink}
              style={{ "--i": NAV.length } as CSSProperties}
            >
              {t(SAVED_LABEL)}
              {saved.length > 0 && (
                <span className={`num ${styles.drawerCount}`}>{saved.length}</span>
              )}
            </Link>
          </nav>

          <div className={styles.drawerFoot} style={{ "--i": NAV.length + 1 } as CSSProperties}>
            <LangSwitch dark />
            <a href={AGENCY.mobileHref} className={styles.drawerPhone}>
              {AGENCY.mobile}
            </a>
            <a href={AGENCY.mobileHref} className="btn btn-line btn-line-dark">
              {t(UI.callNow)}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
