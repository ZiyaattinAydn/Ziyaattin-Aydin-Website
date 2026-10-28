import type { ReactNode } from "react";

/** Restricted Markdown renderer: React escapes all text; no raw HTML, script, or unsafe links. */
function inline(source: string): ReactNode[] {
  const pattern = /(`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*|__[^_\n]+__|_[^_\n]+_)/g;
  const parts = source.split(pattern);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2)
      return <code key={index} className="rounded bg-[var(--surface-strong)] px-1 py-0.5">{part.slice(1, -1)}</code>;
    if ((part.startsWith("**") && part.endsWith("**")) || (part.startsWith("__") && part.endsWith("__")))
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    if ((part.startsWith("*") && part.endsWith("*")) || (part.startsWith("_") && part.endsWith("_")))
      return <em key={index}>{part.slice(1, -1)}</em>;
    return part;
  });
}

export function markdownHeadings(content: string, prefix = "content") {
  let index = 0;
  let code = false;
  return content.split(/\r?\n/).flatMap((line) => {
    if (line.trimStart().startsWith("```")) { code = !code; return []; }
    if (code) return [];
    const match = /^(#{1,6})\s+(.+)$/.exec(line);
    return match ? [{ id: prefix + "-heading-" + index++, title: match[2].replace(/[\x60*_]/g, "").trim() }] : [];
  });
}
export function MarkdownContent({ content, headingPrefix = "content" }: { content: string; headingPrefix?: string }) {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const nodes: ReactNode[] = [];
  let i = 0;
  let headingIndex = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const fence = /^\s*```/.test(line);
    if (fence) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) code.push(lines[i++]);
      if (i < lines.length) i++;
      nodes.push(<pre key={nodes.length}><code>{code.join("\n")}</code></pre>);
      continue;
    }
    if (/^\s*(?:---+|\*\s*\*\s*\*+|___+)\s*$/.test(line)) {
      nodes.push(<hr key={nodes.length} className="my-8 border-[var(--border)]"/>);
      i++; continue;
    }
    const h = /^(#{1,6})\s+(.+)$/.exec(line);
    if (h) {
      const title = inline(h[2]);
      const cls = "break-words font-semibold tracking-tight";
      const level = h[1].length;
      const id = headingPrefix + "-heading-" + headingIndex++;
      nodes.push(level === 1 ? <h2 id={id} key={nodes.length} className={cls+" scroll-mt-24"}>{title}</h2>
        : level === 2 ? <h3 id={id} key={nodes.length} className={cls+" scroll-mt-24 text-xl"}>{title}</h3>
        : <h4 id={id} key={nodes.length} className={cls+" scroll-mt-24 text-lg"}>{title}</h4>);
      i++; continue;
    }
    if (/^\s*>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) quote.push(lines[i++].replace(/^\s*>\s?/, ""));
      nodes.push(<blockquote key={nodes.length}>{quote.map((p,j)=><span key={j}>{inline(p)}{j<quote.length-1?" ":null}</span>)}</blockquote>);
      continue;
    }
    const listPattern = /^\s*(?:([-*+])|(\d+)\.)\s+(.+)$/;
    const first = listPattern.exec(line);
    if (first) {
      const ordered = Boolean(first[2]); const items: string[] = [];
      while (i < lines.length) {
        const match = listPattern.exec(lines[i]);
        if (!match || Boolean(match[2]) !== ordered) break;
        items.push(match[3]); i++;
      }
      const listItems = items.map((v,j)=><li key={j}>{inline(v)}</li>);
      nodes.push(ordered ? <ol key={nodes.length} className="list-decimal space-y-2 pl-6">{listItems}</ol>
        : <ul key={nodes.length} className="list-disc space-y-2 pl-6">{listItems}</ul>);
      continue;
    }
    const paragraph = [line.trim()];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|\s*>|\s*```|\s*[-*+]\s|\s*\d+\.\s|\s*---+\s*$)/.test(lines[i])) paragraph.push(lines[i++].trim());
    nodes.push(<p key={nodes.length} className="break-words">{inline(paragraph.join(" "))}</p>);
  }
  return <div className="prose-dark space-y-5 [overflow-wrap:anywhere]">{nodes}</div>;
}
