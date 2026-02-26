import { Badge } from "@/components/ui/badge";
import { categoryLabels, type Project } from "@/lib/content/types";
import { ExternalLink, Github, Play } from "lucide-react";

export function ProjectHero({ project }: { project: Project }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge
          variant="outline"
          className="border-gold/40 font-mono text-xs text-gold"
        >
          {categoryLabels[project.category]}
        </Badge>
        <Badge
          variant="outline"
          className="border-board-light/60 font-mono text-xs text-surface/60"
        >
          {project.status}
        </Badge>
      </div>

      <h1 className="font-heading text-3xl font-bold text-surface md:text-4xl lg:text-5xl">
        {project.title}
      </h1>

      <p className="max-w-3xl text-lg leading-relaxed text-surface/70">
        {project.tagline}
      </p>

      {/* Stack pills */}
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-sm border border-board-light/40 bg-board-light/20 px-2.5 py-1 font-mono text-xs text-surface/60"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action links */}
      <div className="flex flex-wrap gap-4 pt-2">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm bg-gold px-4 py-2 font-mono text-sm font-medium text-ink transition-colors hover:bg-gold-light"
          >
            <ExternalLink size={14} />
            Visit Live Site
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-surface/20 px-4 py-2 font-mono text-sm text-surface/70 transition-colors hover:border-gold/40 hover:text-gold"
          >
            <Github size={14} />
            Repository
          </a>
        )}
        {project.videoUrl && (
          <a
            href={project.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-surface/20 px-4 py-2 font-mono text-sm text-surface/70 transition-colors hover:border-gold/40 hover:text-gold"
          >
            <Play size={14} />
            Demo Video
          </a>
        )}
      </div>
    </div>
  );
}
