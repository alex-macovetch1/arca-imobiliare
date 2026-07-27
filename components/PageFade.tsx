"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import s from "./PageFade.module.css";

const DURATION = 240;

/**
 * Cross-fades the page body on every client-side navigation.
 *
 * Deliberately driven by the Web Animations API rather than a CSS class:
 * the element carries no hidden resting state, so if this never runs — no
 * script, an older engine, a thrown effect — the page is simply there.
 *
 * Next's router does not wrap navigations in `document.startViewTransition`
 * on its own, so `::view-transition-*` would never fire without pulling in
 * React's unreleased `<ViewTransition>`; this stays inside the public API.
 */
export default function PageFade({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const box = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    // The first paint is already a fresh document. Fading it in would only
    // delay the largest contentful paint.
    if (first.current) {
      first.current = false;
      return;
    }

    const el = box.current;
    if (!el || typeof el.animate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const anim = el.animate(
      [
        { opacity: 0, transform: "translate3d(0, 10px, 0)" },
        { opacity: 1, transform: "none" },
      ],
      {
        duration: DURATION,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        // No fill: the moment it ends the element is back on its own styles,
        // so it never leaves a transform behind for fixed children to inherit
        // as a containing block.
        fill: "none",
      }
    );

    return () => anim.cancel();
  }, [path]);

  return (
    <div ref={box} className={s.page}>
      {children}
    </div>
  );
}
