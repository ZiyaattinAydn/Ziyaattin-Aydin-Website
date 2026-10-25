"use client";
import Image from "next/image";
import { useState } from "react";
export function ContentImage({ src, alt }: { src: string; alt: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (failedSrc === src)
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border border-[var(--border)] p-6 text-sm text-[var(--muted)]">
        Görsel şu anda yüklenemiyor.
      </div>
    );
  return (
    <Image
      key={src}
      src={src}
      alt={alt}
      width={1200}
      height={675}
      sizes="(max-width: 768px) 100vw, 75vw"
      unoptimized={src.startsWith("https:")}
      onError={() => setFailedSrc(src)}
      className="aspect-video w-full rounded-xl border border-[var(--border)] object-cover"
    />
  );
}
