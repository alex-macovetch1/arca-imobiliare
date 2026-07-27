"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import LangSwitch from "@/components/LangSwitch";
import { Logo } from "@/components/Logo";
import { useLang } from "@/lib/lang";
import type { T } from "@/lib/types";
import styles from "./admin.module.css";

const LINKS: { href: string; label: T }[] = [
  { href: "/admin", label: { ro: "Tablou de bord", ru: "Сводка" } },
  { href: "/admin/lead-uri", label: { ro: "Cereri", ru: "Заявки" } },
  { href: "/admin/proprietati", label: { ro: "Proprietăți", ru: "Объекты" } },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { t } = useLang();
  const path = usePathname();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  async function logout() {
    setLeaving(true);
    await fetch("/api/admin/session", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <div className={styles.sideTop}>
          <Link href="/admin" className={styles.sideBrand}>
            <Logo className={styles.sideLogo} />
          </Link>
          <p className={styles.sideKicker}>{t({ ro: "Administrare", ru: "Управление" })}</p>
        </div>

        <nav className={styles.sideNav}>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.sideLink} ${
                path === link.href || (link.href !== "/admin" && path.startsWith(link.href))
                  ? styles.sideLinkOn
                  : ""
              }`}
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>

        <div className={styles.sideFoot}>
          <Link href="/" className={styles.sideSmall} target="_blank">
            {t({ ro: "Vezi site-ul ↗", ru: "Открыть сайт ↗" })}
          </Link>
          <LangSwitch dark />
          <button
            type="button"
            className={`btn-line btn-line-dark ${styles.logout}`}
            onClick={logout}
            disabled={leaving}
          >
            {t({ ro: "Ieșire", ru: "Выход" })}
          </button>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
