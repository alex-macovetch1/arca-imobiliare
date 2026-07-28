"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import s from "./PageFade.module.css";

const IN = 260;
const OUT = 130;
const EASE_IN = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_OUT = "cubic-bezier(0.4, 0, 1, 1)";

const BAR_DELAY = 120;
const BAR_STALL = 6000;
const BAR_CLEAR = 340;

const PHOTO = "arca-photo";
const COMMIT_CAP = 420;
const DIP_CAP = 900;

type Handoff = { finished: Promise<unknown>; ready?: Promise<unknown> };
type Starter = (run: () => void | Promise<void>) => Handoff;

// Read through `unknown` rather than by widening Document: whether the DOM
// library of the day already declares this, and with which signature, is not
// something this file should depend on.
const starter = (): Starter | null => {
  const fn = (document as unknown as { startViewTransition?: unknown }).startViewTransition;
  return typeof fn === "function" ? (fn as Starter) : null;
};

const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// setProperty rather than style.viewTransitionName: the typed property is
// missing from older DOM lib versions and this cannot fail to compile.
const nameOn = (el: HTMLElement) => el.style.setProperty("view-transition-name", PHOTO);
const nameOff = (el: HTMLElement | null) => el?.style.removeProperty("view-transition-name");

/** `/proprietati/<slug>` and nothing else — the one pair of pages that shares
 *  a photograph. */
const listingOf = (pathname: string) => {
  const hit = /^\/proprietati\/([^/]+)\/?$/.exec(pathname);
  return hit ? hit[1] : null;
};

/** First match wide enough to be the photograph rather than an icon. */
const wide = (root: ParentNode, selector: string, min: number) => {
  let found: HTMLElement | null = null;
  try {
    for (const el of root.querySelectorAll<HTMLElement>(selector)) {
      if (el.offsetWidth >= min) {
        found = el;
        break;
      }
    }
  } catch {
    return null;
  }
  return found;
};

/** A lone image loses its rounded clip when it is lifted into a snapshot, so
 *  the frame around it is the better thing to name. */
const framed = (el: HTMLElement) => {
  if (el.tagName !== "IMG") return el;
  const up = el.parentElement;
  if (!up) return el;
  const flow = getComputedStyle(up).overflow;
  return flow === "hidden" || flow === "clip" ? up : el;
};

const cssEscape = (value: string) =>
  typeof CSS !== "undefined" && typeof CSS.escape === "function" ? CSS.escape(value) : value;

/**
 * The photograph inside the card that was clicked. `data-vt` is the explicit
 * hook a card can set; `.rvimg` is the frame every photo block already uses,
 * and a bare image is the last resort.
 */
const photoInCard = (link: HTMLElement) => {
  const own = link.closest<HTMLElement>("[data-vt]");
  if (own) return own;
  const card = link.closest<HTMLElement>("[data-vt-card], article, li");
  if (!card) return null;
  const el = wide(card, "[data-vt]", 120) ?? wide(card, ".rvimg", 120) ?? wide(card, "img", 120);
  return el ? framed(el) : null;
};

/**
 * Its counterpart on the listing page. Restricted to the first screenful:
 * without that, a page with no large photograph at the top would hand back
 * the picture in the closing band and the transition would fly down the page.
 */
const photoOnPage = (slug: string) => {
  const main = document.querySelector("main");
  if (!main) return null;
  const el =
    wide(main, `[data-vt="${cssEscape(slug)}"]`, 200) ??
    wide(main, "[data-vt]", 200) ??
    wide(main, "img", 260);
  if (!el) return null;
  if (el.getBoundingClientRect().top > innerHeight * 0.9) return null;
  return framed(el);
};

/**
 * Carries the page across a client-side navigation.
 *
 * Three things, in order of how much they are noticed:
 *
 * 1. Opening a listing morphs the photograph out of the card into the
 *    photograph at the top of the page, through the browser's own view
 *    transition. Names are attached to one element per side and only for the
 *    length of the navigation — two live elements sharing a name abort the
 *    whole transition, and the same picture really does appear twice on a
 *    listing page, under "similar".
 * 2. A 2px rule creeps across the top whenever a route takes long enough to
 *    notice, and finishes when the new page commits.
 * 3. Everything else dips out and fades back in.
 *
 * Only the first case cancels the click; the rest leave the router's own
 * handling untouched, so a failure here can slow a navigation down but cannot
 * stop one. Nothing carries a hidden resting state either: if this never runs,
 * the page is simply there.
 */
