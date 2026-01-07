import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { settings, performanceMode } from '../../store';
import { NETWORK_COLORS } from '../../constants/colors';

/**
 * SpatialGrid Class
 * 
 * Optimizes neighbor detection from O(n²) to O(n) by partitioning space into cells.
 * Each node only checks neighbors in its cell and adjacent cells.
 */
// --- CUSTOM CANVAS BACKGROUND (Network Data Traffic) ---

class NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulseSpeed: number;
  neighbors: NetworkNode[] = [];
  index: number;

  constructor(w: number, h: number, index: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;

    const speed = 0.08;
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.radius = 1 + Math.random() * 1.5;

    // sin-wave opacity
    this.opacity = 0.3;
    this.pulseSpeed = 0.002 + Math.random() * 0.003;

    this.index = index;
  }

  update(w: number, h: number, time: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > w) this.vx = -this.vx;
    if (this.y < 0 || this.y > h) this.vy = -this.vy;

    // MUCH smoother than random target opacity
    this.opacity = 0.35 + Math.sin(time * this.pulseSpeed) * 0.25;
  }
}

//
// ─────────────────────────────────────────────────────
//   DataPacket
// ─────────────────────────────────────────────────────
//

class DataPacket {
  from: NetworkNode;
  to: NetworkNode;
  progress = 0;
  speed: number;

  constructor(start: NetworkNode, end: NetworkNode) {
    this.from = start;
    this.to = end;
    this.speed = 0.01 + Math.random() * 0.006;
  }

  update() {
    this.progress += this.speed;
    return this.progress < 1;
  }

  // Glow batch (globalAlpha = 0.25)
  drawGlow(ctx: CanvasRenderingContext2D) {
    const x = this.from.x + (this.to.x - this.from.x) * this.progress;
    const y = this.from.y + (this.to.y - this.from.y) * this.progress;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Core batch (globalAlpha = 1)
  drawCore(ctx: CanvasRenderingContext2D) {
    const x = this.from.x + (this.to.x - this.from.x) * this.progress;
    const y = this.from.y + (this.to.y - this.from.y) * this.progress;

    ctx.beginPath();
    ctx.arc(x, y, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

//
// ─────────────────────────────────────────────────────
//   Spatial Grid (Ultra-Fast)
// ─────────────────────────────────────────────────────
//

class SpatialGrid {
  cellSize: number;
  cols: number;
  rows: number;
  grid: NetworkNode[][];

  constructor(w: number, h: number, cellSize: number) {
    this.cellSize = cellSize;
    this.cols = Math.ceil(w / cellSize);
    this.rows = Math.ceil(h / cellSize);
    this.grid = new Array(this.cols * this.rows);
    this.clear();
  }

  clear() {
    for (let i = 0; i < this.grid.length; i++) this.grid[i] = [];
  }

  insert(node: NetworkNode) {
    const col = (node.x / this.cellSize) | 0;
    const row = (node.y / this.cellSize) | 0;
    const idx = row * this.cols + col;
    this.grid[idx].push(node);
  }

  getNearby(n: NetworkNode): NetworkNode[] {
    const col = (n.x / this.cellSize) | 0;
    const row = (n.y / this.cellSize) | 0;

    const res: NetworkNode[] = [];

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nc = col + dx;
        const nr = row + dy;
        if (nc < 0 || nr < 0 || nc >= this.cols || nr >= this.rows) continue;

        const idx = nr * this.cols + nc;
        const cell = this.grid[idx];
        if (cell.length) res.push(...cell);
      }
    }

    return res;
  }
}

//
// ─────────────────────────────────────────────────────
//   Canvas Component
// ─────────────────────────────────────────────────────
//

export const CanvasBackground = () => {
  const { theme } = useStore(settings);
  const { lite } = useStore(performanceMode);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const nodesRef = useRef<NetworkNode[]>([]);
  const packetsRef = useRef<DataPacket[]>([]);
  const linksRef = useRef<{ a: NetworkNode; b: NetworkNode }[]>([]);
  const gridRef = useRef<SpatialGrid | null>(null);

  const [noiseDataUrl, setNoiseDataUrl] = useState("");

  const colorsRef = useRef({
    nodeColor: theme === "dark" ? NETWORK_COLORS.dark.nodeColor : NETWORK_COLORS.light.nodeColor,
    lineColor: theme === "dark" ? NETWORK_COLORS.dark.lineColor : NETWORK_COLORS.light.lineColor,
    packetColor: theme === "dark" ? NETWORK_COLORS.dark.packetColor : NETWORK_COLORS.light.packetColor
  });

  const configRef = useRef({ w: 0, h: 0, isDark: false });

  //
  // NOISE BACKGROUND
  //
  useEffect(() => {
    if (lite) return;

    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;

    const ctx = c.getContext("2d");
    if (ctx) {
      const id = ctx.createImageData(128, 128);
      const buf = new Uint32Array(id.data.buffer);

      for (let i = 0; i < buf.length; i++) {
        buf[i] = Math.random() < 0.5 ? 0x08000000 : 0;
      }
      ctx.putImageData(id, 0, 0);
      setNoiseDataUrl(c.toDataURL());
    }
  }, []);

  //
  // THEME CHANGES → COLOR UPDATE
  //
  useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    colorsRef.current = {
      nodeColor: isDark ? NETWORK_COLORS.dark.nodeColor : NETWORK_COLORS.light.nodeColor,
      lineColor: isDark ? NETWORK_COLORS.dark.lineColor : NETWORK_COLORS.light.lineColor,
      packetColor: isDark ? NETWORK_COLORS.dark.packetColor : NETWORK_COLORS.light.packetColor
    };

    configRef.current.isDark = isDark;
  }, [theme]);

