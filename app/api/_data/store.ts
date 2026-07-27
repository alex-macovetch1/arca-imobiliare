import { promises as fs } from "node:fs";
import path from "node:path";
import type { Lead } from "@/lib/types";
import type { PropertyDraft, PropertyPatch, StoreShape } from "./model";
import { EMPTY_STORE } from "./model";
import { SEED_LEADS } from "./seed";

/* ---------------------------------------------------------------------------
   Storage: one JSON file, no database, nothing to configure. The agency can
   open it, read it and back it up with a copy-paste.

   Vercel mounts the deployment read-only, so there the file lives in the
   writable temp directory instead. Everything still works; the difference is
   that a redeploy starts from the seed again, which is exactly the trade a
   file-based store makes.
   --------------------------------------------------------------------------- */

const DIR =
  process.env.ARCA_DATA_DIR?.trim() ||
  (process.env.VERCEL ? path.join("/tmp", "arca") : path.join(process.cwd(), "data"));

const FILE = path.join(DIR, "arca.json");

type Cache = { data: StoreShape | null; queue: Promise<unknown> };

// The dev server re-evaluates modules on every edit; without a global handle
// the cache and the write queue would reset mid-request.
const globalCache = globalThis as unknown as { __arcaStore?: Cache };
const cache: Cache = (globalCache.__arcaStore ??= { data: null, queue: Promise.resolve() });

function fresh(): StoreShape {
  return { ...EMPTY_STORE, leads: SEED_LEADS(), drafts: [], patches: {} };
}

function normalise(raw: unknown): StoreShape {
  if (!raw || typeof raw !== "object") return fresh();
  const obj = raw as Partial<StoreShape>;
  return {
    version: 1,
    leads: Array.isArray(obj.leads) ? obj.leads : [],
    drafts: Array.isArray(obj.drafts) ? obj.drafts : [],
    patches: obj.patches && typeof obj.patches === "object" ? obj.patches : {},
  };
}

async function readFile(): Promise<StoreShape> {
  try {
    const text = await fs.readFile(FILE, "utf8");
    return normalise(JSON.parse(text));
  } catch {
    // First run, or the file was removed by hand: start from the seed.
    const seeded = fresh();
    await writeFile(seeded);
    return seeded;
  }
}

async function writeFile(data: StoreShape): Promise<void> {
  try {
    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  } catch {
    // A read-only filesystem must not lose the request: the in-memory copy
    // stays authoritative for the life of the instance.
  }
}

export async function readStore(): Promise<StoreShape> {
  if (!cache.data) cache.data = await readFile();
  return cache.data;
}

/**
 * Serialised read-modify-write. Two forms submitted in the same second would
 * otherwise both read the old list and the second would drop the first.
 */
export async function updateStore<R>(fn: (s: StoreShape) => R | Promise<R>): Promise<R> {
  const run = cache.queue.then(async () => {
    const data = await readStore();
    const result = await fn(data);
    cache.data = data;
    await writeFile(data);
    return result;
  });
  cache.queue = run.catch(() => undefined);
  return run;
}

/* --------------------------------------------------------------------------- */

export async function addLead(lead: Lead): Promise<Lead> {
  return updateStore((s) => {
    s.leads.unshift(lead);
    return lead;
  });
}

export async function patchLead(id: string, fields: Partial<Lead>): Promise<Lead | null> {
  return updateStore((s) => {
    const lead = s.leads.find((l) => l.id === id);
    if (!lead) return null;
    Object.assign(lead, fields, { id: lead.id, createdAt: lead.createdAt });
    return lead;
  });
}

export async function removeLead(id: string): Promise<boolean> {
  return updateStore((s) => {
    const before = s.leads.length;
    s.leads = s.leads.filter((l) => l.id !== id);
    return s.leads.length < before;
  });
}

export async function saveDraft(draft: PropertyDraft): Promise<PropertyDraft> {
  return updateStore((s) => {
    const at = s.drafts.findIndex((d) => d.id === draft.id);
    if (at >= 0) s.drafts[at] = draft;
    else s.drafts.unshift(draft);
    return draft;
  });
}

export async function savePatch(id: string, patch: PropertyPatch): Promise<void> {
  return updateStore((s) => {
    s.patches[id] = { ...s.patches[id], ...patch };
  });
}

/** Removes a listing: a draft disappears, a portfolio entry is marked instead. */
export async function dropProperty(id: string): Promise<void> {
  return updateStore((s) => {
    const before = s.drafts.length;
    s.drafts = s.drafts.filter((d) => d.id !== id);
    if (s.drafts.length === before) {
      s.patches[id] = { ...s.patches[id], removed: true, updatedAt: new Date().toISOString() };
    } else {
      delete s.patches[id];
    }
  });
}

/**
 * A patch that no longer says anything is noise: undoing a hide or a removal
 * has to leave the store exactly as it was before, or the file fills up with
 * entries that mean "nothing changed".
 */
function prune(store: StoreShape, id: string): void {
  const patch = store.patches[id];
  if (!patch) return;
  const meaningful = Object.entries(patch).some(
    ([key, value]) => key !== "updatedAt" && value !== false && value !== undefined
  );
  if (!meaningful) delete store.patches[id];
}

/** Puts a removed portfolio listing back on the list. */
export async function restoreProperty(id: string): Promise<void> {
  return updateStore((s) => {
    const patch = s.patches[id];
    if (!patch) return;
    delete patch.removed;
    patch.updatedAt = new Date().toISOString();
    prune(s, id);
  });
}

export async function setHidden(id: string, hidden: boolean): Promise<void> {
  return updateStore((s) => {
    const draft = s.drafts.find((d) => d.id === id);
    const now = new Date().toISOString();
    if (draft) {
      draft.hidden = hidden;
      draft.updatedAt = now;
      return;
    }
    s.patches[id] = { ...s.patches[id], hidden, updatedAt: now };
    prune(s, id);
  });
}

/** Listings the panel has taken off the list, for the "restore" view. */
export async function removedIds(): Promise<string[]> {
  const s = await readStore();
  return Object.entries(s.patches)
    .filter(([, p]) => p.removed)
    .map(([id]) => id);
}
