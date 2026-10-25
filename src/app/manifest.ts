import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/studio",
    name: "Kişisel Sistemim — Studio",
    short_name: "Studio",
    description: "Kişisel proje ve görev çalışma alanı",
    lang: "tr",
    start_url: "/studio",
    scope: "/",
    display: "standalone",
    background_color: "#03070a",
    theme_color: "#03070a",
    icons: [
      {
        src: "/icons/studio-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/studio-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/studio-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
