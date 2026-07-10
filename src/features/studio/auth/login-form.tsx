"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type LoginFormProps = {
  nextPath: string;
};

const genericLoginError =
  "Giriş tamamlanamadı. E-posta ve şifreyi kontrol edip tekrar dene.";

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(genericLoginError);
        return;
      }

      const { data, error: assuranceError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (assuranceError) {
        setErrorMessage(genericLoginError);
        await supabase.auth.signOut();
        return;
      }

      const destination =
        data.currentLevel === "aal2"
          ? nextPath
          : `/mfa?next=${encodeURIComponent(nextPath)}`;

      router.replace(destination);
      router.refresh();
    } catch {
      setErrorMessage(genericLoginError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium">
        <span>E-posta</span>
        <input
          required
          name="email"
          type="email"
          autoComplete="username"
          spellCheck={false}
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-[var(--accent-dim)]"
        />
      </label>

      <label className="block text-sm font-medium">
        <span>Şifre</span>
        <input
          required
          name="password"
          type="password"
          autoComplete="current-password"
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-[var(--accent-dim)]"
        />
      </label>

      {errorMessage ? (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {errorMessage}
        </p>
      ) : null}

      <button
        disabled={isSubmitting}
        type="submit"
        className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-[#021108] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Giriş doğrulanıyor…" : "Giriş yap"}
      </button>
    </form>
  );
}
