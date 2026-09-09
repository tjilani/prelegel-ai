import { escapeMarkdown, escapeTableCell, toSingleLine } from "./markdownUtils";
import { numberToWords } from "./numberToWords";
import {
  COVER_PAGE_FOOTER,
  COVER_PAGE_INTRO,
  STANDARD_TERMS_TEMPLATE,
} from "./templates";
import type { MndaFormData, PartyInfo } from "./types";

/**
 * Formats a free-text field for embedding inline in running prose (e.g. mid
 * sentence in the Standard Terms). Collapses it to a single line first —
 * "purpose" in particular comes from a textarea, and a blank line typed
 * there would otherwise fracture the surrounding sentence into two
 * disconnected Markdown paragraphs.
 */
function orPlaceholder(value: string, label: string): string {
  const singleLine = toSingleLine(value);
  return singleLine ? escapeMarkdown(singleLine) : `[${label}]`;
}

function formatDate(iso: string): string {
  if (!iso) return "[Effective Date]";
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "[Effective Date]";
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function yearsPhrase(years: number): string {
  const safeYears = Math.max(1, Math.round(years) || 1);
  return `${numberToWords(safeYears)} year${safeYears === 1 ? "" : "s"}`;
}

/**
 * Builds the noun phrase that fills the Standard Terms' "expires at the end
 * of ___" clause, mirroring the Cover Page's own two MNDA Term options.
 */
function mndaTermPhrase(data: MndaFormData): string {
  if (data.mndaTermType === "continues") {
    return "the term that continues until either party terminates this MNDA in accordance with its terms";
  }
  return `${yearsPhrase(data.mndaTermYears)} from the Effective Date`;
}

/**
 * Builds the noun phrase that fills the Standard Terms' "will survive for
 * ___" clause, mirroring the Cover Page's own two Term of Confidentiality
 * options.
 */
function termOfConfidentialityPhrase(data: MndaFormData): string {
  if (data.confidentialityTermType === "perpetuity") {
    return "a period continuing in perpetuity";
  }
  return `${yearsPhrase(
    data.confidentialityTermYears,
  )} from the Effective Date (or, in the case of trade secrets, until the Confidential Information is no longer considered a trade secret under applicable law)`;
}

function buildStandardTermsMarkdown(data: MndaFormData): string {
  const substitutions: Record<string, string> = {
    purpose: orPlaceholder(data.purpose, "Purpose"),
    effectiveDate: formatDate(data.effectiveDate),
    mndaTerm: mndaTermPhrase(data),
    termOfConfidentiality: termOfConfidentialityPhrase(data),
    governingLaw: orPlaceholder(data.governingLaw, "Governing Law"),
    jurisdiction: orPlaceholder(data.jurisdiction, "Jurisdiction"),
  };

  return STANDARD_TERMS_TEMPLATE.replace(
    /\{\{(\w+)\}\}/g,
    (match, token: string) => substitutions[token] ?? match,
  );
}

function partyTableRow(
  label: string,
  party1Value: string,
  party2Value: string,
): string {
  return `| ${label} | ${escapeTableCell(party1Value)} | ${escapeTableCell(
    party2Value,
  )} |`;
}

function buildSignatureTable(party1: PartyInfo, party2: PartyInfo): string {
  return [
    "|  | PARTY 1 | PARTY 2 |",
    "|:--- | :---: | :---: |",
    "| Signature | | |",
    partyTableRow("Print Name", party1.printName, party2.printName),
    partyTableRow("Title", party1.title, party2.title),
    partyTableRow("Company", party1.companyName, party2.companyName),
    partyTableRow(
      "Notice Address",
      party1.noticeAddress,
      party2.noticeAddress,
    ),
    "| Date | | |",
  ].join("\n");
}

function buildCoverPageMarkdown(data: MndaFormData): string {
  const mndaTermExpires = data.mndaTermType === "expires";
  const confidentialityYears = data.confidentialityTermType === "years";
  const modificationsLine = toSingleLine(data.modifications);
  const modifications = modificationsLine
    ? escapeMarkdown(modificationsLine)
    : "None.";

  return `# Mutual Non-Disclosure Agreement

${COVER_PAGE_INTRO}

### Purpose

${orPlaceholder(data.purpose, "Purpose")}

### Effective Date

${formatDate(data.effectiveDate)}

### MNDA Term

- [${mndaTermExpires ? "x" : " "}] Expires ${yearsPhrase(
    data.mndaTermYears,
  )} from Effective Date.
- [${mndaTermExpires ? " " : "x"}] Continues until terminated in accordance with the terms of the MNDA.

### Term of Confidentiality

- [${confidentialityYears ? "x" : " "}] ${yearsPhrase(
    data.confidentialityTermYears,
  )} from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.
- [${confidentialityYears ? " " : "x"}] In perpetuity.

### Governing Law & Jurisdiction

Governing Law: ${orPlaceholder(data.governingLaw, "Governing Law")}

Jurisdiction: ${orPlaceholder(data.jurisdiction, "Jurisdiction")}

### MNDA Modifications

${modifications}

By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.

${buildSignatureTable(data.party1, data.party2)}

${COVER_PAGE_FOOTER}
`;
}

/** Builds the full, combined Cover Page + Standard Terms document as Markdown. */
export function buildMndaMarkdown(data: MndaFormData): string {
  return `${buildCoverPageMarkdown(data)}\n---\n\n${buildStandardTermsMarkdown(data)}`;
}

function slugifyForFilename(value: string): string {
  const slug = value
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "Party";
}

/** Suggests a filename for the downloaded document based on the two party names. */
export function suggestFilename(data: MndaFormData): string {
  const party1 = slugifyForFilename(
    data.party1.companyName || data.party1.printName,
  );
  const party2 = slugifyForFilename(
    data.party2.companyName || data.party2.printName,
  );
  return `Mutual-NDA-${party1}-and-${party2}.pdf`;
}
