import fs from "node:fs";

const checks = [
  [
    "src/app/(studio)/studio/layout.tsx",
    ["getStudioAuthorization", 'redirect("/mfa?next=/studio")'],
  ],
  [
    "src/app/(auth)/login/page.tsx",
    ["LoginForm", "getSafeRedirectPath"],
  ],
  [
    "src/features/studio/auth/login-form.tsx",
    ["signInWithPassword", "getAuthenticatorAssuranceLevel"],
  ],
  [
    "src/features/studio/auth/mfa-form.tsx",
    ["mfa.enroll", "mfa.challenge", "mfa.verify", "mfa.unenroll"],
  ],
  [
    "src/app/(auth)/auth/logout/route.ts",
    ["auth.signOut", "Clear-Site-Data"],
  ],
  [
    "src/lib/auth/studio-authorization.ts",
    ["getStudioMfaAccess", "hasRequiredStudioAssurance"],
  ],
  [
    "src/proxy.ts",
    ['matcher: ["/login", "/mfa", "/studio/:path*"]'],
  ],
];

for (const [file, patterns] of checks) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing required file: ${file}`);
  }

  const content = fs.readFileSync(file, "utf8");
  for (const pattern of patterns) {
    if (!content.includes(pattern)) {
      throw new Error(`Missing ${pattern} in ${file}`);
    }
  }
}

const authorizationSource = fs.readFileSync(
  "src/lib/auth/studio-authorization.ts",
  "utf8",
);

if (
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(authorizationSource) ||
  authorizationSource.includes("SUPABASE_SERVICE_ROLE_KEY")
) {
  throw new Error("Studio authorization contains a forbidden hard-coded identity or service role.");
}

console.log("S06_STUDIO_AUTH_STATIC_OK");
