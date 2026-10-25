import { type NextRequest } from "next/server";
import { ownedFile } from "@/features/studio/library/server";
const headers = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "Content-Security-Policy":
    "sandbox; default-src 'none'; img-src 'self'; style-src 'unsafe-inline'",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
};
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  try {
    const { fileId } = await params;
    const { db, file } = await ownedFile(fileId);
    if (file.upload_status !== "uploaded")
      return new Response("Dosya hazır değil.", { status: 404, headers });
    const r = await db.storage
      .from(file.storage_bucket)
      .download(file.storage_path);
    if (r.error || !r.data)
      return new Response("Dosya şu anda açılamıyor.", {
        status: 404,
        headers,
      });
    const preview =
      file.mime_type.startsWith("image/") ||
      file.mime_type === "application/pdf" ||
      file.mime_type.startsWith("text/");
    const disposition =
      request.nextUrl.searchParams.get("download") === "1" || !preview
        ? "attachment"
        : "inline";
    return new Response(r.data, {
      headers: {
        ...headers,
        "Content-Type": file.mime_type.startsWith("text/")
          ? "text/plain; charset=utf-8"
          : file.mime_type,
        "Content-Disposition": `${disposition}; filename="download"; filename*=UTF-8''${encodeURIComponent(file.original_name).replace(/['()]/g, (c) => "%" + c.charCodeAt(0).toString(16))}`,
      },
    });
  } catch {
    return new Response("Dosyaya erişilemiyor.", { status: 403, headers });
  }
}
