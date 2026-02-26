import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-surface/[0.08] to-transparent" />
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 sm:flex-row sm:justify-between">
        <p className="font-mono text-[11px] text-surface/30">
          &copy; {new Date().getFullYear()} Dylan Neal
        </p>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/dylantneal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-surface/30 transition-colors hover:text-gold"
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/dylan-neal-347705213/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-surface/30 transition-colors hover:text-gold"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="mailto:dyl.neal@gmail.com"
            className="text-surface/30 transition-colors hover:text-gold"
            aria-label="Email"
          >
            <Mail size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
