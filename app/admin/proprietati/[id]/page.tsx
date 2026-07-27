import { notFound } from "next/navigation";
import { isAdmin } from "@/app/api/_data/auth";
import { propertyRow } from "@/app/api/_data/rows";
import { readStore } from "@/app/api/_data/store";
import PropertyForm from "../../PropertyForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditPropertyPage({ params }: Props) {
  if (!(await isAdmin())) return null;

  const { id } = await params;
  const store = await readStore();
  const row = propertyRow(store, decodeURIComponent(id));
  if (!row) notFound();

  return <PropertyForm row={row} />;
}
