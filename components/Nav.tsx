"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AGENCY, NAV, UI } from "@/lib/content";
import { useFavorites } from "@/lib/favorites";
import { useLang } from "@/lib/lang";
import { IconClose, IconHeart, IconMenu, IconPhone } from "./Icons";
import LangSwitch from "./LangSwitch";
import { Logo } from "./Logo";
import styles from "./Nav.module.css";

/**
 * Routes whose first section is a full-bleed photo. On those the header starts
 * transparent with white type and turns to paper past 80px. Add a route here
 * when you build a page that opens on a photograph — nothing else is needed.
 */
const OVERLAY_ROUTES = ["/"];

const SAVED_LABEL = { ro: "Proprietăți salvate", ru: "Сохранённые объекты" };

export default function Nav() {
  const { t } = useLang();
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const saved = useFavorites();

  const overlay = OVERLAY_ROUTES.includes(path);
  /* Derived, not stored: a page that does not open on a photo has to render its
     header on paper from the first frame, before any effect runs. */
  const solid = !overlay || scrolled;

  useEffect(() => {
    if (!overlay) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      setScrolled(window.scrollY > 80);
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
  }, [overlay]);

  // A route change under a persistent layout leaves the drawer open otherwise.
  useEffect(() => setOpen(false), [path]);

  // The drawer covers the page; letting the body scroll behind it feels broken.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`${styles.bar} ${solid ? styles.solid : ""}`}>
        <div className={styles.inner}>
          <Link href="/" className={styles.brand} aria-label={AGENCY.name}>
            <Logo className={styles.logo} />
          </Link>

          <nav className={styles.nav} aria-label={AGENCY.name}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.link} ${
                  path === item.href.split("?")[0] ? styles.linkOn : ""
                }`}
              >
                {t(item.label)}
              </Link>
            ))}
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
              onClick={() => setOpen(true)}
              aria-label={t(UI.openMenu)}
              aria-expanded={open}
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className={styles.drawer} role="dialog" aria-modal="true">
          <div className={styles.drawerTop}>
            <Logo className={styles.logoDark} />
            <button
              type="button"
              className={styles.close}
              onClick={() => setOpen(false)}
              aria-label={t(UI.closeMenu)}
            >
              <IconClose />
            </button>
          </div>

          <nav className={styles.drawerNav}>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={styles.drawerLink}>
                {t(item.label)}
              </Link>
            ))}
            <Link href="/favorite" className={styles.drawerLink}>
              {t(SAVED_LABEL)}
              {saved.length > 0 && (
                <span className={`num ${styles.drawerCount}`}>{saved.length}</span>
              )}
            </Link>
          </nav>

          <div className={styles.drawerFoot}>
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
