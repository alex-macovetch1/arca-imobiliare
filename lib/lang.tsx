"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Lang, T } from "./types";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (v: T) => string;
};

const LangCtx = createContext<Ctx>({ lang: "ro", setLang: () => {}, t: (v) => v.ro });

const KEY = "imobil-lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ro");

  // Read the stored choice after mount so the server markup (always Romanian)
  // and the first client render agree — otherwise hydration mismatches.
  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "ru" || saved === "ro") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(KEY, l);
  }, []);

  const t = useCallback((v: T) => v[lang] ?? v.ro, [lang]);

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
