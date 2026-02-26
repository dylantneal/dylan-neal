import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getProjectBySlug,
  getAllProjectSlugs,
} from "@/lib/content/projects";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectEmbed } from "@/components/projects/ProjectEmbed";
import { mdxComponents } from "@/components/projects/MdxComponents";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.tagline,
    openGraph: {
      title: `${project.title} | Dylan Neal`,
      description: project.tagline,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      <ProjectHero project={project} />

      {project.liveUrl && (
        <ProjectEmbed
          url={project.liveUrl}
          title={project.title}
          defaultExpanded={slug === "alieninvaders"}
        />
      )}

      <div className="mt-12 border-t border-surface/[0.06] pt-8">
        <MDXRemote source={project.content} components={mdxComponents} />
      </div>

      {project.screenshots.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 font-heading text-2xl font-bold text-surface">
            Screenshots
          </h2>
          <ProjectGallery screenshots={project.screenshots} />
        </section>
      )}

      <div className="mt-16 border-t border-surface/[0.06] pt-6">
        <p className="font-mono text-xs text-surface/40">
          Stack: {project.stackSummary}
        </p>
      </div>
    </article>
  );
}
