import type { Metadata } from "next";
export const publicSiteUrl = "https://ziyaattin-aydin-website.vercel.app";
export function publicMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      locale: "tr_TR",
      siteName: "Ziyaattin Aydın",
      images: [
        {
          url: "/images/social-card.png",
          width: 1200,
          height: 630,
          alt: "Ziyaattin Aydın — projeler, yazılar ve yolculuk notları",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/social-card.png"],
    },
  };
}
