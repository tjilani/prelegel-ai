/**
 * Escapes characters that are significant to Markdown/GFM so that free-text
 * user input (company names, addresses, etc.) can't accidentally break the
 * generated document's formatting (e.g. an address containing "|" breaking
 * out of the signature table, "*" in a company name creating stray bold
 * text, or "<" in a "Name <email>" style address being parsed as an
 * (unhandled, silently dropped) raw HTML node by react-markdown).
 */
export function escapeMarkdown(value: string): string {
  return value.replace(/([\\`*_{}[\]()#+\-.!|<>~])/g, "\\$1");
}

/**
 * Collapses a possibly multi-line value (e.g. a mailing address typed across
 * multiple lines) into a single line, since GFM table cells cannot contain
 * literal newlines.
 */
export function toSingleLine(value: string): string {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(", ");
}

/** Escapes a value and flattens it for safe use inside a Markdown table cell. */
export function escapeTableCell(value: string): string {
  return escapeMarkdown(toSingleLine(value));
}
