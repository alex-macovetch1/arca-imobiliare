"use client";

import { useSyncExternalStore } from "react";

/* ---------------------------------------------------------------------------
   Saved listings live in localStorage: no account, no password, no server.
   The card, the listing page, the counter in the header and /favorite all read
   this one store, so a heart can never disagree with the saved page.
   --------------------------------------------------------------------------- */

const KEY = "imobil-favorite";

const EMPTY: string[] = [];
const listeners = new Set<() => void>();

let cache: string[] | null = null;

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function emit() {
  for (const l of listeners) l();
}

function onStorage(e: StorageEvent) {
  if (e.key !== KEY) return;
  cache = read();
  emit();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function snapshot(): string[] {
  if (cache === null) cache = read();
  return cache;
}

/** The server has no localStorage; hydration starts from an empty list. */
function serverSnapshot(): string[] {
  return EMPTY;
}

export function toggleFavorite(id: string): void {
  const current = snapshot();
  const next = current.includes(id) ? current.filter((v) => v !== id) : [id, ...current];
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private mode with storage disabled: the heart still works for this visit.
  }
  emit();
}

export function useFavorites(): string[] {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}

export function useIsFavorite(id: string): boolean {
  return useFavorites().includes(id);
}
