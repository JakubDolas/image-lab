export function extOf(file: File) {
  return file.name.split(".").pop()?.toLowerCase() ?? "unknown";
}

export function isLossy(format: string) {
  return format === "jpeg" || format === "webp";
}

export function isResized(size?: {
  width: number | null;
  height: number | null;
}) {
  return Boolean(size && (size.width || size.height));
}
