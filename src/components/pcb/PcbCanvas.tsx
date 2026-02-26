"use client";

import { useEffect, useRef, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Point {
  x: number;
  y: number;
}

interface Trace {
  points: Point[];
  width: number;
  layer: "front" | "back";
  totalLength: number;
  segmentLengths: number[];
}

interface Via {
  x: number;
  y: number;
  outer: number;
  inner: number;
}

interface BoardData {
  traces: Trace[];
  vias: Via[];
}

interface Electron {
  traceIndex: number;
  progress: number;
  speed: number;
  brightness: number;
  tailLength: number;
}

// ─── Seeded RNG ─────────────────────────────────────────────────────────────

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Colors ─────────────────────────────────────────────────────────────────

const C = {
  traceFront: "rgba(55, 100, 145, 0.22)",
  traceFrontThick: "rgba(55, 100, 145, 0.32)",
  traceBack: "rgba(40, 70, 110, 0.10)",
  viaRing: "rgba(55, 100, 145, 0.25)",
  viaDrill: "rgba(4, 10, 20, 0.65)",
  noiseColor: "rgba(0, 0, 0, 0.025)",

  electronGlowInner: (a: number) => `rgba(232, 212, 139, ${(0.6 * a).toFixed(3)})`,
  electronGlowMid: (a: number) => `rgba(197, 164, 78, ${(0.2 * a).toFixed(3)})`,
  electronGlowOuter: "rgba(197, 164, 78, 0)",
  electronCore: (a: number) => `rgba(255, 248, 220, ${(0.95 * a).toFixed(3)})`,
  electronTail: (a: number) => `rgba(197, 164, 78, ${a.toFixed(3)})`,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function computeLengths(points: Point[]): { segmentLengths: number[]; totalLength: number } {
  const segmentLengths: number[] = [];
  let totalLength = 0;
  for (let j = 1; j < points.length; j++) {
    const len = Math.hypot(points[j].x - points[j - 1].x, points[j].y - points[j - 1].y);
    segmentLengths.push(len);
    totalLength += len;
  }
  return { segmentLengths, totalLength };
}

function routeHV45(ax: number, ay: number, bx: number, by: number, grid: number): Point[] {
  const dx = bx - ax;
  const dy = by - ay;
  const chamfer = Math.min(Math.abs(dx), Math.abs(dy), grid * 2);

  if (chamfer < grid * 0.5 || Math.abs(dx) < grid || Math.abs(dy) < grid) {
    return [{ x: ax, y: ay }, { x: ax + dx, y: ay }, { x: bx, y: by }];
  }

  const sx = dx > 0 ? 1 : -1;
  const sy = dy > 0 ? 1 : -1;
  return [
    { x: ax, y: ay },
    { x: bx - sx * chamfer, y: ay },
    { x: bx, y: ay + sy * chamfer },
    { x: bx, y: by },
  ];
}

// ─── Board generation (traces + vias only) ──────────────────────────────────

function generateBoard(width: number, height: number): BoardData {
  const rng = mulberry32(42);
  const grid = 28;
  const pageHeight = Math.max(height * 3.5, 5000);

  const traces: Trace[] = [];
  const vias: Via[] = [];

  const addTrace = (points: Point[], w: number, layer: "front" | "back") => {
    const { segmentLengths, totalLength } = computeLengths(points);
    if (totalLength > 20) {
      traces.push({ points, width: w, layer, totalLength, segmentLengths });
    }
  };

  // ── Horizontal bus traces with multiple jogs ──
  const hBusCount = Math.floor(pageHeight / 90);
  for (let i = 0; i < hBusCount; i++) {
    const y = Math.round(((i + 0.5) * pageHeight) / hBusCount / grid) * grid;
    const startX = Math.round((rng() * width * 0.1) / grid) * grid;
    const endX = Math.round((width * (0.9 + rng() * 0.1)) / grid) * grid;

    // Build a horizontal trace with 2-4 jogs along its length
    const jogCount = 2 + Math.floor(rng() * 3);
    const pts: Point[] = [{ x: startX, y }];
    let curY = y;
    for (let j = 0; j < jogCount; j++) {
      const frac = (j + 1) / (jogCount + 1);
      const jogX = startX + (endX - startX) * (frac + (rng() - 0.5) * 0.1);
      const jogDy = (rng() > 0.5 ? 1 : -1) * grid * (1 + Math.floor(rng() * 2));
      pts.push({ x: jogX - grid, y: curY });
      pts.push({ x: jogX, y: curY + jogDy });
      curY = curY + jogDy;
      pts.push({ x: jogX + grid, y: curY });
    }
    pts.push({ x: endX, y: curY });
    addTrace(pts, 0.8 + rng() * 0.4, "front");

    // Companion trace
    if (rng() > 0.5) {
      const offset = grid * (1 + Math.floor(rng() * 2));
      const cPts: Point[] = [{ x: startX + grid * 2, y: y + offset }];
      let cY = y + offset;
      for (let j = 0; j < jogCount - 1; j++) {
        const frac = (j + 1) / jogCount;
        const jx = startX + (endX - startX) * (frac + (rng() - 0.5) * 0.1);
        const jdy = (rng() > 0.5 ? 1 : -1) * grid;
        cPts.push({ x: jx - grid, y: cY });
        cPts.push({ x: jx, y: cY + jdy });
        cY += jdy;
        cPts.push({ x: jx + grid, y: cY });
      }
      cPts.push({ x: endX - grid * 2, y: cY });
      addTrace(cPts, 0.5 + rng() * 0.3, "front");
    }
  }

  // ── Vertical bus traces with jogs ──
  const vBusCount = Math.floor(width / 100);
  for (let i = 0; i < vBusCount; i++) {
    const x = Math.round(((i + 0.5) * width) / vBusCount / grid) * grid;
    const startY = Math.round((rng() * 50) / grid) * grid;
    const endY = Math.round((pageHeight - rng() * 50) / grid) * grid;

    const jogCount = 2 + Math.floor(rng() * 3);
    const pts: Point[] = [{ x, y: startY }];
    let curX = x;
    for (let j = 0; j < jogCount; j++) {
      const frac = (j + 1) / (jogCount + 1);
      const jogY = startY + (endY - startY) * (frac + (rng() - 0.5) * 0.08);
      const jogDx = (rng() > 0.5 ? 1 : -1) * grid * (1 + Math.floor(rng() * 2));
      pts.push({ x: curX, y: jogY - grid });
      pts.push({ x: curX + jogDx, y: jogY });
      curX += jogDx;
      pts.push({ x: curX, y: jogY + grid });
    }
    pts.push({ x: curX, y: endY });
    addTrace(pts, 0.7 + rng() * 0.4, "front");

    // Companion
    if (rng() > 0.6) {
      const offset = grid * (1 + Math.floor(rng() * 2));
      addTrace(
        [{ x: x + offset, y: startY + grid * 3 }, { x: x + offset, y: endY - grid * 3 }],
        0.5 + rng() * 0.3,
        "front"
      );
    }
  }

  // ── Signal traces: more waypoints, more turns ──
  const signalCount = Math.floor((width * pageHeight) / 12000);
  for (let i = 0; i < signalCount; i++) {
    const ax = Math.round((rng() * width) / grid) * grid;
    const ay = Math.round((rng() * pageHeight) / grid) * grid;
    const layer: "front" | "back" = rng() > 0.45 ? "back" : "front";
    const w = layer === "back" ? 0.5 : 0.7 + rng() * 0.3;

    const waypoints = 4 + Math.floor(rng() * 5);
    let cx = ax;
    let cy = ay;
    const allPoints: Point[] = [{ x: cx, y: cy }];

    for (let w2 = 0; w2 < waypoints; w2++) {
      const isH = rng() > 0.5;
      const dist = grid * (1 + Math.floor(rng() * 4));
      const dir = rng() > 0.5 ? 1 : -1;

      let nx = cx;
      let ny = cy;
      if (isH) { nx = cx + dist * dir; } else { ny = cy + dist * dir; }
      nx = Math.max(grid, Math.min(width - grid, nx));
      ny = Math.max(grid, Math.min(pageHeight - grid, ny));

      const routed = routeHV45(cx, cy, nx, ny, grid);
      for (let r = 1; r < routed.length; r++) allPoints.push(routed[r]);
      cx = nx;
      cy = ny;
    }

    addTrace(allPoints, w, layer);

    // Place a via at trace endpoints
    if (rng() > 0.7) {
      vias.push({ x: cx, y: cy, outer: 3.5, inner: 1.3 });
    }
    if (rng() > 0.85) {
      vias.push({ x: ax, y: ay, outer: 3.5, inner: 1.3 });
    }
  }

  // ── Scattered junction vias ──
  const extraVias = Math.floor((width * pageHeight) / 35000);
  for (let i = 0; i < extraVias; i++) {
    vias.push({
      x: Math.round((rng() * width) / grid) * grid,
      y: Math.round((rng() * pageHeight) / grid) * grid,
      outer: 2.8 + rng() * 1.5,
      inner: 1 + rng() * 0.6,
    });
  }

  return { traces, vias };
}

// ─── Board rendering ────────────────────────────────────────────────────────

function renderBoard(
  ctx: CanvasRenderingContext2D,
  board: BoardData,
  dpr: number,
  canvasW: number,
  canvasH: number,
  scrollY: number
) {
  ctx.clearRect(0, 0, canvasW, canvasH);

  // Subtle noise texture
  ctx.save();
  for (let y = 0; y < canvasH; y += 3 * dpr) {
    for (let x = 0; x < canvasW; x += 3 * dpr) {
      if (((x * 7 + y * 13) % 23) < 2) {
        ctx.fillStyle = C.noiseColor;
        ctx.fillRect(x, y, 1.5 * dpr, 1.5 * dpr);
      }
    }
  }
  ctx.restore();

  // Vignette
  const vig = ctx.createRadialGradient(
    canvasW / 2, canvasH / 2, canvasW * 0.15,
    canvasW / 2, canvasH / 2, canvasW * 0.85
  );
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.25)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, canvasW, canvasH);

  const oY = -scrollY * dpr;

  // Back copper
  ctx.save();
  ctx.strokeStyle = C.traceBack;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const t of board.traces) {
    if (t.layer !== "back") continue;
    ctx.lineWidth = t.width * dpr * 0.7;
    ctx.beginPath();
    ctx.moveTo(t.points[0].x * dpr, t.points[0].y * dpr + oY);
    for (let i = 1; i < t.points.length; i++) {
      ctx.lineTo(t.points[i].x * dpr, t.points[i].y * dpr + oY);
    }
    ctx.stroke();
  }
  ctx.restore();

  // Front copper
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const t of board.traces) {
    if (t.layer !== "front") continue;
    ctx.lineWidth = t.width * dpr;
    ctx.strokeStyle = t.width > 1.0 ? C.traceFrontThick : C.traceFront;
    ctx.beginPath();
    ctx.moveTo(t.points[0].x * dpr, t.points[0].y * dpr + oY);
    for (let i = 1; i < t.points.length; i++) {
      ctx.lineTo(t.points[i].x * dpr, t.points[i].y * dpr + oY);
    }
    ctx.stroke();
  }
  ctx.restore();

  // Vias
  for (const v of board.vias) {
    const vx = v.x * dpr;
    const vy = v.y * dpr + oY;
    ctx.beginPath();
    ctx.arc(vx, vy, v.outer * dpr, 0, Math.PI * 2);
    ctx.fillStyle = C.viaRing;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(vx, vy, v.inner * dpr, 0, Math.PI * 2);
    ctx.fillStyle = C.viaDrill;
    ctx.fill();
  }
}

