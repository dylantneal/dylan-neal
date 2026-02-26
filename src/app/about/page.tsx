import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Dylan Neal — software engineer building interactive systems, data products, and creative tools.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      <h1 className="font-heading text-3xl font-bold text-surface md:text-4xl">
        About
      </h1>

      <div className="mt-8 space-y-5 text-surface/80 leading-relaxed">
        <p>
          I&apos;m a full-stack software engineer based in Chicago. I hold an
          M.S. in Software Engineering from DePaul University (2025) and a B.F.A.
          with Honors from the School of the Art Institute of Chicago (2018),
          where I concentrated in computer graphics and web design. That
          combination shapes everything I build: technically rigorous work that
          doesn&apos;t treat design as an afterthought.
        </p>
        <p>
          My core stack is TypeScript, React, Next.js, and PostgreSQL, though
          I&apos;ve built production software in Python, C++, and Swift as well.
          I&apos;ve worked across the full product lifecycle: API design and
          data pipelines at Intel 471, end-to-end platform ownership at Clarity
          Lab, and a range of self-directed projects that span browser games,
          WebGL experiences, and full e-commerce builds.
        </p>
        <p>
          The projects on this site reflect the breadth of that work. Clarity
          Lab is a data research platform with nine interactive research domains
          and a custom Canvas particle system. AlienInvaders is a fully custom
          game engine with boss fights, destructible shields, and a dual-loop
          architecture. HadeanEon is a WebGL browser experience driven by custom
          GLSL shaders and real-time audio analysis. Of Blood is a full
          commercial product with a global persistent audio player, per-track
          immersive experiences, and a live Shopify and Printful e-commerce
          pipeline.
        </p>
        <p>
          Outside of software, I like to explore Chicago, play with my dog, and oil paint. Working on that project gave me a genuine appreciation for
          what it means to ship a product under real commercial constraints with
          a very specific aesthetic vision. It also produced one of the more
          technically interesting projects in this portfolio.
        </p>
        <p>
          I&apos;m currently open to full-stack engineering roles where I can
          own meaningful problems with people who care about craft.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-sm bg-gold px-5 py-2.5 font-mono text-sm font-medium text-ink transition-colors hover:bg-gold-light"
        >
          View my work
          <ArrowRight size={14} />
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-sm border border-surface/20 px-5 py-2.5 font-mono text-sm text-surface/70 transition-colors hover:border-gold/40 hover:text-gold"
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
}
