"use client";

import { useEffect, useRef, useCallback } from "react";

interface Point {
  x: number;
  y: number;
}

interface Trace {
  points: Point[];
}

function generateTraces(width: number, height: number): Trace[] {
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
        case 0: cx += dist; break; // right
        case 1: cy += dist; break; // down
        case 2: cx -= dist; break; // left
        case 3: cy -= dist; break; // up
      }

      cx = Math.max(0, Math.min(cols - 1, cx));
      cy = Math.max(0, Math.min(rows - 1, cy));

      points.push({ x: cx * gridSize, y: cy * gridSize });
    }

    traces.push({ points });
  }

  return traces;
}

function drawTraces(
  ctx: CanvasRenderingContext2D,
  traces: Trace[],
  dpr: number
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.strokeStyle = "rgba(26, 92, 26, 0.35)";
  ctx.lineWidth = 1.5 * dpr;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const trace of traces) {
    if (trace.points.length < 2) continue;
    ctx.beginPath();
    ctx.moveTo(trace.points[0].x * dpr, trace.points[0].y * dpr);
    for (let i = 1; i < trace.points.length; i++) {
      ctx.lineTo(trace.points[i].x * dpr, trace.points[i].y * dpr);
    }
    ctx.stroke();
  }

  // Draw via pads at intersections
  ctx.fillStyle = "rgba(26, 92, 26, 0.2)";
  for (const trace of traces) {
    for (const point of trace.points) {
      ctx.beginPath();
      ctx.arc(point.x * dpr, point.y * dpr, 3 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function TraceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tracesRef = useRef<Trace[]>([]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    tracesRef.current = generateTraces(width, height);
    drawTraces(ctx, tracesRef.current, dpr);
  }, []);

  useEffect(() => {
    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}

export { type Trace, type Point };
