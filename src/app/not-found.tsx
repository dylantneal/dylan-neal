import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-6xl font-bold text-gold/30">404</p>
      <h1 className="mt-4 font-heading text-2xl font-bold text-surface">
        Page not found
      </h1>
      <p className="mt-2 text-surface/60">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-sm bg-gold px-5 py-2.5 font-mono text-sm font-medium text-ink transition-colors hover:bg-gold-light"
      >
        <ArrowLeft size={14} />
        Back to Home
      </Link>
    </div>
  );
}
