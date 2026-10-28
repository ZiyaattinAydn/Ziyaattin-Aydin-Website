export type ProfileState = { status: "idle" | "error" | "success"; message: string };
export const initialProfileState: ProfileState = { status: "idle", message: "" };
export type SiteProfile = {
  owner_id: string;
  headline: string;
  description: string;
  email: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  status: "draft" | "published";
  published_at: string | null;
  updated_at: string;
};
export type ProfileFields = Pick<SiteProfile,
  "headline" | "description" | "email" | "github_url" | "linkedin_url">;
export function safeProfileLink(value: string | null, kind: "github" | "linkedin"): string | null {
  if (!value) return null;
  try {
    const trimmed = value.trim();
    // Accept copied profile URLs without an explicit scheme, but never upgrade
    // arbitrary or insecure external links.
    const prefixed = /^(?:www\.)?(?:github\.com|linkedin\.com)\//i.test(trimmed)
      ? `https://${trimmed}`
      : trimmed;
    const url = new URL(prefixed);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    // The URL API percent-encodes non-ASCII profile names (e.g. Turkish dotless ı).
    // Decode only the pathname for validation; never relax host/protocol checks.
    const path = decodeURIComponent(url.pathname);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash ||
        (kind === "github" && host !== "github.com") ||
        (kind === "linkedin" && host !== "linkedin.com") ||
        (kind === "github" && !/^\/[A-Za-z0-9-]+\/?$/.test(url.pathname)) ||
        (kind === "linkedin" && !/^\/in\/[\p{L}\p{N}-]+\/?$/u.test(path)))
      return null;
    return url.href;
  } catch { return null; }
}
export function parseProfile(form: FormData): ProfileFields {
  const get = (key: string) => {
    const value = form.get(key);
    if (typeof value !== "string") throw new Error("Form alanları geçersiz.");
    return value.trim();
  };
  const headline = get("headline"), description = get("description");
  const email = get("email"), github = get("github_url"), linkedin = get("linkedin_url");
  if (headline.length > 200 || description.length > 3000)
    throw new Error("Başlık veya biyografi çok uzun.");
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))
    throw new Error("Geçerli bir iletişim e-postası gir.");
  if (github && (!safeProfileLink(github, "github") || github.length > 500))
    throw new Error("GitHub bağlantısı https://github.com/kullanici biçiminde olmalı.");
  if (linkedin && (!safeProfileLink(linkedin, "linkedin") || linkedin.length > 500))
    throw new Error("LinkedIn profil adresi linkedin.com/in/kullanici biçiminde olmalı.");
  return {
    headline, description, email: email || null,
    github_url: github ? safeProfileLink(github, "github") : null,
    linkedin_url: linkedin ? safeProfileLink(linkedin, "linkedin") : null,
  };
}
