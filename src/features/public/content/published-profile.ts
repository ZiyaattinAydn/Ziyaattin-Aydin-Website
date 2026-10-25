import "server-only";
import { createClient } from "@supabase/supabase-js";
import { safeProfileLink } from "@/features/studio/profile/domain";

export type PublishedSiteProfile = {
  headline: string;
  description: string;
  email: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
};
// Public reads are always anonymous; never reuse a Studio session or its cookies.
export async function readPublishedSiteProfile(): Promise<PublishedSiteProfile | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  try {
    const client = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });
    const { data, error } = await client.from("site_profiles")
      .select("headline,description,email,github_url,linkedin_url")
      .eq("status", "published").not("published_at", "is", null)
      .limit(1).maybeSingle();
    if (error || !data || !data.headline?.trim() || !data.description?.trim()) return null;
    return {
      headline: data.headline,
      description: data.description,
      email: typeof data.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? data.email : null,
      githubUrl: safeProfileLink(data.github_url, "github"),
      linkedinUrl: safeProfileLink(data.linkedin_url, "linkedin"),
    };
  } catch { return null; }
}
