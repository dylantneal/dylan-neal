"use client";

import { useState } from "react";
import { CatalogToggle } from "@/components/projects/CatalogToggle";
import { ProjectCard } from "@/components/projects/ProjectCard";
import {
  categoryLabels,
  type Project,
} from "@/lib/content/types";

const categoryOrder: Project["category"][] = [
  "data-research",
  "ai-tools",
  "interactive",
  "creative",
];

export function ProjectsIndexClient({ projects }: { projects: Project[] }) {
  const [mode, setMode] = useState<"engineering" | "full">("engineering");

  const visible =
    mode === "engineering"
      ? projects.filter((p) => !p.catalogOnly)
      : projects;

  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      label: categoryLabels[cat],
      projects: visible.filter((p) => p.category === cat),
    }))
    .filter((g) => g.projects.length > 0);

  return (
    <div className="mt-8">
      <CatalogToggle mode={mode} onChange={setMode} />

      <div className="mt-10 space-y-14">
        {grouped.map((group) => (
          <section key={group.category}>
            <h2 className="mb-5 font-mono text-xs font-medium uppercase tracking-widest text-gold/70">
              {group.label}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
