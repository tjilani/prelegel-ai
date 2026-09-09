# Mutual NDA Creator

A prototype web app for generating a filled-in Common Paper Mutual NDA. Fill
in a form with the two parties' details and the deal terms; the app renders
a live preview of the combined Cover Page + Standard Terms document and lets
you download it as a PDF.

This is a client-only Next.js app — there is no backend or persistence.
Everything (form state, document generation, PDF export) runs in the
browser.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or whichever port the
dev server reports, if 3000 is already in use).

## How it works

- `lib/mnda/templates.ts` — the Cover Page and Standard Terms legal text,
  adapted from [Common Paper's Mutual NDA](https://github.com/CommonPaper/Mutual-NDA)
  (CC BY 4.0), with `{{token}}` placeholders where the original template used
  cross-reference spans back to the Cover Page.
- `lib/mnda/buildDocument.ts` — turns form data into the final Markdown
  document, including grammatically-correct phrasing for the term/
  confidentiality options and a Markdown signature table.
- `components/MndaForm.tsx` — the input form.
- `components/DocumentPreview.tsx` — renders the generated Markdown as a
  styled, legal-document-like preview (via `react-markdown` + `remark-gfm`).
- `lib/mnda/exportPdf.ts` — captures the preview with `html2canvas-pro`
  (a fork of html2canvas that supports the modern CSS color functions
  Tailwind v4 emits) and paginates it into a US-letter PDF via `jspdf`.

## Known limitations (prototype scope)

- The exported PDF is image-based (a canvas snapshot per page), not real
  selectable/searchable text.
- No e-signature support — the signature block is left blank for the
  parties to sign separately.
- No persistence — refreshing the page resets the form.
