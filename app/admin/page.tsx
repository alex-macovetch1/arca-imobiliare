import { isAdmin } from "@/app/api/_data/auth";
import { propertyRows } from "@/app/api/_data/rows";
import { readStore } from "@/app/api/_data/store";
import DashboardView from "./DashboardView";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAdmin())) return null;

  const store = await readStore();
  const rows = propertyRows(store);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const weekAgo = Date.now() - 7 * 24 * 3600_000;

  const today = store.leads.filter((l) => new Date(l.createdAt).getTime() >= startOfToday.getTime());
  const week = store.leads.filter((l) => new Date(l.createdAt).getTime() >= weekAgo);
  const untouched = store.leads.filter((l) => l.state === "nou");
  const active = rows.filter((r) => r.status === "activ" && !r.hidden);
  const flagged = rows.filter((r) => r.checks.length > 0);

  return (
    <DashboardView
      counts={{
        today: today.length,
        week: week.length,
        untouched: untouched.length,
        active: active.length,
        flagged: flagged.length,
      }}
      latest={store.leads.slice(0, 10)}
    />
  );
}
