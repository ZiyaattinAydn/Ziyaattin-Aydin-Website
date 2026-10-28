"use client";
import { useRef, useState } from "react";
import { MarkdownContent } from "@/features/writings/markdown-content";

type Props = { value: string; onChange: (value: string) => void; disabled?: boolean };
export function MarkdownEditor({ value, onChange, disabled = false }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  function insert(before: string, after = "", sample = "metin") {
    const field = ref.current;
    if (!field) return;
    const start = field.selectionStart, end = field.selectionEnd;
    const selected = value.slice(start, end) || sample;
    const next = value.slice(0,start) + before + selected + after + value.slice(end);
    onChange(next.slice(0,100000));
    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(start+before.length,start+before.length+selected.length);
    });
  }
  const buttons: Array<[string,string,string,string]> = [
    ["Başlık","## ","","Başlık"],["Kalın","**","**","kalın metin"],
    ["İtalik","*","*","italik metin"],["Alıntı","> ","","Alıntı"],
    ["Liste","- ","","Liste ögesi"],["Numaralı liste","1. ","","Liste ögesi"],
    ["Ayırıcı","\n---\n","",""],
  ];
  return <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] p-3">
      <div className="flex gap-2" role="tablist" aria-label="İçerik görünümü">
        <button type="button" role="tab" aria-selected={tab==="write"} onClick={()=>setTab("write")} className={tab==="write"?"rounded-lg bg-[var(--accent-soft)] px-3 py-2 text-sm text-[var(--accent)]":"px-3 py-2 text-sm"}>Yaz</button>
        <button type="button" role="tab" aria-selected={tab==="preview"} onClick={()=>setTab("preview")} className={tab==="preview"?"rounded-lg bg-[var(--accent-soft)] px-3 py-2 text-sm text-[var(--accent)]":"px-3 py-2 text-sm"}>Önizleme</button>
      </div>
      <span className="text-xs text-[var(--muted)]">{value.length.toLocaleString("tr-TR")} / 100.000</span>
    </div>
    <div className="flex flex-wrap gap-1 border-b border-[var(--border)] px-3 py-2" aria-label="Biçimlendirme araçları">
      {buttons.map(([label,before,after,sample])=><button key={label} disabled={disabled} type="button" onClick={()=>{setTab("write");insert(before,after,sample)}} title={label} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs transition hover:text-[var(--accent)] disabled:opacity-50">{label}</button>)}
    </div>
    <div className={tab==="write"?"block":"hidden"}>
      <textarea ref={ref} name="content" rows={19} maxLength={100000} disabled={disabled}
        className="min-h-96 w-full resize-y bg-transparent p-5 font-mono text-sm leading-7 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
        value={value} onChange={(event)=>onChange(event.target.value)}
        placeholder="Yazını buraya yaz. ## Başlık, **kalın**, *italik*, > alıntı ve - liste kullanabilirsin."
        aria-label="Markdown yazı içeriği"/>
    </div>
    {tab==="preview"&&<div role="tabpanel" className="min-h-96 p-5 sm:p-8"><MarkdownContent content={value}/></div>}
  </div>;
}
