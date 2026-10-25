import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/environment";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (
    (origin && origin !== new URL(request.url).origin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    return new NextResponse("İstek doğrulanamadı.", { status: 403 });
  }
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      await supabase.auth.signOut();
    } catch {
      // Logout remains best-effort and never reveals configuration details.
    }
  }

  const response = NextResponse.redirect(new URL("/login", request.url), 303);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Clear-Site-Data", '"cache", "storage"');
  return response;
}
