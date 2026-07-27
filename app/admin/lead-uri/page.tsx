import { isAdmin } from "@/app/api/_data/auth";
import { readStore } from "@/app/api/_data/store";
import LeadsView from "./LeadsView";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  if (!(await isAdmin())) return null;

  const store = await readStore();
  return <LeadsView leads={store.leads} />;
}
