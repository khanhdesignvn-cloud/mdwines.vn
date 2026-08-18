export function parseProductImages(images: string | null | undefined): string[] {
  if (!images) return [];
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed.filter((i): i is string => typeof i === "string") : [];
  } catch {
    return [];
  }
}
