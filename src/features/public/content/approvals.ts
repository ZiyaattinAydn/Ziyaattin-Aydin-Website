import type {
  ApprovalState,
  ApprovedPublicImage,
  ProjectLinks,
  WritingExternalLink,
} from "@/features/public/content/model";

function normalizePublicUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  if (
    trimmedValue.startsWith("/") &&
    !trimmedValue.startsWith("//")
  ) {
    return trimmedValue;
  }

  try {
    const parsedUrl = new URL(trimmedValue);

    if (
      (parsedUrl.protocol !== "https:" &&
        parsedUrl.protocol !== "http:") ||
      parsedUrl.username ||
      parsedUrl.password
    ) {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

export function getApprovedPublicUrl(
  value: string | null,
  approvalState: ApprovalState,
): string | null {
  if (approvalState !== "approved") {
    return null;
  }

  return normalizePublicUrl(value);
}

export function sanitizeProjectLinks(
  links: ProjectLinks,
): ProjectLinks {
  return {
    demo: {
      ...links.demo,
      href: getApprovedPublicUrl(
        links.demo.href,
        links.demo.approvalState,
      ),
    },
    github: {
      ...links.github,
      href: getApprovedPublicUrl(
        links.github.href,
        links.github.approvalState,
      ),
    },
  };
}

export function sanitizeWritingExternalLinks(
  links: ReadonlyArray<WritingExternalLink>,
): WritingExternalLink[] {
  return links.map((link) => ({
    ...link,
    href: getApprovedPublicUrl(link.href, link.approvalState),
  }));
}

export function getApprovedPublicImage(
  image:
    | {
        src: string | null;
        alt: string | null;
        note?: string;
      }
    | null,
  approvalState: ApprovalState,
): ApprovedPublicImage | null {
  if (
    approvalState !== "approved" ||
    !image?.src ||
    !image.alt?.trim()
  ) {
    return null;
  }

  const src = normalizePublicUrl(image.src);

  if (!src) {
    return null;
  }

  return {
    src,
    alt: image.alt.trim(),
    note: image.note,
  };
}
