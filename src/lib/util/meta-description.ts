/**
 * Transformă un text (de ex. descrierea unui produs) într-un meta description
 * potrivit pentru Google: fără HTML, pe un singur rând, maxim ~155 de caractere.
 */
export function toMetaDescription(
  text: string | null | undefined,
  fallback: string,
  max = 155
): string {
  const clean = (text ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  const source = clean || fallback

  if (source.length <= max) {
    return source
  }

  const cut = source.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(" ")
  const trimmed = lastSpace > 80 ? cut.slice(0, lastSpace) : cut

  return trimmed.replace(/[\s,;:.\u2013\u2014-]+$/, "") + "\u2026"
}
