export const studioNavItems = [
  { href: "/studio", label: "Ana Panel", shortLabel: "Panel" },
  { href: "/studio/projects", label: "Projeler", shortLabel: "Projeler" },
  { href: "/studio/writings", label: "Yazılar", shortLabel: "Yazılar" },
  { href: "/studio/journey", label: "Yolculuğum", shortLabel: "Yolculuk" },
  { href: "/studio/tasks", label: "Görevler", shortLabel: "Görevler" },
  { href: "/studio/notes", label: "Notlar", shortLabel: "Notlar" },
  { href: "/studio/files", label: "Dosyalar", shortLabel: "Dosyalar" },
] as const;

export type StudioStatusTone = "success" | "warning" | "info" | "muted";
