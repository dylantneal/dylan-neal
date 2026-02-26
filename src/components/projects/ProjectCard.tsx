import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { categoryLabels, type Project } from "@/lib/content/types";
import { ExternalLink } from "lucide-react";
import { LivePreview } from "./LivePreview";

const categoryIcons: Record<Project["category"], string> = {
  "data-research": "01",
  "ai-tools": "02",
  interactive: "03",
  creative: "04",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block overflow-hidden rounded border border-surface/[0.06] bg-surface/[0.03] backdrop-blur-sm transition-all duration-300 hover:border-gold/20 hover:bg-surface/[0.06] hover:shadow-[0_0_40px_rgba(197,164,78,0.06)]"
    >
      {/* Live preview or fallback */}
      <div className="relative overflow-hidden">
        <div className="absolute right-3 top-3 z-10 font-mono text-[10px] tracking-wider text-surface/15">
          {categoryIcons[project.category]}
        </div>
        {project.liveUrl ? (
          <LivePreview url={project.liveUrl} title={project.title} />
        ) : (
          <div className="flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-board-light/20 via-transparent to-board-light/10">
            <span className="font-heading text-lg font-bold text-surface/15">
              {project.title}
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-surface/[0.06] transition-colors duration-300 group-hover:bg-gold/20" />

      {/* Content */}
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-gold/20 bg-gold/[0.05] font-mono text-[10px] text-gold/80"
          >
            {categoryLabels[project.category]}
          </Badge>
          {project.liveUrl && (
            <ExternalLink size={11} className="text-surface/25" />
          )}
        </div>

        <h3 className="font-heading text-lg font-semibold text-surface/90 transition-colors duration-300 group-hover:text-gold">
          {project.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-surface/50">
          {project.tagline}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-sm bg-surface/[0.04] px-2 py-0.5 font-mono text-[10px] text-surface/35"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
