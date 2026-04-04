import { NETWORK_COLORS } from '../../constants/colors';

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

  constructor(width: number, height: number, index: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = 1 + Math.random() * 1.5;

    const speed = 4 + Math.random() * 2.5;
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.opacity = 0.3;
    this.pulseSpeed = 0.002 + Math.random() * 0.003;
    this.index = index;
  }

  update(width: number, height: number, time: number, deltaSeconds: number) {
    this.x += this.vx * deltaSeconds;
    this.y += this.vy * deltaSeconds;

    if (this.x < this.radius) {
      this.x = this.radius;
      this.vx = Math.abs(this.vx);
    } else if (this.x > width - this.radius) {
      this.x = width - this.radius;
      this.vx = -Math.abs(this.vx);
    }

    if (this.y < this.radius) {
      this.y = this.radius;
      this.vy = Math.abs(this.vy);
    } else if (this.y > height - this.radius) {
      this.y = height - this.radius;
      this.vy = -Math.abs(this.vy);
    }

    this.opacity = 0.35 + Math.sin(time * this.pulseSpeed) * 0.25;
  }
}

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

  drawGlow(ctx: CanvasRenderingContext2D) {
    const x = this.from.x + (this.to.x - this.from.x) * this.progress;
    const y = this.from.y + (this.to.y - this.from.y) * this.progress;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCore(ctx: CanvasRenderingContext2D) {
    const x = this.from.x + (this.to.x - this.from.x) * this.progress;
    const y = this.from.y + (this.to.y - this.from.y) * this.progress;

    ctx.beginPath();
    ctx.arc(x, y, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

class SpatialGrid {
  cellSize: number;
  cols: number;
  rows: number;
  grid: NetworkNode[][];

  constructor(width: number, height: number, cellSize: number) {
    this.cellSize = cellSize;
    this.cols = Math.ceil(width / cellSize);
    this.rows = Math.ceil(height / cellSize);
    this.grid = new Array(this.cols * this.rows);
    this.clear();
  }

  clear() {
    for (let index = 0; index < this.grid.length; index += 1) {
      if (this.grid[index]) {
        this.grid[index].length = 0;
      } else {
        this.grid[index] = [];
      }
    }
  }

  insert(node: NetworkNode) {
    const col = (node.x / this.cellSize) | 0;
    const row = (node.y / this.cellSize) | 0;
    const index = row * this.cols + col;
    this.grid[index].push(node);
  }

  getNearby(node: NetworkNode, out: NetworkNode[]) {
    const col = (node.x / this.cellSize) | 0;
    const row = (node.y / this.cellSize) | 0;
    out.length = 0;

    for (let deltaY = -1; deltaY <= 1; deltaY += 1) {
      for (let deltaX = -1; deltaX <= 1; deltaX += 1) {
        const nextCol = col + deltaX;
        const nextRow = row + deltaY;

        if (nextCol < 0 || nextRow < 0 || nextCol >= this.cols || nextRow >= this.rows) {
          continue;
        }

        const index = nextRow * this.cols + nextCol;
        const cell = this.grid[index];

        if (!cell.length) {
          continue;
        }

        for (let cellIndex = 0; cellIndex < cell.length; cellIndex += 1) {
          out.push(cell[cellIndex]);
        }
      }
    }

    return out;
  }
}

const getIsDarkTheme = () => {
  const root = document.documentElement;

  if (root.getAttribute('data-theme') === 'dark') {
    return true;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const getNetworkPalette = () => (getIsDarkTheme() ? NETWORK_COLORS.dark : NETWORK_COLORS.light);

/**
 * Starts the animated network background on an existing canvas element.
 * Returns a cleanup function that fully tears the animation down.
 */
export const startCanvasBackground = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d', {
    alpha: false,
    desynchronized: true
  });

  if (!ctx) {
    return () => {};
  }

  const nodes: NetworkNode[] = [];
  const packets: DataPacket[] = [];
  const links: Array<{ a: NetworkNode; b: NetworkNode }> = [];
  const nearbyBuffer: NetworkNode[] = [];

  let grid: SpatialGrid | null = null;
  let connectionCounts: Uint8Array | null = null;
  let animationFrame: number | null = null;
  let resizeTimeout: number | null = null;
  let disposed = false;
  let maxDistance = 120;
  let lastFrame = 0;
  let lastTopologyUpdate = 0;
  let palette = getNetworkPalette();
  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight;

  const fpsInterval = 1000 / 60;
  const topologyInterval = 300;
  const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const refreshPalette = () => {
    palette = getNetworkPalette();
  };

  const init = () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    const isCompactDesktop = canvasWidth < 1280;
    const dpr = Math.min(window.devicePixelRatio || 1, isCompactDesktop ? 1.15 : 1.35);

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const area = canvasWidth * canvasHeight;
    let count = Math.min(
      Math.floor(area / (isCompactDesktop ? 8500 : 6200)),
      isCompactDesktop ? 140 : 220
    );
    count = Math.max(count, isCompactDesktop ? 56 : 80);

    nodes.length = 0;
    packets.length = 0;
    links.length = 0;
    nearbyBuffer.length = 0;
    connectionCounts = new Uint8Array(count);

    maxDistance = isCompactDesktop ? 112 : 128;
    grid = new SpatialGrid(canvasWidth, canvasHeight, maxDistance);

    for (let index = 0; index < count; index += 1) {
      nodes.push(new NetworkNode(canvasWidth, canvasHeight, index));
    }
  };

  const stopLoop = () => {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  };

  const draw = (time: number) => {
    if (disposed) {
      animationFrame = null;
      return;
    }

    if (document.visibilityState !== 'visible') {
      animationFrame = null;
      return;
    }

    animationFrame = requestAnimationFrame(draw);

    if (!lastFrame) {
      lastFrame = time;
    }

    const elapsed = time - lastFrame;
    if (elapsed < fpsInterval) {
      return;
    }

    const deltaMs = Math.min(elapsed, 32);
    const deltaSeconds = deltaMs / 1000;
    lastFrame = time - (elapsed % fpsInterval);

    ctx.fillStyle = palette.canvasBg;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.globalCompositeOperation = 'source-over';

    const nodeCount = nodes.length;
    for (let index = 0; index < nodeCount; index += 1) {
      nodes[index].update(canvasWidth, canvasHeight, time, deltaSeconds);
    }

    if (grid && connectionCounts && time - lastTopologyUpdate > topologyInterval) {
      lastTopologyUpdate = time;
      links.length = 0;

      grid.clear();
      connectionCounts.fill(0);

      for (let index = 0; index < nodeCount; index += 1) {
        nodes[index].neighbors.length = 0;
        grid.insert(nodes[index]);
      }

      const maxDistanceSquared = maxDistance * maxDistance;
      const maxConnections = 6;

      for (let nodeIndex = 0; nodeIndex < nodeCount; nodeIndex += 1) {
        if (connectionCounts[nodeIndex] >= maxConnections) {
          continue;
        }

        const startNode = nodes[nodeIndex];
        const nearbyNodes = grid.getNearby(startNode, nearbyBuffer);

        for (let nearbyIndex = 0; nearbyIndex < nearbyNodes.length; nearbyIndex += 1) {
          const endNode = nearbyNodes[nearbyIndex];
          if (startNode === endNode) {
            continue;
          }

          const targetIndex = endNode.index;
          if (targetIndex <= nodeIndex || connectionCounts[targetIndex] >= maxConnections) {
            continue;
          }

          const deltaX = startNode.x - endNode.x;
          const deltaY = startNode.y - endNode.y;
          const distanceSquared = deltaX * deltaX + deltaY * deltaY;

          if (distanceSquared < maxDistanceSquared) {
            links.push({ a: startNode, b: endNode });
            startNode.neighbors.push(endNode);
            endNode.neighbors.push(startNode);
            connectionCounts[nodeIndex] += 1;
            connectionCounts[targetIndex] += 1;

            if (connectionCounts[nodeIndex] >= maxConnections) {
              break;
            }
          }
        }
      }
    }

    ctx.strokeStyle = palette.lineColor;
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let linkIndex = 0; linkIndex < links.length; linkIndex += 1) {
      const link = links[linkIndex];
      ctx.moveTo(link.a.x, link.a.y);
      ctx.lineTo(link.b.x, link.b.y);
    }

    ctx.stroke();

    ctx.fillStyle = palette.nodeColor;
    for (let index = 0; index < nodes.length; index += 1) {
      const node = nodes[index];
      ctx.globalAlpha = node.opacity;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (let index = packets.length - 1; index >= 0; index -= 1) {
      const packet = packets[index];
      if (!packet.update(deltaSeconds)) {
        const currentNode = packet.to;

        if (currentNode.neighbors.length && Math.random() < 0.25) {
          const nextNode =
            currentNode.neighbors[(Math.random() * currentNode.neighbors.length) | 0];
          packets.push(new DataPacket(currentNode, nextNode));
        }

        packets.splice(index, 1);
      }
    }

    const maxPackets = Math.min(nodeCount * 0.45, 160);
    const spawnChance = Math.min(0.3 * (deltaMs / fpsInterval), 0.65);

    if (packets.length < maxPackets && Math.random() < spawnChance) {
      const startNode = nodes[(Math.random() * nodeCount) | 0];
      if (startNode.neighbors.length) {
        const endNode =
          startNode.neighbors[(Math.random() * startNode.neighbors.length) | 0];
        packets.push(new DataPacket(startNode, endNode));
      }
    }

    ctx.fillStyle = palette.packetGlow;
    for (let index = 0; index < packets.length; index += 1) {
      packets[index].drawGlow(ctx);
    }

    ctx.fillStyle = palette.packetColor;
    for (let index = 0; index < packets.length; index += 1) {
      packets[index].drawCore(ctx);
    }
  };

  const startLoop = () => {
    if (animationFrame === null && !disposed) {
      animationFrame = requestAnimationFrame(draw);
    }
  };

  const handleResize = () => {
    if (resizeTimeout !== null) {
      window.clearTimeout(resizeTimeout);
    }

    resizeTimeout = window.setTimeout(() => {
      resizeTimeout = null;
      init();
      lastFrame = 0;
      lastTopologyUpdate = 0;
      refreshPalette();
      startLoop();
    }, 150);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      lastFrame = 0;
      lastTopologyUpdate = 0;
      refreshPalette();
      startLoop();
      return;
    }

    stopLoop();
  };

  const themeObserver = new MutationObserver(refreshPalette);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme']
  });

  init();
  startLoop();

  window.addEventListener('resize', handleResize, { passive: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);
  themeMediaQuery.addEventListener('change', refreshPalette);

  return () => {
    disposed = true;
    stopLoop();
    themeObserver.disconnect();

    if (resizeTimeout !== null) {
      window.clearTimeout(resizeTimeout);
    }

    window.removeEventListener('resize', handleResize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    themeMediaQuery.removeEventListener('change', refreshPalette);
  };
};
