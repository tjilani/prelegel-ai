import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DocumentPreviewProps {
  markdown: string;
}

const DocumentPreview = forwardRef<HTMLDivElement, DocumentPreviewProps>(
  function DocumentPreview({ markdown }, ref) {
    return (
      <div
        ref={ref}
        className="mnda-document mx-auto max-w-3xl bg-white p-10 text-zinc-900 shadow-sm ring-1 ring-zinc-200"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    );
  },
);

export default DocumentPreview;
