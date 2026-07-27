import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { PROPERTY_BY_ID } from "@/lib/properties";
import { displayPhone, formatDateTime } from "@/lib/format";
import type { Lang } from "@/lib/types";
import { isAdmin } from "../_data/auth";
import { coercePropertyForm, isLeadState, type PropertyPatch } from "../_data/model";
import { propertyRow, propertyRows } from "../_data/rows";
import {
  dropProperty,
  patchLead,
  readStore,
  removeLead,
  restoreProperty,
  saveDraft,
  savePatch,
  setHidden,
} from "../_data/store";

/* ---------------------------------------------------------------------------
   Everything the panel writes goes through this one endpoint, behind the
   cookie. The screens post { action, ... } and reload; there is no client-side
   cache to keep in step with the file.
   --------------------------------------------------------------------------- */

export const dynamic = "force-dynamic";

const DENIED = {
  ro: "Sesiune expirată. Intrați din nou cu parola.",
  ru: "Сессия истекла. Войдите снова с паролем.",
};

function deny() {
  return NextResponse.json({ ok: false, error: DENIED.ro, errorT: DENIED }, { status: 401 });
}

/**
 * The public pages are prerendered; a listing typed in here has to reach them.
 * The whole tree goes at once because one listing shows up in six places —
 * results, its own page, the homepage strips, the agent, the counters.
 */
function refreshSite(): void {
  revalidatePath("/", "layout");
}

/** Excel opens a semicolon file straight into columns; a comma one does not. */
function csv(rows: string[][]): string {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return `﻿${rows.map((r) => r.map(escape).join(";")).join("\r\n")}\r\n`;
}

export async function GET(request: Request) {
  if (!(await isAdmin())) return deny();

  const url = new URL(request.url);
  const store = await readStore();

  if (url.searchParams.get("export") === "lead-uri") {
    const lang: Lang = url.searchParams.get("lang") === "ru" ? "ru" : "ro";
    const head = ["Data", "Nume", "Telefon", "Email", "Sursa", "Proprietate", "Agent", "Stare", "Mesaj", "Nota"];
    const body = store.leads.map((l) => [
      formatDateTime(l.createdAt, lang),
      l.name,
      displayPhone(l.phone),
      l.email ?? "",
      l.source,
      l.propertyId ?? "",
      l.agentSlug ?? "",
      l.state,
      l.message ?? "",
      l.note ?? "",
    ]);
    const stamp = new Date().toISOString().slice(0, 10);
    return new NextResponse(csv([head, ...body]), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="arca-lead-uri-${stamp}.csv"`,
      },
    });
  }

  return NextResponse.json({
    ok: true,
    leads: store.leads,
    properties: propertyRows(store),
  });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return deny();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Cerere invalidă." }, { status: 400 });
  }

  const action = String(body.action ?? "");
  const id = typeof body.id === "string" ? body.id : "";

  switch (action) {
    case "lead.state": {
      if (!isLeadState(body.state)) {
        return NextResponse.json({ ok: false, error: "Stare necunoscută." }, { status: 400 });
      }
      const lead = await patchLead(id, { state: body.state });
      return NextResponse.json({ ok: Boolean(lead) });
    }

    case "lead.note": {
      const note = String(body.note ?? "").slice(0, 2000);
      const lead = await patchLead(id, { note });
      return NextResponse.json({ ok: Boolean(lead) });
    }

    case "lead.delete": {
      const gone = await removeLead(id);
      return NextResponse.json({ ok: gone });
    }

    case "property.save": {
      const store = await readStore();
      const existing = propertyRow(store, id || String(body.id ?? ""));
      const result = coercePropertyForm(
        (body.form ?? {}) as Record<string, unknown>,
        existing
          ? {
              id: existing.id,
              title: existing.title,
              description: existing.description,
              createdAt: existing.updatedAt,
              hidden: existing.hidden,
            }
          : undefined
      );

      if ("error" in result) {
        return NextResponse.json(
          { ok: false, error: result.error.text.ro, errorT: result.error.text, field: result.error.field },
          { status: 422 }
        );
      }

      const draft = result.draft;

      // A listing that lives in the versioned portfolio keeps living there: the
      // panel stores the difference, so a redeploy of the source does not
      // silently undo an edit made here.
      if (PROPERTY_BY_ID[draft.id]) {
        const { id: _code, createdAt: _created, ...fields } = draft;
        const patch: PropertyPatch = fields;
        await savePatch(draft.id, patch);
      } else {
        await saveDraft(draft);
      }

      refreshSite();
      return NextResponse.json({ ok: true, id: draft.id, slug: draft.slug });
    }

    case "property.hidden": {
      await setHidden(id, body.hidden === true);
      refreshSite();
      return NextResponse.json({ ok: true });
    }

    case "property.delete": {
      await dropProperty(id);
      refreshSite();
      return NextResponse.json({ ok: true });
    }

    case "property.restore": {
      await restoreProperty(id);
      refreshSite();
      return NextResponse.json({ ok: true });
    }

    default:
      return NextResponse.json({ ok: false, error: "Acțiune necunoscută." }, { status: 400 });
  }
}
