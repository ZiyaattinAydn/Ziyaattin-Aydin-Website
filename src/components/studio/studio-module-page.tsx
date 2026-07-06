import { StudioEmptyState } from "@/components/studio/studio-empty-state";
import { StudioMockList } from "@/components/studio/studio-mock-list";
import { StudioPageHeader } from "@/components/studio/studio-page-header";
import { StudioScopeList } from "@/components/studio/studio-scope-list";

type StudioModulePageProps = {
  module: {
    eyebrow: string;
    title: string;
    description: string;
    v1Scope: readonly string[];
    emptyTitle: string;
    emptyDescription: string;
    nextActions: readonly string[];
    previewItems: readonly {
      title: string;
      meta: string;
      description: string;
    }[];
  };
};

export function StudioModulePage({ module }: StudioModulePageProps) {
  return (
    <div className="space-y-8">
      <StudioPageHeader eyebrow={module.eyebrow} title={module.title} description={module.description} status="Mock / shell" />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <StudioScopeList title="V1.0'da bu modül ne yönetecek?" items={module.v1Scope} />
        <StudioMockList title="Örnek içerik ayrımı" description="Aşağıdaki kayıtlar gerçek veri değildir." items={module.previewItems} />
      </div>

      <StudioEmptyState title={module.emptyTitle} description={module.emptyDescription} nextActions={module.nextActions} />
    </div>
  );
}
