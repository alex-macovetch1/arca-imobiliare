"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One observer for the whole page instead of a ref in every component.
 * Elements opt in with `.rv` (slide up) or `.rvimg` (fade the photo in) and
 * stagger themselves with `style={{ "--d": "120ms" }}`.
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
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
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

    const scan = (root: ParentNode) => {
      for (const el of root.querySelectorAll<HTMLElement>(".rv, .rvimg")) {
        if (el.classList.contains("in") || seen.has(el)) continue;
        seen.add(el);
        watched.add(el);
        io.observe(el);
      }
      armSafety();
    };

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
      if (safety) clearTimeout(safety);
      if (first) cancelAnimationFrame(first);
      if (pending) cancelAnimationFrame(pending);
    };
  }, [path]);

  return null;
}
