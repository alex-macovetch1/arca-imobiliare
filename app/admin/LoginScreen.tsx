"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LangSwitch from "@/components/LangSwitch";
import { Logo } from "@/components/Logo";
import { useLang } from "@/lib/lang";
import type { T } from "@/lib/types";
import styles from "./admin.module.css";

export default function LoginScreen({ defaultKey }: { defaultKey: boolean }) {
  const { t, lang } = useLang();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password, lang }),
      });
      const answer = (await response.json()) as { ok: boolean; errorT?: T };

      if (answer.ok) {
        router.refresh();
      } else {
        setError(
          answer.errorT
            ? t(answer.errorT)
            : t({ ro: "Parolă greșită.", ru: "Неверный пароль." })
        );
        setPassword("");
      }
    } catch {
      setError(
        t({
          ro: "Nu am putut verifica parola. Încercați din nou.",
          ru: "Не удалось проверить пароль. Попробуйте ещё раз.",
        })
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.login}>
      <div className={styles.loginCard}>
        <Logo className={styles.loginLogo} />
        <p className={styles.loginKicker}>
          {t({ ro: "Panou de administrare", ru: "Панель управления" })}
        </p>

        <form className={styles.loginForm} onSubmit={submit}>
          <label className={styles.loginLabel} htmlFor="admin-password">
            {t({ ro: "Parola", ru: "Пароль" })}
          </label>
          <input
            id="admin-password"
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
          />

          {error && (
            <p className={styles.loginError} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className={`btn ${styles.loginBtn}`} disabled={busy}>
            {busy ? t({ ro: "Se verifică…", ru: "Проверяем…" }) : t({ ro: "Intră", ru: "Войти" })}
          </button>
        </form>

        {defaultKey && (
          <p className={styles.loginHint}>
            {t({
              ro: "Variabila ADMIN_KEY nu este setată, așa că panoul acceptă parola implicită „arca”. Setați-o înainte de a publica site-ul.",
              ru: "Переменная ADMIN_KEY не задана, поэтому панель принимает пароль по умолчанию «arca». Задайте её до публикации сайта.",
            })}
          </p>
        )}

        <div className={styles.loginFoot}>
          <LangSwitch />
        </div>
      </div>
    </main>
  );
}