// ─── Electron system ────────────────────────────────────────────────────────

function getPositionOnTrace(trace: Trace, progress: number): Point {
  const targetDist = progress * trace.totalLength;
  let accumulated = 0;
  for (let i = 0; i < trace.segmentLengths.length; i++) {
    const segLen = trace.segmentLengths[i];
    if (accumulated + segLen >= targetDist) {
      const t = segLen > 0 ? (targetDist - accumulated) / segLen : 0;
      const a = trace.points[i];
      const b = trace.points[i + 1];
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
    accumulated += segLen;
  }
  return trace.points[trace.points.length - 1];
}

function createElectrons(traces: Trace[], rng: () => number, count: number): Electron[] {
  const eligible = traces
    .map((t, i) => ({ t, i }))
    .filter((x) => x.t.layer === "front" && x.t.totalLength > 60);
  if (eligible.length === 0) return [];

  return Array.from({ length: count }, () => {
    const pick = eligible[Math.floor(rng() * eligible.length)];
    return {
      traceIndex: pick.i,
      progress: rng(),
      speed: 0.002 + rng() * 0.005,
      brightness: 0.3 + rng() * 0.7,
      tailLength: 0.01 + rng() * 0.04,
    };
  });
}

function renderElectrons(
  ctx: CanvasRenderingContext2D,
  board: BoardData,
  electrons: Electron[],
  dpr: number,
  scrollY: number,
  rng: () => number
) {
  const oY = -scrollY * dpr;
  const eligible = board.traces
    .map((t, i) => ({ t, i }))
    .filter((x) => x.t.layer === "front" && x.t.totalLength > 60);

  for (const e of electrons) {
    if (e.traceIndex >= board.traces.length) continue;
    const trace = board.traces[e.traceIndex];

    e.progress += e.speed;
    if (e.progress > 1) {
      e.progress = 0;
      if (eligible.length > 0) {
        e.traceIndex = eligible[Math.floor(rng() * eligible.length)].i;
      }
      e.speed = 0.002 + rng() * 0.005;
      e.brightness = 0.3 + rng() * 0.7;
    }

    const pos = getPositionOnTrace(trace, e.progress);
    const px = pos.x * dpr;
    const py = pos.y * dpr + oY;

    // Tail
    const tailSteps = 6;
    for (let t = tailSteps; t >= 1; t--) {
      const tp = Math.max(0, e.progress - (e.tailLength * t) / tailSteps);
      const tpos = getPositionOnTrace(trace, tp);
      const alpha = (1 - t / tailSteps) * 0.15 * e.brightness;
      ctx.beginPath();
      ctx.arc(tpos.x * dpr, tpos.y * dpr + oY, 2.5 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = C.electronTail(alpha);
      ctx.fill();
    }

    // Glow
    const grad = ctx.createRadialGradient(px, py, 0, px, py, 16 * dpr);
    grad.addColorStop(0, C.electronGlowInner(e.brightness));
    grad.addColorStop(0.3, C.electronGlowMid(e.brightness));
    grad.addColorStop(1, C.electronGlowOuter);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, 16 * dpr, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.beginPath();
    ctx.arc(px, py, 1.8 * dpr, 0, Math.PI * 2);
    ctx.fillStyle = C.electronCore(e.brightness);
    ctx.fill();
  }
}

// ─── Main component ─────────────────────────────────────────────────────────

const TARGET_FPS = 60;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const ELECTRON_COUNT = 100;

export function PcbCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<BoardData | null>(null);
  const electronsRef = useRef<Electron[]>([]);
  const animRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const rngRef = useRef(mulberry32(777));
  const scrollRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const lastWidthRef = useRef(0);

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
    sizeRef.current = { w: width * dpr, h: height * dpr };

    if (!boardRef.current || Math.abs(width - lastWidthRef.current) > 50) {
      lastWidthRef.current = width;
      boardRef.current = generateBoard(width, height);
      const seedRng = mulberry32(42);
      electronsRef.current = createElectrons(
        boardRef.current.traces,
        seedRng,
        ELECTRON_COUNT
      );
      rngRef.current = mulberry32(777);
    }
  }, []);

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const board = boardRef.current;
    if (!canvas || !board) {
      animRef.current = requestAnimationFrame(animate);
      return;
    }

    const elapsed = timestamp - lastFrameRef.current;
    if (elapsed < FRAME_INTERVAL) {
      animRef.current = requestAnimationFrame(animate);
      return;
    }
    lastFrameRef.current = timestamp;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { w, h } = sizeRef.current;

    renderBoard(ctx, board, dpr, w, h, scrollRef.current);
    renderElectrons(ctx, board, electronsRef.current, dpr, scrollRef.current, rngRef.current);

    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    init();

    if (!prefersReduced) {
      animRef.current = requestAnimationFrame(animate);
    } else {
      const canvas = canvasRef.current;
      const board = boardRef.current;
      if (canvas && board) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const dpr = window.devicePixelRatio || 1;
          renderBoard(ctx, board, dpr, sizeRef.current.w, sizeRef.current.h, 0);
        }
      }
    }

    const handleResize = () => {
      boardRef.current = null;
      init();
    };
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [init, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
