import { isAdmin } from "@/app/api/_data/auth";
import { nextCode } from "@/app/api/_data/model";
import { takenCodes } from "@/app/api/_data/rows";
import { readStore } from "@/app/api/_data/store";
import PropertyForm from "../../PropertyForm";

export const dynamic = "force-dynamic";

export default async function NewPropertyPage() {
  if (!(await isAdmin())) return null;

  const store = await readStore();
  return <PropertyForm suggestedCode={nextCode(takenCodes(store))} />;
}
