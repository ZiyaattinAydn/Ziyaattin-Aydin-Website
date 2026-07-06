import Link from "next/link";
import { Panel } from "@/components/ui/panel";

type StudioModuleCardProps = {
  href: string;
  title: string;
  description: string;
  eyebrow: string;
};

export function StudioModuleCard({ href, title, description, eyebrow }: StudioModuleCardProps) {
  return (
    <Link href={href} className="group block">
      <Panel className="h-full p-5 transition-transform duration-200 group-hover:-translate-y-1 group-hover:border-[var(--accent-dim)]">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{eyebrow}</p>
        <h2 className="mt-4 text-xl font-semibold">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p>
        <span className="mt-5 inline-flex text-sm text-[var(--accent)]">Modüle git →</span>
      </Panel>
    </Link>
  );
}
