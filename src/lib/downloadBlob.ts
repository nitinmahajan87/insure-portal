/**
 * Triggers a browser "Save As" download from a Blob.
 * Creates a temporary <a> element, clicks it, then immediately cleans up.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  // Revoke on next tick so the browser has time to start the download
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Derives a safe filename from a URL or falls back to the provided default.
 * e.g. "https://cdn/files/batch_2024.xlsx" → "batch_2024.xlsx"
 */
export function filenameFromUrl(url: string | null, fallback: string): string {
  if (!url) return fallback;
  try {
    const path = new URL(url).pathname;
    const name = path.split("/").pop();
    return name && name.includes(".") ? name : fallback;
  } catch {
    return fallback;
  }
}
