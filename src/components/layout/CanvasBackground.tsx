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
    this.radius = 1 + Math.random() * 1.5;

    const speed = 4 + Math.random() * 2.5;
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    // sin-wave opacity
    this.opacity = 0.3;
    this.pulseSpeed = 0.002 + Math.random() * 0.003;

    this.index = index;
  }

  update(w: number, h: number, time: number, deltaSeconds: number) {
    this.x += this.vx * deltaSeconds;
    this.y += this.vy * deltaSeconds;

    if (this.x < this.radius) {
      this.x = this.radius;
      this.vx = Math.abs(this.vx);
    } else if (this.x > w - this.radius) {
      this.x = w - this.radius;
      this.vx = -Math.abs(this.vx);
    }

    if (this.y < this.radius) {
      this.y = this.radius;
      this.vy = Math.abs(this.vy);
    } else if (this.y > h - this.radius) {
      this.y = h - this.radius;
      this.vy = -Math.abs(this.vy);
    }

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
    this.speed = 0.6 + Math.random() * 0.36;
  }

  update(deltaSeconds: number) {
    this.progress += this.speed * deltaSeconds;
    return this.progress < 1;
  }

  // Glow batch
  drawGlow(ctx: CanvasRenderingContext2D) {
    const x = this.from.x + (this.to.x - this.from.x) * this.progress;
    const y = this.from.y + (this.to.y - this.from.y) * this.progress;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Core batch
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
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i]) {
        this.grid[i].length = 0;
      } else {
        this.grid[i] = [];
      }
    }
  }

  insert(node: NetworkNode) {
    const col = (node.x / this.cellSize) | 0;
    const row = (node.y / this.cellSize) | 0;
    const idx = row * this.cols + col;
    this.grid[idx].push(node);
  }

  getNearby(n: NetworkNode, out: NetworkNode[]): NetworkNode[] {
    const col = (n.x / this.cellSize) | 0;
    const row = (n.y / this.cellSize) | 0;
    out.length = 0;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nc = col + dx;
        const nr = row + dy;
        if (nc < 0 || nr < 0 || nc >= this.cols || nr >= this.rows) continue;

        const idx = nr * this.cols + nc;
        const cell = this.grid[idx];
        if (!cell.length) continue;

        for (let i = 0; i < cell.length; i++) {
          out.push(cell[i]);
        }
      }
    }

    return out;
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
  const nearbyBufferRef = useRef<NetworkNode[]>([]);
  const connectionCountsRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const resizeTimeoutRef = useRef<number | null>(null);

  const [noiseDataUrl, setNoiseDataUrl] = useState("");

  const colorsRef = useRef({
    nodeColor: theme === "dark" ? NETWORK_COLORS.dark.nodeColor : NETWORK_COLORS.light.nodeColor,
    lineColor: theme === "dark" ? NETWORK_COLORS.dark.lineColor : NETWORK_COLORS.light.lineColor,
    packetColor: theme === "dark" ? NETWORK_COLORS.dark.packetColor : NETWORK_COLORS.light.packetColor,
    packetGlow: theme === "dark" ? NETWORK_COLORS.dark.packetGlow : NETWORK_COLORS.light.packetGlow
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
      packetColor: isDark ? NETWORK_COLORS.dark.packetColor : NETWORK_COLORS.light.packetColor,
      packetGlow: isDark ? NETWORK_COLORS.dark.packetGlow : NETWORK_COLORS.light.packetGlow
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
        packetColor: isDark ? NETWORK_COLORS.dark.packetColor : NETWORK_COLORS.light.packetColor,
        packetGlow: isDark ? NETWORK_COLORS.dark.packetGlow : NETWORK_COLORS.light.packetGlow
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

    let maxDist = 120;

    //
    // INIT CANVAS + GRID + NODES
    //
    const init = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = w < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 1.5);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      configRef.current.w = w;
      configRef.current.h = h;

      const area = w * h;

      // Slightly lower density keeps animation smoother on mid-tier devices.
      let count = Math.min(Math.floor(area / (isMobile ? 9500 : 5200)), isMobile ? 110 : 260);
      count = Math.max(count, isMobile ? 32 : 60);

      nodesRef.current = [];
      packetsRef.current = [];
      linksRef.current = [];
      nearbyBufferRef.current.length = 0;
      connectionCountsRef.current = new Uint8Array(count);

      maxDist = isMobile ? 110 : 120;
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
      animationFrameRef.current = requestAnimationFrame(draw);

      if (!lastFrame) {
        lastFrame = time;
      }

      const elapsed = time - lastFrame;
      if (elapsed < fpsInterval) return;

      const deltaMs = Math.min(elapsed, 32);
      const deltaSeconds = deltaMs / 1000;
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
        nodes[i].update(w, h, time, deltaSeconds);
      }

      //
      // UPDATE TOPOLOGY (every 300 ms)
      //
      const grid = gridRef.current;
      const connectionCounts = connectionCountsRef.current;
      const nearbyBuffer = nearbyBufferRef.current;

      if (grid && connectionCounts && time - lastTopoUpdate > topoInterval) {
        lastTopoUpdate = time;
        linksRef.current.length = 0;

        grid.clear();
        connectionCounts.fill(0);

        for (let i = 0; i < nodeCount; i++) {
          nodes[i].neighbors.length = 0;
          grid.insert(nodes[i]);
        }

        const maxDistSq = maxDist * maxDist;
        const maxConn = 6;

        for (let i = 0; i < nodeCount; i++) {
          if (connectionCounts[i] >= maxConn) continue;

          const a = nodes[i];
          const nearby = grid.getNearby(a, nearbyBuffer);

          for (let k = 0; k < nearby.length; k++) {
            const b = nearby[k];
            if (a === b) continue;

            const j = b.index;
            if (j <= i) continue;
            if (connectionCounts[j] >= maxConn) continue;

            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;

            if (d2 < maxDistSq) {
              linksRef.current.push({ a, b });
              a.neighbors.push(b);
              b.neighbors.push(a);
              connectionCounts[i]++;
              connectionCounts[j]++;
              if (connectionCounts[i] >= maxConn) break;
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
      ctx.fillStyle = colorsRef.current.nodeColor;
      for (const n of nodes) {
        ctx.globalAlpha = n.opacity;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      //
      // PACKETS UPDATE
      //
      const packets = packetsRef.current;

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        if (!p.update(deltaSeconds)) {
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
      const spawnChance = Math.min(0.35 * (deltaMs / fpsInterval), 0.75);
      if (packets.length < maxPackets && Math.random() < spawnChance) {
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

      ctx.fillStyle = colorsRef.current.packetGlow;
      for (const p of packets) p.drawGlow(ctx);

      // Core
      ctx.fillStyle = colorsRef.current.packetColor;
      for (const p of packets) p.drawCore(ctx);
    };

    animationFrameRef.current = requestAnimationFrame(draw);

    const resize = () => {
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = window.setTimeout(() => {
        init();
        lastFrame = performance.now();
        lastTopoUpdate = 0;
      }, 150);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        lastFrame = performance.now();
      }
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
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
