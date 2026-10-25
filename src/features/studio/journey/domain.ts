export type JourneyInput = {
  title: string;
  slug: string;
  period_label: string | null;
  summary: string;
  content: string;
  occurred_on: string | null;
  sort_order: number;
};
export type JourneyState = { status: "idle" | "success" | "error"; message: string };
export const initialJourneyState: JourneyState = { status: "idle", message: "" };
export const JOURNEY_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export type JourneyRow = JourneyInput & {
  id: string;
  owner_id: string;
  status: "active" | "archived";
  visibility: "private" | "hidden" | "public";
  publish_state: string;
  published_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};
export function parseJourney(form: FormData): JourneyInput {
  const text = (key: string) => {
    const value = form.get(key);
    if (typeof value !== "string") throw new Error("Form alanları geçersiz.");
    return value.trim();
  };
  const title = text("title");
  const slug = text("slug");
  const period = text("period_label");
  const summary = text("summary");
  const content = text("content");
  const date = text("occurred_on");
  const sort = text("sort_order");
  if (!title || title.length > 160) throw new Error("Başlık 1–160 karakter olmalı.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120)
    throw new Error("Adres küçük harf, rakam ve kısa tirelerden oluşmalı.");
  if (period.length > 100) throw new Error("Dönem en fazla 100 karakter olabilir.");
  if (summary.length > 800) throw new Error("Özet en fazla 800 karakter olabilir.");
  if (content.length > 20000) throw new Error("İçerik en fazla 20.000 karakter olabilir.");
  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date + "T00:00:00Z")) ||
        new Date(date + "T00:00:00Z").toISOString().slice(0, 10) !== date)
      throw new Error("Tarih geçersiz.");
  }
  const sortOrder = sort ? Number(sort) : 0;
  if (!Number.isInteger(sortOrder) || Math.abs(sortOrder) > 100000)
    throw new Error("Sıralama tam sayı olmalı.");
  return {
    title, slug, period_label: period || null, summary, content,
    occurred_on: date || null, sort_order: sortOrder,
  };
}
