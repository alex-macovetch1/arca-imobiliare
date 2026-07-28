import type { NextConfig } from "next";

/**
 * `experimental.viewTransition` is deliberately left off.
 *
 * The flag exists in 16.2.12, but all it does is hand route changes to React's
 * `<ViewTransition>`, which ships only in React's experimental channel: the
 * installed react 19.2.4 exports no such component, so turning the flag on
 * without also swapping the React version is a build error, and swapping it is
 * a dependency change this project cannot carry.
 *
 * The photograph that grows out of a card into the listing page is driven
 * straight off `document.startViewTransition` in components/PageFade.tsx
 * instead. That needs nothing from the framework and falls back to a fade
 * wherever the browser has no support for it.
 */
const nextConfig: NextConfig = {};

export default nextConfig;