  //
  // LISTEN TO SYSTEM THEME CHANGES (when theme === 'system')
  //
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const isDark = mediaQuery.matches;

      colorsRef.current = {
        nodeColor: isDark ? NETWORK_COLORS.dark.nodeColor : NETWORK_COLORS.light.nodeColor,
        lineColor: isDark ? NETWORK_COLORS.dark.lineColor : NETWORK_COLORS.light.lineColor,
        packetColor: isDark ? NETWORK_COLORS.dark.packetColor : NETWORK_COLORS.light.packetColor
      };

      configRef.current.isDark = isDark;
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  //
  // MAIN EFFECT (Rendering Loop)
  //
  useEffect(() => {
    if (lite) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true
    });
    if (!ctx) return;

    //
    // INIT CANVAS + GRID + NODES
    //
    const init = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.scale(dpr, dpr);

      configRef.current.w = w;
      configRef.current.h = h;

      const area = w * h;

      let count = Math.min(Math.floor(area / 4000), 300);
      count = Math.max(count, 80);

      nodesRef.current = [];
      packetsRef.current = [];
      linksRef.current = [];

      const maxDist = 120;
      gridRef.current = new SpatialGrid(w, h, maxDist);

      for (let i = 0; i < count; i++) {
        nodesRef.current.push(new NetworkNode(w, h, i));
      }
    };

    init();

    let lastFrame = 0;
    let lastTopoUpdate = 0;

    const fpsInterval = 1000 / 60;
    const topoInterval = 300;

    //
    // DRAW LOOP
    //
    const draw = (time: number) => {
      requestAnimationFrame(draw);

      const elapsed = time - lastFrame;
      if (elapsed < fpsInterval) return;

      lastFrame = time - (elapsed % fpsInterval);

      const { w, h, isDark } = configRef.current;

      //
      // CLEAR
      //
      ctx.fillStyle = isDark ? NETWORK_COLORS.dark.canvasBg : NETWORK_COLORS.light.canvasBg;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      const nodes = nodesRef.current;
      const nodeCount = nodes.length;

      //
      // UPDATE NODES
      //
      for (let i = 0; i < nodeCount; i++) {
        nodes[i].update(w, h, time);
      }

      //
      // UPDATE TOPOLOGY (every 300 ms)
      //
      const grid = gridRef.current;
      if (grid && time - lastTopoUpdate > topoInterval) {
        lastTopoUpdate = time;
        linksRef.current = [];

        grid.clear();

        for (let i = 0; i < nodeCount; i++) {
          nodes[i].neighbors = [];
          grid.insert(nodes[i]);
        }

        const maxDist = 120;
        const maxDistSq = maxDist * maxDist;
        const maxConn = 6;

        const connCount = new Int8Array(nodeCount);

        for (let i = 0; i < nodeCount; i++) {
          if (connCount[i] >= maxConn) continue;

          const a = nodes[i];
          const nearby = grid.getNearby(a);

          for (let b of nearby) {
            if (a === b) continue;

            const j = b.index;
            if (j <= i) continue;
            if (connCount[j] >= maxConn) continue;

            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;

            if (d2 < maxDistSq) {
              linksRef.current.push({ a, b });
              a.neighbors.push(b);
              b.neighbors.push(a);
              connCount[i]++;
              connCount[j]++;
              if (connCount[i] >= maxConn) break;
            }
          }
        }
      }

      //
      // DRAW LINKS
      //
      const links = linksRef.current;
      ctx.strokeStyle = colorsRef.current.lineColor;
      ctx.lineWidth = 1;

      ctx.beginPath();
      for (const l of links) {
        ctx.moveTo(l.a.x, l.a.y);
        ctx.lineTo(l.b.x, l.b.y);
      }
      ctx.stroke();

      //
      // DRAW NODES
      //
      for (const n of nodes) {
        ctx.fillStyle = colorsRef.current.nodeColor + n.opacity + ")";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      //
      // PACKETS UPDATE
      //
      const packets = packetsRef.current;

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        if (!p.update()) {
          const cur = p.to;

          if (cur.neighbors.length && Math.random() < 0.25) {
            const next =
              cur.neighbors[(Math.random() * cur.neighbors.length) | 0];
            packets.push(new DataPacket(cur, next));
          }
          packets.splice(i, 1);
        }
      }

      //
      // SPAWN PACKETS
      //
      const maxPackets = Math.min(nodeCount * 0.5, 200);
      if (packets.length < maxPackets && Math.random() < 0.35) {
        const n = nodes[(Math.random() * nodeCount) | 0];
        if (n.neighbors.length) {
          const t =
            n.neighbors[(Math.random() * n.neighbors.length) | 0];
          packets.push(new DataPacket(n, t));
        }
      }

      //
      // DRAW PACKETS (BATCHED)
      //

      // Glow (globalAlpha = 0.25)
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = colorsRef.current.packetColor;
      for (const p of packets) p.drawGlow(ctx);

      // Core
      ctx.globalAlpha = 1;
      ctx.fillStyle = colorsRef.current.packetColor;
      for (const p of packets) p.drawCore(ctx);
    };

    requestAnimationFrame(draw);

    const resize = () => {
      setTimeout(init, 200);
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [lite]);

  //
  // LITE MODE - Optimized: Pure CSS, no React logic
  //
  if (lite) {
    return (
      <div
        className="fixed inset-0 pointer-events-none lite-background"
        style={{
          background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
          willChange: 'auto'
        }}
      />
    );
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-60 dark:opacity-100"
      />

      {noiseDataUrl && (
        <div
          className="fixed top-0 left-0 w-full h-full pointer-events-none bg-noise"
          style={{ backgroundImage: `url(${noiseDataUrl})` }}
        />
      )}
    </>
  );
};
