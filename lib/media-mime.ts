/**
 * Binary magic-byte MIME detector + inline data-URL parser.
 *
 * Safari's `HTMLCanvasElement.toBlob(cb, "image/webp")` silently falls back to
 * encoding PNG bytes (`\x89PNG\r\n\x1a\n`) while client code may still label
 * the File/data-URL as `image/webp`. Serving PNG bytes over HTTP with
 * `Content-Type: image/webp` + `X-Content-Type-Options: nosniff` causes
 * WebKit/Safari and strict browsers to fail image decoding completely.
 *
 * Always inspect actual magic bytes before setting `Content-Type`.
 */

export function detectBufferMimeType(
  bytes: Uint8Array | Buffer,
  fallback = "application/octet-stream"
): string {
  if (!bytes || bytes.length < 4) return fallback;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  // GIF: "GIF87a" or "GIF89a"
  if (
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38 &&
    (bytes[4] === 0x37 || bytes[4] === 0x39) &&
    bytes[5] === 0x61
  ) {
    return "image/gif";
  }

  // WebP: "RIFF" .... "WEBP"
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }

  // AVIF / HEIF: .... "ftypavif" / "ftypavis"
  if (
    bytes.length >= 12 &&
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70 &&
    bytes[8] === 0x61 &&
    bytes[9] === 0x76 &&
    bytes[10] === 0x69
  ) {
    return "image/avif";
  }

  // BMP: "BM"
  if (bytes[0] === 0x42 && bytes[1] === 0x4d) {
    return "image/bmp";
  }

  // PDF: "%PDF-"
  if (
    bytes.length >= 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  ) {
    return "application/pdf";
  }

  // SVG: check leading text for <svg or <?xml ... <svg
  const headSample = Buffer.from(bytes.subarray(0, Math.min(bytes.length, 512)))
    .toString("utf8")
    .trimStart()
    .toLowerCase();
  if (
    headSample.startsWith("<svg") ||
    (headSample.startsWith("<?xml") && headSample.includes("<svg"))
  ) {
    return "image/svg+xml";
  }

  return fallback;
}

export function parseDataUrl(
  dataUrl: string
): { bytes: Buffer; mimeType: string } | null {
  if (!dataUrl || !dataUrl.startsWith("data:")) return null;
  const commaIdx = dataUrl.indexOf(",");
  if (commaIdx === -1) return null;

  const meta = dataUrl.slice(5, commaIdx);
  const [mimeRaw, encoding] = meta.split(";");
  const declaredMime = mimeRaw || "image/png";
  const payload = dataUrl.slice(commaIdx + 1);

  const bytes =
    encoding === "base64"
      ? Buffer.from(payload, "base64")
      : Buffer.from(decodeURIComponent(payload), "utf8");

  const mimeType = detectBufferMimeType(bytes, declaredMime);
  return { bytes, mimeType };
}
