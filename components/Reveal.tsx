"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One observer for the whole page instead of a ref in every component.
 *
 * Elements opt in with a class and the motion itself lives in globals.css:
 *   .rv                       arrives from below
 *   .rv.rv-left / .rv.rv-right  arrives from the side
 *   .rv.rv-scale              settles forward, for large photography
 *   .rvimg                    photo frame: the blur and overscale clear
 * A row staggers with `.rvd1 … .rvd6` or `style={{ "--d": "120ms" }}`.
 *
 * This only ever adds a class. Reduced motion and a scripting-off document
 * are both handled in CSS, so nothing here can strand content off-screen.
 */
export default function Reveal() {
  const path = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll<HTMLElement>(".rv, .rvimg").forEach((el) => el.classList.add("in"));
      return;
    }

    const seen = new WeakSet<Element>();
    const watched = new Set<HTMLElement>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
            watched.delete(e.target as HTMLElement);
          }
        }
      },
      // threshold 0, not a fraction: a block taller than the viewport can
      // never expose 8% of itself, and would sit there unrevealed. The
      // negative bottom margin is what holds the trigger off the fold; the
      // wide side margins take the horizontal axis out of the question, or a
      // card parked to the right of a swipe strip would stay at opacity 0
      // until it is dragged into view.
      { rootMargin: "0px 9999px -10% 9999px", threshold: 0 }
    );

    let safety: ReturnType<typeof setTimeout> | null = null;

    // Net for the case where the observer never fires for freshly committed
    // nodes: anything at or near the fold gets revealed anyway. On a direct
    // load the observer has marked these within ~100ms, so this is a no-op.
    const armSafety = () => {
      if (safety) clearTimeout(safety);
      safety = setTimeout(() => {
        safety = null;
        for (const el of watched) {
          if (el.getBoundingClientRect().top < innerHeight * 1.2) {
            el.classList.add("in");
            io.unobserve(el);
            watched.delete(el);
          }
        }
      }, 1500);
    };

    // The trigger line stands 10% above the fold, so a block that still sits
    // inside that last strip once the page has run out of scroll can never
    // cross it. The footer signature on a phone is exactly that block.
    const atEnd = () => {
      if (document.documentElement.scrollHeight - innerHeight - window.scrollY > 2) return;
      for (const el of [...watched]) {
        if (el.getBoundingClientRect().top >= innerHeight) continue;
        el.classList.add("in");
        io.unobserve(el);
        watched.delete(el);
      }
    };

    const scan = (root: ParentNode) => {
      for (const el of root.querySelectorAll<HTMLElement>(".rv, .rvimg")) {
        if (el.classList.contains("in") || seen.has(el)) continue;
        seen.add(el);
        watched.add(el);
        io.observe(el);
      }
      armSafety();
      // A page shorter than the viewport never fires a scroll event.
      atEnd();
    };

    window.addEventListener("scroll", atEnd, { passive: true });

    scan(document);

    let first = requestAnimationFrame(() => {
      first = 0;
      scan(document);
    });

    // Client-side navigation swaps the page under a persistent layout, so new
    // targets appear long after this effect ran. Without this the second page
    // a visitor opens stays blank.
    let pending = 0;
    const mo = new MutationObserver((records) => {
      if (pending) return;
      // Text-only churn (a counter ticking) can never introduce a new target.
      let elements = false;
      for (const r of records) {
        for (const n of r.addedNodes) {
          if (n.nodeType === 1) {
            elements = true;
            break;
          }
        }
        if (elements) break;
      }
      if (!elements) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        scan(document);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", atEnd);
      if (safety) clearTimeout(safety);
      if (first) cancelAnimationFrame(first);
      if (pending) cancelAnimationFrame(pending);
    };
  }, [path]);

  return null;
}
