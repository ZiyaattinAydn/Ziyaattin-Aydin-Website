import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.owner}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.owner }],
  creator: siteConfig.owner,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#03070a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" data-theme={siteConfig.defaultTheme} className="antialiased">
      <body>{children}</body>
    </html>
  );
}
