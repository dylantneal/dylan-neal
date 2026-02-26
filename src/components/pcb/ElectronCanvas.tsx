"use client";

import { useEffect, useRef, useCallback } from "react";

interface Point {
  x: number;
  y: number;
}

interface Trace {
  points: Point[];
  totalLength: number;
  segmentLengths: number[];
}

interface Electron {
  traceIndex: number;
  progress: number;
  speed: number;
}

function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function buildTraces(width: number, height: number): Trace[] {
  const traces: Trace[] = [];
  const gridSize = 60;
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);
  const traceCount = Math.floor((cols * rows) / 8);

  for (let i = 0; i < traceCount; i++) {
    const startCol = Math.floor(Math.random() * cols);
    const startRow = Math.floor(Math.random() * rows);
    const segmentCount = 3 + Math.floor(Math.random() * 5);

    const points: Point[] = [
      { x: startCol * gridSize, y: startRow * gridSize },
    ];

    let cx = startCol;
    let cy = startRow;

    for (let s = 0; s < segmentCount; s++) {
      const dir = Math.floor(Math.random() * 4);
      const dist = 1 + Math.floor(Math.random() * 4);

      switch (dir) {
        case 0: cx += dist; break;
        case 1: cy += dist; break;
        case 2: cx -= dist; break;
        case 3: cy -= dist; break;
      }

      cx = Math.max(0, Math.min(cols - 1, cx));
      cy = Math.max(0, Math.min(rows - 1, cy));

      points.push({ x: cx * gridSize, y: cy * gridSize });
    }

    const segmentLengths: number[] = [];
    let totalLength = 0;
    for (let j = 1; j < points.length; j++) {
      const len = distance(points[j - 1], points[j]);
      segmentLengths.push(len);
      totalLength += len;
    }

    if (totalLength > 0) {
      traces.push({ points, totalLength, segmentLengths });
    }
  }

  return traces;
}

function getPositionOnTrace(trace: Trace, progress: number): Point {
  const targetDist = progress * trace.totalLength;
  let accumulated = 0;

  for (let i = 0; i < trace.segmentLengths.length; i++) {
    const segLen = trace.segmentLengths[i];
    if (accumulated + segLen >= targetDist) {
      const t = segLen > 0 ? (targetDist - accumulated) / segLen : 0;
      const a = trace.points[i];
      const b = trace.points[i + 1];
      return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
      };
    }
    accumulated += segLen;
  }

  return trace.points[trace.points.length - 1];
}

const MAX_ELECTRONS = 10;
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

export function ElectronCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tracesRef = useRef<Trace[]>([]);
  const electronsRef = useRef<Electron[]>([]);
  const animRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    tracesRef.current = buildTraces(width, height);

    const electronCount = Math.min(
      MAX_ELECTRONS,
      Math.max(4, Math.floor(tracesRef.current.length / 5))
    );

    electronsRef.current = Array.from({ length: electronCount }, () => ({
      traceIndex: Math.floor(Math.random() * tracesRef.current.length),
      progress: Math.random(),
      speed: 0.0003 + Math.random() * 0.0005,
    }));
  }, []);

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const elapsed = timestamp - lastFrameRef.current;
    if (elapsed < FRAME_INTERVAL) {
      animRef.current = requestAnimationFrame(animate);
      return;
    }
    lastFrameRef.current = timestamp;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const traces = tracesRef.current;
    const electrons = electronsRef.current;

    for (const electron of electrons) {
      if (electron.traceIndex >= traces.length) continue;

      electron.progress += electron.speed;
      if (electron.progress > 1) {
        electron.progress = 0;
        electron.traceIndex = Math.floor(Math.random() * traces.length);
        electron.speed = 0.0003 + Math.random() * 0.0005;
      }

      const trace = traces[electron.traceIndex];
      const pos = getPositionOnTrace(trace, electron.progress);

      // Glow
      const gradient = ctx.createRadialGradient(
        pos.x * dpr, pos.y * dpr, 0,
        pos.x * dpr, pos.y * dpr, 8 * dpr
      );
      gradient.addColorStop(0, "rgba(197, 164, 78, 0.7)");
      gradient.addColorStop(0.5, "rgba(197, 164, 78, 0.15)");
      gradient.addColorStop(1, "rgba(197, 164, 78, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x * dpr, pos.y * dpr, 8 * dpr, 0, Math.PI * 2);
      ctx.fill();

      // Core dot
      ctx.fillStyle = "rgba(232, 212, 139, 0.9)";
      ctx.beginPath();
      ctx.arc(pos.x * dpr, pos.y * dpr, 2 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }

    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    init();
    animRef.current = requestAnimationFrame(animate);

    const handleResize = () => init();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [init, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1]"
      aria-hidden="true"
    />
  );
}
