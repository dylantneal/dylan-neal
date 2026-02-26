import { Download, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description: "Dylan Neal's resume — software engineer.",
};

const highlights = [
  { label: "Current Role", value: "Full-Stack Software Engineer" },
  { label: "Education", value: "M.S. Software Engineering, DePaul University · B.F.A. SAIC (Honors)" },
  { label: "Core Stack", value: "TypeScript, React, Next.js, Node.js, Python, PostgreSQL" },
  { label: "Also", value: "C++, Swift/iOS, Canvas/WebGL, AI/ML, D3.js" },
  { label: "Experience", value: "Clarity Lab · Intel 471 · Apple" },
];

export default function ResumePage() {
  const pdfUrl = "/resume.pdf";
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent("https://dylan-neal.com/resume.pdf")}&embedded=true`;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">

      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/50">
            CV
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-surface md:text-4xl">
            Resume
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={pdfUrl}
            download="DylanNeal_Resume.pdf"
            className="inline-flex items-center gap-2 rounded bg-gold px-5 py-2.5 font-mono text-[13px] font-medium text-ink transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(197,164,78,0.3)]"
          >
            <Download size={13} />
            Download PDF
          </a>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded border border-surface/10 px-5 py-2.5 font-mono text-[13px] text-surface/60 transition-all hover:border-gold/30 hover:text-gold"
          >
            <ExternalLink size={13} />
            Open
          </a>
        </div>
      </div>

      {/* Quick highlights */}
      <div className="mt-10 grid gap-3 rounded border border-surface/[0.06] bg-surface/[0.03] p-6 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => (
          <div key={item.label}>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-gold/50">
              {item.label}
            </p>
            <p className="mt-1 text-[13px] leading-snug text-surface/70">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* PDF embed — use iframe pointing directly at the PDF */}
      <div className="mt-8 overflow-hidden rounded border border-surface/[0.06]">
        <div className="flex items-center justify-between border-b border-surface/[0.06] bg-surface/[0.03] px-4 py-2.5">
          <p className="font-mono text-[11px] text-surface/30">
            DylanNeal_Resume.pdf
          </p>
          <a
            href={pdfUrl}
            download="DylanNeal_Resume.pdf"
            className="font-mono text-[11px] text-surface/30 transition-colors hover:text-gold"
          >
            <Download size={12} />
          </a>
        </div>
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=page-fit`}
          className="w-full border-0 bg-white"
          style={{ aspectRatio: "8.5 / 11", display: "block" }}
          title="Dylan Neal Resume"
        />
      </div>

      {/* Fallback link */}
      <p className="mt-4 text-center font-mono text-[11px] text-surface/25">
        Not rendering?{" "}
        <a href={pdfUrl} download className="text-gold/60 underline hover:text-gold">
          Download the PDF directly
        </a>
        {" · "}
        <a href={googleViewerUrl} target="_blank" rel="noopener noreferrer" className="text-gold/60 underline hover:text-gold">
          Open in Google Docs viewer
        </a>
      </p>
    </div>
  );
}
