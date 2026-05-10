/** Extract a single https URL from admin `code_snippet` or plain URL text. */
export function sanitizeBookingUrl(raw: unknown): string {
  if (raw == null) return "";
  const s = String(raw).trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s) && !s.includes("<")) {
    const first = s.split(/\s|\n/)[0] ?? s;
    return first.replace(/[,;]+$/, "");
  }
  const m = s.match(/https?:\/\/[^\s"'<>]+/i);
  if (!m) return "";
  return m[0].replace(/[,);]+$/, "");
}
