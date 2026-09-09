"use client";

import { useMemo, useRef, useState } from "react";
import DocumentPreview from "@/components/DocumentPreview";
import DownloadButton from "@/components/DownloadButton";
import MndaForm from "@/components/MndaForm";
import { buildMndaMarkdown, suggestFilename } from "@/lib/mnda/buildDocument";
import { createDefaultFormData } from "@/lib/mnda/types";

export default function Home() {
  const [formData, setFormData] = useState(createDefaultFormData);
  const previewRef = useRef<HTMLDivElement>(null);

  const documentMarkdown = useMemo(
    () => buildMndaMarkdown(formData),
    [formData],
  );
  const filename = useMemo(() => suggestFilename(formData), [formData]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-zinc-900">
          Mutual NDA Creator
        </h1>
        <p className="text-sm text-zinc-500">
          Fill in the details below to generate a Common Paper Mutual NDA,
          then download it as a PDF.
        </p>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <MndaForm data={formData} onChange={setFormData} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">Preview</h2>
            <DownloadButton targetRef={previewRef} filename={filename} />
          </div>
          <div className="max-h-[80vh] overflow-y-auto rounded-lg bg-zinc-100 p-4">
            <DocumentPreview ref={previewRef} markdown={documentMarkdown} />
          </div>
        </div>
      </main>
    </div>
  );
}
