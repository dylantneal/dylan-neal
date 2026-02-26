import { Mail, Github, Linkedin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Dylan Neal.",
};

const links = [
  {
    label: "Email",
    href: "mailto:dyl.neal@gmail.com",
    icon: Mail,
    description: "dyl.neal@gmail.com",
  },
  {
    label: "GitHub",
    href: "https://github.com/dylantneal",
    icon: Github,
    description: "github.com/dylantneal",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dylan-neal-347705213/",
    icon: Linkedin,
    description: "linkedin.com/in/dylan-neal-347705213",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      <h1 className="font-heading text-3xl font-bold text-surface md:text-4xl">
        Contact
      </h1>
      <p className="mt-3 text-surface/60">
        I&apos;m open to engineering roles, collaborations, and interesting
        conversations. The best way to reach me is email.
      </p>

      <div className="mt-10 space-y-4">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("mailto") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
            className="flex items-center gap-4 rounded-sm border border-board-light/30 bg-surface/5 px-5 py-4 transition-all hover:border-gold/40 hover:bg-surface/10"
          >
            <link.icon size={20} className="shrink-0 text-gold" />
            <div>
              <p className="font-heading text-sm font-semibold text-surface">
                {link.label}
              </p>
              <p className="font-mono text-xs text-surface/50">
                {link.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
