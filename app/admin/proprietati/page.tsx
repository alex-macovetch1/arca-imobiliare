import { isAdmin } from "@/app/api/_data/auth";
import { propertyRows } from "@/app/api/_data/rows";
import { readStore } from "@/app/api/_data/store";
import { PROPERTY_BY_ID } from "@/lib/properties";
import PropertiesView from "./PropertiesView";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ verificare?: string }> };

export default async function AdminPropertiesPage({ searchParams }: Props) {
  if (!(await isAdmin())) return null;

  const { verificare } = await searchParams;
  const store = await readStore();

  const removed = Object.entries(store.patches)
    .filter(([, patch]) => patch.removed)
    .map(([id]) => ({ id, title: PROPERTY_BY_ID[id]?.title ?? { ro: id, ru: id } }));

  return (
    <PropertiesView
      rows={propertyRows(store)}
      removed={removed}
      onlyFlagged={verificare === "1"}
    />
  );
}
