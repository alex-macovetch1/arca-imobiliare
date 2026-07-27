import { NextResponse } from "next/server";
import type { Lang } from "@/lib/types";
import { buildLead, type LeadInput } from "../_data/model";
import { addLead } from "../_data/store";

/* ---------------------------------------------------------------------------
   The one public endpoint. Every form on the site posts the same body here:

     { source, name, phone, email?, message?, propertyId?, agentSlug?,
       lang, consent, company?, elapsed? }

   Answers { ok: true, id } or { ok: false, error, field }, where `error` is
   already in the language the form asked in — a component can print it as it is.
   --------------------------------------------------------------------------- */

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Partial<LeadInput>;
  try {
    body = (await request.json()) as Partial<LeadInput>;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Cerere invalidă.",
        errorT: { ro: "Cerere invalidă.", ru: "Некорректный запрос." },
        field: "name",
      },
      { status: 400 }
    );
  }

  const lang: Lang = body.lang === "ru" ? "ru" : "ro";
  const result = buildLead(body);

  if ("error" in result) {
    // A rejected honeypot answers 200 with ok:true-looking silence would be
    // kinder to bots; we say no plainly instead and keep the record out.
    return NextResponse.json(
      {
        ok: false,
        error: result.error.text[lang],
        errorT: result.error.text,
        field: result.error.field,
      },
      { status: 422 }
    );
  }

  await addLead(result.lead);

  return NextResponse.json({ ok: true, id: result.lead.id });
}
