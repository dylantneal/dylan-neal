"use client";

import { cn } from "@/lib/utils";

type CatalogMode = "engineering" | "full";

export function CatalogToggle({
  mode,
  onChange,
}: {
  mode: CatalogMode;
  onChange: (mode: CatalogMode) => void;
}) {
  return (
    <div className="inline-flex rounded-sm border border-board-light/40 bg-board-light/10 p-0.5">
      <button
        onClick={() => onChange("engineering")}
        className={cn(
          "rounded-sm px-3 py-1.5 font-mono text-xs transition-colors",
          mode === "engineering"
            ? "bg-gold text-ink"
            : "text-surface/60 hover:text-surface"
        )}
      >
        Engineering
      </button>
      <button
        onClick={() => onChange("full")}
        className={cn(
          "rounded-sm px-3 py-1.5 font-mono text-xs transition-colors",
          mode === "full"
            ? "bg-gold text-ink"
            : "text-surface/60 hover:text-surface"
        )}
      >
        Full Catalog
      </button>
    </div>
  );
}