export default function PageFade({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  const box = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const carried = useRef(false);
  const exit = useRef<Animation | null>(null);
  const exitTimer = useRef(0);

  const [bar, setBar] = useState<"off" | "on" | "done">("off");
  const barAt = useRef<"off" | "on" | "done">("off");
  const timers = useRef<number[]>([]);

  const move = useCallback((next: "off" | "on" | "done") => {
    barAt.current = next;
    setBar(next);
  }, []);

  const clearTimers = useCallback(() => {
    for (const id of timers.current) clearTimeout(id);
    timers.current = [];
  }, []);

  const startBar = useCallback(() => {
    clearTimers();
    move("off");
    timers.current.push(window.setTimeout(() => move("on"), BAR_DELAY));
    // A navigation that never arrives must not leave a rule parked across the
    // top of the screen.
    timers.current.push(
      window.setTimeout(() => {
        move("done");
        timers.current.push(window.setTimeout(() => move("off"), BAR_CLEAR));
      }, BAR_STALL)
    );
  }, [clearTimers, move]);

  const endBar = useCallback(() => {
    clearTimers();
    if (barAt.current === "off") return;
    move("done");
    timers.current.push(window.setTimeout(() => move("off"), BAR_CLEAR));
  }, [clearTimers, move]);

  const dip = useCallback(() => {
    const el = box.current;
    if (!el || typeof el.animate !== "function" || still()) return;
    exit.current?.cancel();

    const anim = el.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0.28, transform: "translate3d(0, -6px, 0)" },
      ],
      { duration: OUT, easing: EASE_OUT, fill: "forwards" }
    );
    exit.current = anim;

    // The fill is what holds the page dimmed until the next route commits and
    // cancels it. This is the other way out, for a navigation that never lands.
    clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => anim.cancel(), DIP_CAP);
  }, []);

  const handoff = useCallback(
    (from: HTMLElement, slug: string, href: string, link: HTMLElement) => {
      const start = starter();
      if (!start) {
        router.push(href);
        return;
      }

      nameOn(from);
      let landed: HTMLElement | null = null;

      const give = () => {
        document.documentElement.classList.remove("rv-now");
        nameOff(from);
        nameOff(landed);
      };

      const settle = () =>
        new Promise<void>((resolve) => {
          const t0 = performance.now();
          // The old page is held on screen as a still until this promise
          // settles, so there has to be a way out that does not depend on the
          // frame loop running: a suppressed document need not schedule one.
          const bail = window.setTimeout(resolve, COMMIT_CAP + 160);
          const done = () => {
            clearTimeout(bail);
            resolve();
          };
          const look = () => {
            // The clicked link leaving the document is the signal that the old
            // page is gone. Before that, every photograph found is still the
            // one that was clicked.
            if (!link.isConnected) {
              const el = photoOnPage(slug);
              if (el) {
                document.documentElement.classList.add("rv-now");
                el.classList.add("in");
                el.closest(".rv")?.classList.add("in");
                el.closest(".rvimg")?.classList.add("in");
                nameOn(el);
                landed = el;
                // One frame, so the forced reveal is in place before the
                // browser photographs the new page.
                requestAnimationFrame(() => done());
                return;
              }
            }
            if (performance.now() - t0 > COMMIT_CAP) {
              done();
              return;
            }
            requestAnimationFrame(look);
          };
          look();
        });

      try {
        const vt = start.call(document, async () => {
          router.push(href);
          await settle();
        });
        vt.ready?.then(
          () => document.documentElement.classList.remove("rv-now"),
          () => document.documentElement.classList.remove("rv-now")
        );
        vt.finished.then(give, give);
      } catch {
        give();
        router.push(href);
      }
    },
    [router]
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const hit = e.target as Element | null;
      if (!hit || typeof hit.closest !== "function") return;
      // A card is one large link with controls sitting on top of it — the
      // gallery arrows, the heart. Those cancel the click themselves, one
      // handler later than this one runs.
      if (hit.closest("button, input, select, textarea, label, summary, [role='button']")) return;

      const link = hit.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.dataset.noFade !== undefined) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(link.href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return;
      // Same page: an anchor, or a filter that only rewrites the query.
      if (url.pathname === location.pathname) return;
      if (url.pathname.startsWith("/api")) return;

      const href = `${url.pathname}${url.search}${url.hash}`;
      const slug = listingOf(url.pathname);
      const photo = slug && !still() && starter() ? photoInCard(link) : null;

      startBar();

      if (photo && slug) {
        e.preventDefault();
        carried.current = true;
        handoff(photo, slug, href, link);
        return;
      }

      dip();
    };

    // Capture: the router's own handler sits on the link and reads
    // defaultPrevented, so this has to run first to be able to take a
    // navigation over.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [dip, handoff, startBar]);

  useEffect(() => {
    clearTimeout(exitTimer.current);
    exit.current?.cancel();
    exit.current = null;
    endBar();

    // The first paint is already a fresh document. Fading it in would only
    // delay the largest contentful paint.
    if (first.current) {
      first.current = false;
      return;
    }

    // The photograph already carried this navigation; a second fade over the
    // top of it would only muddy it.
    if (carried.current) {
      carried.current = false;
      return;
    }

    const el = box.current;
    if (!el || typeof el.animate !== "function") return;
    if (still()) return;

    const anim = el.animate(
      [
        { opacity: 0, transform: "translate3d(0, 12px, 0)" },
        { opacity: 1, transform: "none" },
      ],
      {
        duration: IN,
        easing: EASE_IN,
        // No fill: the moment it ends the element is back on its own styles,
        // so it never leaves a transform behind for fixed children to inherit
        // as a containing block.
        fill: "none",
      }
    );

    return () => anim.cancel();
  }, [endBar, path]);

  useEffect(
    () => () => {
      for (const id of timers.current) clearTimeout(id);
      clearTimeout(exitTimer.current);
    },
    []
  );

  return (
    <>
      <span
        className={`${s.bar} ${bar === "on" ? s.on : bar === "done" ? s.done : ""}`}
        aria-hidden="true"
      />
      <div ref={box} className={s.page}>
        {children}
      </div>
    </>
  );
}
