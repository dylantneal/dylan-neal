import Link from "next/link";
import Image from "next/image";
import { getFeaturedProjects } from "@/lib/content/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { HeroChip } from "@/components/three/HeroChip";
import { ArrowRight, Download, Mail } from "lucide-react";

const skillGroups = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "C++", "Swift", "SQL", "Java"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Canvas API", "WebGL / Three.js"],
  },
  {
    label: "Backend & APIs",
    items: ["Node.js", "REST APIs", "Next.js API Routes", "Server Actions", "Webhooks", "Resend"],
  },
  {
    label: "Data & AI",
    items: ["PostgreSQL", "Prisma ORM", "Plotly.js", "LLMs", "TensorFlow", "Keras", "PyTorch", "Web Audio API"],
  },
  {
    label: "Commerce & Auth",
    items: ["Shopify Storefront API", "Printful", "Authentication", "Neon Serverless"],
  },
  {
    label: "Infra & Tooling",
    items: ["Vercel", "AWS", "Azure", "GCP", "GitHub Actions", "CI/CD", "Git", "Vite"],
  },
];

export default function Home() {
  const featured = getFeaturedProjects();

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative px-6 pb-8 pt-16 md:pt-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">

          {/* Portrait */}
          <div className="rounded-full border-2 border-gold/40 p-1.5 shadow-[0_0_32px_rgba(197,164,78,0.15)]">
            <Image
              src="/images/dylan-portrait.png"
              alt="Dylan Neal"
              width={120}
              height={120}
              className="h-24 w-24 rounded-full object-cover md:h-28 md:w-28"
              priority
            />
          </div>

          {/* Name */}
          <h1 className="mt-8">
            <span
              className="font-display text-[clamp(3.5rem,8vw,7rem)] font-extralight leading-[1] tracking-[-0.02em] text-surface"
              style={{
                textShadow: "0 0 60px rgba(240, 238, 233, 0.08), 0 0 120px rgba(240, 238, 233, 0.04)",
              }}
            >
              Dylan Neal
            </span>
          </h1>

          {/* Title + location */}
          <div className="mt-4 flex items-center gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold/60">
              Software Engineer
            </p>
            <span className="h-3 w-px bg-surface/15" />
            <p className="font-mono text-[11px] text-surface/30">
              Chicago, IL
            </p>
          </div>

          {/* Tagline */}
          <p className="mt-7 max-w-md text-[15px] leading-[1.8] text-surface/45">
            Full-stack engineer with an M.S. in Software Engineering and a
            background in computer graphics. I build data platforms, browser
            games, WebGL experiences, and commercial web products. Every
            project here includes a case study covering what I built, why,
            and how.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2.5 rounded bg-gold px-7 py-3.5 font-mono text-[13px] font-semibold text-ink transition-all hover:bg-gold-light hover:shadow-[0_0_32px_rgba(197,164,78,0.35)]"
            >
              View Projects
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 font-mono text-[12px] text-surface/40 transition-colors hover:text-gold"
            >
              <Download size={13} />
              Resume
            </Link>
            <a
              href="mailto:dyl.neal@gmail.com"
              className="inline-flex items-center gap-2 font-mono text-[12px] text-surface/40 transition-colors hover:text-gold"
            >
              <Mail size={13} />
              Contact
            </a>
          </div>
        </div>
      </section>

      {/* ── 3D Model accent ──────────────────────────────────────────────── */}
      <section className="relative hidden md:block">
        <div className="mx-auto flex max-w-5xl justify-center px-6 py-4">
          <div className="pointer-events-none h-80 w-80" aria-hidden="true">
            <HeroChip />
          </div>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────────────────────── */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-surface/[0.08] to-transparent" />
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/50">
                Featured Work
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-surface md:text-3xl">
                Selected Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden items-center gap-1.5 font-mono text-[11px] text-surface/40 transition-colors hover:text-gold sm:inline-flex"
            >
              All projects
              <ArrowRight size={11} />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-surface/40 transition-colors hover:text-gold"
            >
              View all projects
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stack ──────────────────────────────────────────────────────────── */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-surface/[0.08] to-transparent" />
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/50">
            Stack
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {skillGroups.map((group) => (
              <div key={group.label}>
                <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-surface/30">
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded border border-surface/[0.06] bg-surface/[0.03] px-2.5 py-1 font-mono text-[11px] text-surface/50"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────────────────── */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-surface/[0.08] to-transparent" />
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-20 text-center md:py-28">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-surface">
            Let&apos;s connect
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-surface/45">
            I&apos;m open to engineering roles, collaborations, and interesting
            conversations.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:dyl.neal@gmail.com"
              className="inline-flex items-center gap-2.5 rounded bg-gold px-6 py-3 font-mono text-[13px] font-medium text-ink transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(197,164,78,0.3)]"
            >
              <Mail size={14} />
              Get in Touch
            </a>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2.5 rounded border border-surface/10 px-6 py-3 font-mono text-[13px] text-surface/60 transition-all hover:border-gold/30 hover:text-gold"
            >
              <Download size={14} />
              Download Resume
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
