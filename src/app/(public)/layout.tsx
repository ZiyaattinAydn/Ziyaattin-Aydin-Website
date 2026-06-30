import type { PropsWithChildren } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-code-grid">
      <SiteHeader />
      <main className="mx-auto min-h-[calc(100vh-8rem)] max-w-[1480px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
