import type { MDXRemoteProps } from "next-mdx-remote/rsc";

export const mdxComponents: MDXRemoteProps["components"] = {
  h2: (props) => (
    <h2
      className="mt-12 mb-4 font-heading text-2xl font-bold text-surface"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 mb-3 font-heading text-xl font-semibold text-surface"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mb-4 leading-relaxed text-surface/80" {...props} />
  ),
  ul: (props) => (
    <ul className="mb-4 space-y-2 pl-6 text-surface/80" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-4 space-y-2 pl-6 text-surface/80" {...props} />
  ),
  li: (props) => <li className="list-disc leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold text-surface" {...props} />,
  em: (props) => <em className="text-surface/70" {...props} />,
  code: (props) => (
    <code
      className="rounded-sm bg-board-light/30 px-1.5 py-0.5 font-mono text-sm text-gold-light"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mb-4 overflow-x-auto rounded-sm border border-board-light/40 bg-board-light/10 p-4 font-mono text-sm text-surface/80"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-board-light/30" />,
  a: (props) => (
    <a
      className="text-gold underline underline-offset-2 transition-colors hover:text-gold-light"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="mb-4 border-l-2 border-gold/40 pl-4 italic text-surface/60"
      {...props}
    />
  ),
};
