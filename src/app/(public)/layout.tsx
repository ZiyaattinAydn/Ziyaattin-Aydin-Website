import type { PropsWithChildren } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col bg-code-grid">
      <SiteHeader />
      <main
        id="public-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-[1480px] flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12"
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
