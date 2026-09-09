const PAGE_WIDTH_IN = 8.5;
const PAGE_HEIGHT_IN = 11;
const MARGIN_IN = 0.5;
const CONTENT_WIDTH_IN = PAGE_WIDTH_IN - MARGIN_IN * 2;
const CONTENT_HEIGHT_IN = PAGE_HEIGHT_IN - MARGIN_IN * 2;

/**
 * Renders a DOM element to a paginated, US-letter PDF and triggers a
 * download. Captures via html2canvas-pro (a maintained html2canvas fork that
 * understands modern CSS color functions like oklch/lab, which Tailwind v4
 * emits and the original html2canvas cannot parse) and slices the resulting
 * image across as many pages as needed.
 */
export async function exportElementToPdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  const pxPerIn = canvas.width / CONTENT_WIDTH_IN;
  const pageHeightPx = Math.floor(CONTENT_HEIGHT_IN * pxPerIn);
  const pageCount = Math.max(1, Math.ceil(canvas.height / pageHeightPx));

  const pdf = new jsPDF({ unit: "in", format: "letter", orientation: "portrait" });
  const sliceCanvas = document.createElement("canvas");
  const sliceContext = sliceCanvas.getContext("2d");
  if (!sliceContext) throw new Error("Could not create canvas context for PDF export");
  sliceCanvas.width = canvas.width;

  for (let page = 0; page < pageCount; page++) {
    const sliceStartPx = page * pageHeightPx;
    const sliceHeightPx = Math.min(pageHeightPx, canvas.height - sliceStartPx);
    sliceCanvas.height = sliceHeightPx;

    sliceContext.clearRect(0, 0, sliceCanvas.width, sliceCanvas.height);
    sliceContext.drawImage(
      canvas,
      0,
      sliceStartPx,
      canvas.width,
      sliceHeightPx,
      0,
      0,
      canvas.width,
      sliceHeightPx,
    );

    const sliceImage = sliceCanvas.toDataURL("image/jpeg", 0.95);
    const sliceHeightIn = sliceHeightPx / pxPerIn;

    if (page > 0) pdf.addPage();
    pdf.addImage(
      sliceImage,
      "JPEG",
      MARGIN_IN,
      MARGIN_IN,
      CONTENT_WIDTH_IN,
      sliceHeightIn,
    );
  }

  pdf.save(filename);
}
