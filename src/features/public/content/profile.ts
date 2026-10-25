import type { ProfileContent } from "./model";

export const publicProfile: ProfileContent = {
  displayName: "Ziyaattin Aydın",
  eyebrow: "Hakkımda",
  headline: "Projelerimi ve notlarımı bir araya getirdiğim kişisel alanım.",
  description:
    "Bu siteyi çalışmalarımı düzenlemek ve paylaşmak için geliştiriyorum. Projeler, yazılar ve yolculuk notları burada bir araya geliyor.",
  // The existing about portrait is still a candidate; its approval is unchanged.
  portrait: null,
  portraitApprovalState: "candidate",
  portraitNote: "",
  focusAreas: [],
  values: [],
  technologies: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Supabase",
    "Vercel",
  ],
  publishFlowState: "published",
  approvalNote: "",
  contactNote: "",
  contactStateLabel: "",
};
