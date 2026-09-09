"use client";

import { useState, type RefObject } from "react";
import { exportElementToPdf } from "@/lib/mnda/exportPdf";

interface DownloadButtonProps {
  targetRef: RefObject<HTMLDivElement | null>;
  filename: string;
}

export default function DownloadButton({
  targetRef,
  filename,
}: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "error">(
    "idle",
  );

  async function handleDownload() {
    const element = targetRef.current;
    if (!element) return;

    setStatus("generating");
    try {
      await exportElementToPdf(element, filename);
      setStatus("idle");
    } catch (error) {
      console.error("Failed to generate PDF", error);
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleDownload}
        disabled={status === "generating"}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "generating" ? "Preparing PDF…" : "Download PDF"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong generating the PDF. Please try again.
        </p>
      )}
    </div>
  );
}
