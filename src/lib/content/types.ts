import { z } from "zod";

export const projectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  tagline: z.string(),
  category: z.enum(["data-research", "ai-tools", "interactive", "creative"]),
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
  featuredOrder: z.number().optional(),
  catalogOnly: z.boolean().default(false),
  liveUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  thumbnail: z.string(),
  screenshots: z.array(z.string()).default([]),
  status: z.enum(["live", "in-progress", "archived"]).default("live"),
  stackSummary: z.string(),
  publishedAt: z.string(),
});

export type Project = z.infer<typeof projectSchema>;

export type ProjectWithContent = Project & {
  content: string;
};

export const categoryLabels: Record<Project["category"], string> = {
  "data-research": "Data & Research",
  "ai-tools": "AI & Tools",
  interactive: "Interactive",
  creative: "Creative",
};
