"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const ModelScene = dynamic(() => import("./HeroChipScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
});

export function HeroChip() {
  return (
    <div className="h-full w-full">
      <ErrorBoundary fallback={<div className="h-full w-full" />}>
        <ModelScene />
      </ErrorBoundary>
    </div>
  );
}
