export const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export type LibraryState = {
  status: "idle" | "error" | "success";
  message: string;
};
export const initialLibraryState: LibraryState = {
  status: "idle",
  message: "",
};
export type LibraryProject = {
  id: string;
  title: string;
  status: string;
  publish_state: string;
};
export type Note = {
  id: string;
  project_id: string | null;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  status: string;
  created_at: string;
  updated_at: string;
};
export type StoredFile = {
  id: string;
  project_id: string | null;
  original_name: string;
  storage_bucket: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  status: string;
  upload_status: string;
  created_at: string;
  updated_at: string;
};
export function parseNote(form: FormData) {
  const title = String(form.get("title") ?? "").trim();
  const content = String(form.get("content") ?? "");
  const category = String(form.get("category") ?? "").trim();
  const tags = [
    ...new Set(
      String(form.get("tags") ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ];
  const project_id = String(form.get("projectId") ?? "").trim() || null;
  if (!title || title.length > 200)
    throw new Error("Başlık 1–200 karakter olmalı.");
  if (
    content.length > 100000 ||
    category.length > 100 ||
    tags.length > 20 ||
    tags.some((t) => t.length > 50)
  )
    throw new Error(
      "İçerik en fazla 100.000 karakter, kategori 100 karakter ve etiketler en fazla 20 adet olabilir.",
    );
  if (project_id && !UUID.test(project_id))
    throw new Error("Geçerli bir proje seç.");
  return { title, content, category: category || null, tags, project_id };
}
export function filterNotes(
  notes: Note[],
  filters: {
    q?: string;
    project?: string;
    category?: string;
    tag?: string;
    status?: string;
    sort?: string;
  },
) {
  const q = (filters.q ?? "").trim().toLocaleLowerCase("tr");
  return notes
    .filter(
      (n) =>
        n.status === (filters.status === "archived" ? "archived" : "active") &&
        (!filters.project || n.project_id === filters.project) &&
        (!filters.category || n.category === filters.category) &&
        (!filters.tag || n.tags.includes(filters.tag)) &&
        (!q ||
          [n.title, n.content, n.category, ...n.tags]
            .join(" ")
            .toLocaleLowerCase("tr")
            .includes(q)),
    )
    .sort((a, b) =>
      filters.sort === "title"
        ? a.title.localeCompare(b.title, "tr")
        : filters.sort === "oldest"
          ? a.created_at.localeCompare(b.created_at)
          : b.updated_at.localeCompare(a.updated_at),
    );
}
export const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];
export const FILE_TYPES = [
  ...IMAGE_TYPES,
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
export function validateUpload(
  name: string,
  type: string,
  size: number,
  image = false,
) {
  const extensions: Record<string, string[]> = {
    "image/jpeg": ["jpg", "jpeg"],
    "image/png": ["png"],
    "image/webp": ["webp"],
    "image/avif": ["avif"],
    "application/pdf": ["pdf"],
    "text/plain": ["txt"],
    "text/markdown": ["md", "markdown"],
    "application/msword": ["doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      "docx",
    ],
    "application/vnd.ms-powerpoint": ["ppt"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      ["pptx"],
  };
  if (!name.trim() || name.length > 200 || /[\x00-\x1f\\/]/.test(name))
    throw new Error("Dosya adı geçersiz veya çok uzun.");
  if (
    !(image ? IMAGE_TYPES : FILE_TYPES).includes(type) ||
    !extensions[type]?.includes(name.split(".").pop()?.toLowerCase() ?? "")
  )
    throw new Error("Desteklenmeyen dosya türü veya uzantı.");
  if (
    !Number.isSafeInteger(size) ||
    size < 1 ||
    size > (image ? 10 : 25) * 1024 * 1024
  )
    throw new Error(
      image
        ? "Görsel en fazla 10 MB olabilir."
        : "Dosya en fazla 25 MB olabilir.",
    );
}
export function matchesSignature(bytes: Uint8Array, type: string) {
  const head = Array.from(bytes.slice(0, 16));
  const starts = (...v: number[]) => v.every((x, i) => head[i] === x);
  const text = new TextDecoder().decode(bytes.slice(0, 64));
  if (type === "image/png") return starts(137, 80, 78, 71, 13, 10, 26, 10);
  if (type === "image/jpeg") return starts(255, 216, 255);
  if (type === "image/webp")
    return text.startsWith("RIFF") && text.slice(8, 12) === "WEBP";
  if (type === "image/avif")
    return text.slice(4, 8) === "ftyp" && /avif|avis/.test(text.slice(8, 32));
  if (type === "application/pdf") return text.startsWith("%PDF-");
  if (type.endsWith(".document") || type.endsWith(".presentation"))
    return starts(80, 75, 3, 4);
  if (type === "application/msword" || type === "application/vnd.ms-powerpoint")
    return starts(208, 207, 17, 224, 161, 177, 26, 225);
  if (type === "text/plain" || type === "text/markdown") {
    try {
      new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      return !bytes.includes(0);
    } catch {
      return false;
    }
  }
  return false;
}
