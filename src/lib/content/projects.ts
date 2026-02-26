import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { projectSchema, type Project, type ProjectWithContent } from "./types";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export function getAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".mdx"));

  const projects = files
    .map((filename) => {
      const filePath = path.join(PROJECTS_DIR, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      const parsed = projectSchema.safeParse(data);
      if (!parsed.success) {
        console.error(`Invalid frontmatter in ${filename}:`, parsed.error);
        return null;
      }
      return parsed.data;
    })
    .filter((p): p is Project => p !== null);

  return projects.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects()
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
}

export function getProjectBySlug(slug: string): ProjectWithContent | null {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const parsed = projectSchema.safeParse(data);

  if (!parsed.success) {
    console.error(`Invalid frontmatter in ${slug}.mdx:`, parsed.error);
    return null;
  }

  return { ...parsed.data, content };
}

export function getAllProjectSlugs(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export { type Project, type ProjectWithContent, categoryLabels } from "./types";
