import { access } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const extensions = [".ts", ".tsx", ".js", ".mjs"];

async function resolveAlias(specifier) {
  const relativePath = specifier.slice(2);
  const basePath = path.resolve(process.cwd(), "src", relativePath);

  for (const extension of extensions) {
    const candidate = `${basePath}${extension}`;

    try {
      await access(candidate);
      return pathToFileURL(candidate).href;
    } catch {
      // Try the next supported source extension.
    }
  }

  for (const extension of extensions) {
    const candidate = path.join(basePath, `index${extension}`);

    try {
      await access(candidate);
      return pathToFileURL(candidate).href;
    } catch {
      // Try the next supported index extension.
    }
  }

  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith("@/")) {
    return nextResolve(specifier, context);
  }

  const url = await resolveAlias(specifier);

  if (!url) {
    return nextResolve(specifier, context);
  }

  return {
    url,
    shortCircuit: true,
  };
}
