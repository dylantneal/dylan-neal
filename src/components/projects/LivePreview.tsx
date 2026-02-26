"use client";

import { useEffect, useRef, useState } from "react";

interface LivePreviewProps {
  url: string;
  title: string;
  interactive?: boolean;
}

export function LivePreview({ url, title, interactive = false }: LivePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: "16 / 10" }}
    >
      {visible ? (
        <div className="absolute inset-0 origin-top-left" style={{
          width: "1280px",
          height: "800px",
          transform: `scale(${containerRef.current ? containerRef.current.offsetWidth / 1280 : 0.25})`,
        }}>
          <iframe
            src={url}
            title={title}
            className="h-full w-full border-0"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            allow="autoplay 'none'"
            style={{ pointerEvents: interactive ? "auto" : "none" }}
          />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-board-light/10">
          <span className="font-mono text-xs text-surface/20">Loading...</span>
        </div>
      )}
    </div>
  );
}
