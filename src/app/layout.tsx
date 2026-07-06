import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.owner} — Kişisel Sistem`,
    template: `%s | ${siteConfig.owner}`,
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#03070a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" data-theme="palette-2" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
