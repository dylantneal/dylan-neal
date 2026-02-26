import { getAllProjects } from "@/lib/content/projects";
import { ProjectsIndexClient } from "./ProjectsIndexClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Engineering portfolio — data products, AI tools, interactive experiences, and creative technology.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <h1 className="font-heading text-3xl font-bold text-surface md:text-4xl">
        Projects
      </h1>
      <p className="mt-3 max-w-2xl text-surface/60">
        A catalog of products, tools, and experiments I&apos;ve built: data
        platforms, game engines, WebGL experiences, and commercial web
        products.
      </p>

      <ProjectsIndexClient projects={projects} />
    </div>
  );
}
