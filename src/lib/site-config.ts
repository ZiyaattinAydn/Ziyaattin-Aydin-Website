export type PublicNavigationItem = {
  href: string;
  label: string;
};

export type ExternalLinkStatus = "verified" | "placeholder";

export type ExternalLinkItem = {
  label: string;
  href: string | null;
  status: ExternalLinkStatus;
  note: string;
};

const unverifiedContactNote = "Gerçek bağlantı doğrulandıktan sonra etkinleştirilecek.";

export const siteConfig = {
  name: "Kişisel Sistemim",
  owner: "Ziyaattin",
  title: "Ziyaattin — Kişisel Sistem",
  description:
    "Projelerimi, yazılarımı ve gelişim yolculuğumu paylaştığım; özel çalışma alanımla desteklenen kişisel platform.",
  locale: "tr_TR",
  defaultTheme: "palette-2",
  navigation: [
    { href: "/", label: "Ana Sayfa" },
    { href: "/projects", label: "Projeler" },
    { href: "/writings", label: "Yazılar" },
    { href: "/journey", label: "Yolculuğum" },
    { href: "/about", label: "Hakkımda" },
  ] satisfies readonly PublicNavigationItem[],
  adminEntry: {
    href: "/login",
    label: "Yönetici Girişi",
  },
  contactLinks: [
    { label: "E-posta", href: null, status: "placeholder", note: unverifiedContactNote },
  ] satisfies readonly ExternalLinkItem[],
  socialLinks: [
    { label: "GitHub", href: null, status: "placeholder", note: unverifiedContactNote },
    { label: "LinkedIn", href: null, status: "placeholder", note: unverifiedContactNote },
  ] satisfies readonly ExternalLinkItem[],
  links: {
    email: null,
    github: null,
    linkedin: null,
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type SiteNavigationItem = (typeof siteConfig.navigation)[number];
export type SiteExternalLink = ExternalLinkItem;
