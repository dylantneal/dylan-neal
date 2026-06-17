"use client";

import { useState } from "react";
import { ExternalLink, Maximize2, Minimize2 } from "lucide-react";

interface ProjectEmbedProps {
  url: string;
  title: string;
  defaultExpanded?: boolean;
}

export function ProjectEmbed({ url, title, defaultExpanded = false }: ProjectEmbedProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/50">
          Live Preview
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-surface/40 transition-colors hover:text-gold"
          >
            {expanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            {expanded ? "Collapse" : "Expand"}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-surface/40 transition-colors hover:text-gold"
          >
            <ExternalLink size={12} />
            Open
          </a>
        </div>
      </div>
      <div
        className="overflow-hidden rounded border border-surface/[0.08] transition-all duration-300"
        style={{ height: expanded ? "80vh" : "450px" }}
      >
        <iframe
          src={url}
          title={`${title} — Live Preview`}
          className="h-full w-full border-0"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </section>
  );
}
