"use client";

import dynamic from "next/dynamic";

const PcbCanvas = dynamic(
  () => import("./PcbCanvas").then((mod) => ({ default: mod.PcbCanvas })),
  { ssr: false }
);

export function PcbBackground() {
  return <PcbCanvas />;
}
