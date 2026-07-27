import type { Metadata } from "next";
import { isAdmin, usingFallbackKey } from "@/app/api/_data/auth";
import AdminShell from "./AdminShell";
import LoginScreen from "./LoginScreen";

/* The panel sits outside the (site) group on purpose: no header, no footer, no
   contact rail, and nothing here is ever indexed. */

export const metadata: Metadata = {
  title: "Panoul ARCA",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) {
    return <LoginScreen defaultKey={usingFallbackKey()} />;
  }

  return <AdminShell>{children}</AdminShell>;
}
