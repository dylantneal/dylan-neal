"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

export function ProjectGallery({ screenshots }: { screenshots: string[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (screenshots.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {screenshots.map((src, i) => (
          <button
            key={src}
            onClick={() => setLightboxIndex(i)}
            className="group relative aspect-video overflow-hidden rounded-sm border border-board-light/40 bg-board-light/10"
          >
            <Image
              src={src}
              alt={`Screenshot ${i + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute right-4 top-4 text-white/70 hover:text-white"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close lightbox"
          >
            <X size={28} />
          </button>
          <div className="relative h-[80vh] w-full max-w-4xl">
            <Image
              src={screenshots[lightboxIndex]}
              alt={`Screenshot ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
