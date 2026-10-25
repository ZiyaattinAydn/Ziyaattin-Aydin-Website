import type { PropsWithChildren } from "react";
export const metadata = { robots: { index: false, follow: false } };
export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="grid min-h-screen place-items-center bg-code-grid px-4">
      {children}
    </main>
  );
}
