/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export type StudioMfaMode = "enroll" | "challenge" | "manage";

type MfaFormProps = {
  mode: StudioMfaMode;
  nextPath: string;
};

type TotpFactor = {
  id: string;
  friendlyName: string;
  status: "verified" | "unverified";
};

type EnrollmentState = {
  factorId: string;
  qrCode: string;
  secret: string;
};

const genericMfaError =
  "Doğrulama tamamlanamadı. Kodu kontrol edip tekrar dene.";

function normalizeCode(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

export function MfaForm({ mode, nextPath }: MfaFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [factors, setFactors] = useState<TotpFactor[]>([]);
  const [selectedFactorId, setSelectedFactorId] = useState("");
  const [enrollment, setEnrollment] = useState<EnrollmentState | null>(null);
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadFactors = useCallback(async (): Promise<TotpFactor[]> => {
    const { data, error } = await supabase.auth.mfa.listFactors();

    if (error) {
      throw error;
    }

    const nextFactors: TotpFactor[] = data.totp.map((factor) => ({
      id: factor.id,
      friendlyName: factor.friendly_name || "Authenticator",
      status: factor.status === "verified" ? "verified" : "unverified",
    }));

    setFactors(nextFactors);

    const firstVerified = nextFactors.find(
      (factor) => factor.status === "verified",
    );

    setSelectedFactorId((current) =>
      nextFactors.some((factor) => factor.id === current)
        ? current
        : firstVerified?.id ?? "",
    );

    return nextFactors;
  }, [supabase]);

  useEffect(() => {
    let isActive = true;

    void loadFactors()
      .catch(() => {
        if (isActive) {
          setErrorMessage(genericMfaError);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [loadFactors]);

  async function startEnrollment() {
    setErrorMessage(null);
    setIsBusy(true);
    setCode("");

    try {
      const currentFactors = await loadFactors();

      for (const factor of currentFactors) {
        if (factor.status === "unverified") {
          await supabase.auth.mfa.unenroll({
            factorId: factor.id,
          });
        }
      }

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: `Studio Authenticator ${new Date().toISOString().slice(0, 10)}`,
      });

      if (error) {
        throw error;
      }

      const qrCode = data.totp.qr_code.startsWith("data:image/")
        ? data.totp.qr_code
        : "";

      if (!qrCode || !data.totp.secret) {
        throw new Error("Invalid TOTP enrollment response.");
      }

      setEnrollment({
        factorId: data.id,
        qrCode,
        secret: data.totp.secret,
      });
      await loadFactors();
    } catch {
      setErrorMessage(genericMfaError);
    } finally {
      setIsBusy(false);
    }
  }

  async function verifyEnrollment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!enrollment || code.length !== 6) {
      setErrorMessage(genericMfaError);
      return;
    }

    setErrorMessage(null);
    setIsBusy(true);

    try {
      const challenge = await supabase.auth.mfa.challenge({
        factorId: enrollment.factorId,
      });

      if (challenge.error) {
        throw challenge.error;
      }

      const verification = await supabase.auth.mfa.verify({
        factorId: enrollment.factorId,
        challengeId: challenge.data.id,
        code,
      });

      if (verification.error) {
        throw verification.error;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setErrorMessage(genericMfaError);
    } finally {
      setIsBusy(false);
    }
  }

  async function verifyChallenge(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFactorId || code.length !== 6) {
      setErrorMessage(genericMfaError);
      return;
    }

    setErrorMessage(null);
    setIsBusy(true);

    try {
      const challenge = await supabase.auth.mfa.challenge({
        factorId: selectedFactorId,
      });

      if (challenge.error) {
        throw challenge.error;
      }

      const verification = await supabase.auth.mfa.verify({
        factorId: selectedFactorId,
        challengeId: challenge.data.id,
        code,
      });

      if (verification.error) {
        throw verification.error;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setErrorMessage(genericMfaError);
    } finally {
      setIsBusy(false);
    }
  }

  async function removeFactor(factorId: string) {
    const verifiedFactors = factors.filter(
      (factor) => factor.status === "verified",
    );

    if (verifiedFactors.length <= 1) {
      return;
    }

    setErrorMessage(null);
    setIsBusy(true);

    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId,
      });

      if (error) {
        throw error;
      }

      await loadFactors();
    } catch {
      setErrorMessage(genericMfaError);
    } finally {
      setIsBusy(false);
    }
  }

  const verifiedFactors = factors.filter(
    (factor) => factor.status === "verified",
  );

  if (isLoading) {
    return <p className="text-sm text-[var(--muted)]">Faktörler kontrol ediliyor…</p>;
  }

  if (enrollment) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
          <img
            src={enrollment.qrCode}
            alt="Studio TOTP authenticator QR kodu"
            width={240}
            height={240}
            className="mx-auto h-60 w-60"
          />
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
          <p className="text-sm font-medium">Manuel kurulum anahtarı</p>
          <code className="mt-2 block break-all font-mono text-sm text-[var(--accent)]">
            {enrollment.secret}
          </code>
          <p className="mt-3 text-xs leading-6 text-[var(--muted)]">
            Bu anahtarı veya QR kodunu paylaşma. Authenticator uygulamasına
            ekledikten sonra üretilen 6 haneli kodu gir.
          </p>
        </div>

        <form className="space-y-4" onSubmit={verifyEnrollment}>
          <TotpCodeInput code={code} setCode={setCode} />

          <MfaError message={errorMessage} />

          <button
            disabled={isBusy || code.length !== 6}
            type="submit"
            className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-[#021108] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy ? "Doğrulanıyor…" : "TOTP faktörünü doğrula"}
          </button>
        </form>
      </div>
    );
  }

  if (mode === "challenge") {
    if (verifiedFactors.length === 0) {
      return (
        <div className="space-y-4">
          <p className="text-sm leading-7 text-[var(--muted)]">
            Doğrulanmış faktör bulunamadı. Yeni bir authenticator faktörü kur.
          </p>
          <button
            disabled={isBusy}
            type="button"
            onClick={() => void startEnrollment()}
            className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-[#021108] disabled:opacity-60"
          >
            TOTP kurulumunu başlat
          </button>
          <MfaError message={errorMessage} />
        </div>
      );
    }

    return (
      <form className="space-y-4" onSubmit={verifyChallenge}>
        {verifiedFactors.length > 1 ? (
          <label className="block text-sm font-medium">
            <span>Authenticator faktörü</span>
            <select
              value={selectedFactorId}
              onChange={(event) => setSelectedFactorId(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 outline-none"
            >
              {verifiedFactors.map((factor) => (
                <option key={factor.id} value={factor.id}>
                  {factor.friendlyName}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <TotpCodeInput code={code} setCode={setCode} />
        <MfaError message={errorMessage} />

        <button
          disabled={isBusy || code.length !== 6}
          type="submit"
          className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-[#021108] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isBusy ? "Doğrulanıyor…" : "Studio erişimini doğrula"}
        </button>
      </form>
    );
  }

  if (mode === "manage") {
    return (
      <div className="space-y-5">
        <div className="space-y-3">
          {verifiedFactors.map((factor) => (
            <div
              key={factor.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4"
            >
              <div>
                <p className="text-sm font-medium">{factor.friendlyName}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Doğrulanmış TOTP faktörü
                </p>
              </div>
              <button
                disabled={isBusy || verifiedFactors.length <= 1}
                type="button"
                onClick={() => void removeFactor(factor.id)}
                className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Kaldır
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs leading-6 text-[var(--muted)]">
          Son doğrulanmış faktör arayüzden kaldırılamaz. Yedek erişim için ikinci
          cihazda ayrı bir TOTP faktörü oluştur.
        </p>

        <button
          disabled={isBusy}
          type="button"
          onClick={() => void startEnrollment()}
          className="w-full rounded-xl border border-[var(--accent-dim)] px-4 py-3 font-semibold text-[var(--accent)] disabled:opacity-60"
        >
          İkinci TOTP faktörü ekle
        </button>

        <button
          type="button"
          onClick={() => {
            router.replace(nextPath);
            router.refresh();
          }}
          className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-[#021108]"
        >
          Studio&apos;ya dön
        </button>

        <MfaError message={errorMessage} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm leading-7 text-[var(--muted)]">
        Studio&apos;ya erişmek için authenticator uygulamasında bir TOTP
        faktörü oluşturman gerekiyor.
      </p>
      <button
        disabled={isBusy}
        type="button"
        onClick={() => void startEnrollment()}
        className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-[#021108] disabled:opacity-60"
      >
        {isBusy ? "Kurulum hazırlanıyor…" : "TOTP kurulumunu başlat"}
      </button>
      <MfaError message={errorMessage} />
    </div>
  );
}

function TotpCodeInput({
  code,
  setCode,
}: {
  code: string;
  setCode: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium">
      <span>6 haneli doğrulama kodu</span>
      <input
        required
        value={code}
        onChange={(event) => setCode(normalizeCode(event.target.value))}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        maxLength={6}
        placeholder="000000"
        className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 font-mono text-lg tracking-[0.35em] outline-none focus:border-[var(--accent-dim)]"
      />
    </label>
  );
}

function MfaError({ message }: { message: string | null }) {
  return message ? (
    <p
      role="alert"
      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
    >
      {message}
    </p>
  ) : null;
}
