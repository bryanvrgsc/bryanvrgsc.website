import React, { useEffect, useRef, useState } from 'react';
import {
  layoutWithLines,
  prepareWithSegments,
  setLocale,
  type LayoutLine,
} from '@chenglou/pretext';
import { useStore } from '@nanostores/react';
import { NETWORK_COLORS } from '../../constants/colors';
import { SERVICES } from '../../constants/services';
import { UI_TEXT } from '../../constants/ui-text';
import { performanceMode, settings, type Language, type Theme } from '../../store';

type ScenePalette = {
  canvasBg: string;
  bodyText: string;
  heroText: string;
  accent: string;
  accentSoft: string;
  frame: string;
  glow: string;
};

type ColumnScene = {
  x: number;
  width: number;
  lineHeight: number;
  lines: LayoutLine[];
  speed: number;
  startOffset: number;
  amplitude: number;
  drift: number;
  opacity: number;
  accentEvery: number;
};

type HeroScene = {
  font: string;
  lineHeight: number;
  lines: LayoutLine[];
  totalHeight: number;
};

type Scene = {
  width: number;
  height: number;
  font: string;
  columns: ColumnScene[];
  hero: HeroScene;
};

const FONT_STACK = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", sans-serif';
const NOISE_SIZE = 128;

const resolveIsDark = (theme: Theme) =>
  theme === 'dark' ||
  (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const rotateArray = <T,>(values: T[], offset: number) =>
  values.map((_, index) => values[(index + offset) % values.length]);

const normalizeLine = (value: string) =>
  value.replace(/\s*•\s*/g, ' / ').replace(/\s+/g, ' ').trim();

const withAlpha = (color: string, alpha: number) => {
  const normalizedAlpha = clamp(alpha, 0, 1);
  const rgbMatch = color.match(/^rgba?\(([^)]+)\)$/i);

  if (rgbMatch) {
    const channels = rgbMatch[1].split(',').map((channel) => channel.trim());
    if (channels.length >= 3) {
      return `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, ${normalizedAlpha})`;
    }
  }

  const hex = color.replace('#', '');
  if (hex.length === 3 || hex.length === 6) {
    const safeHex =
      hex.length === 3
        ? hex
            .split('')
            .map((part) => `${part}${part}`)
            .join('')
        : hex;

    const int = Number.parseInt(safeHex, 16);
    const r = (int >> 16) & 255;
    const g = (int >> 8) & 255;
    const b = int & 255;
    return `rgba(${r}, ${g}, ${b}, ${normalizedAlpha})`;
  }

  return color;
};

const getPalette = (isDark: boolean): ScenePalette => {
  const base = isDark ? NETWORK_COLORS.dark : NETWORK_COLORS.light;

  return {
    canvasBg: base.canvasBg,
    bodyText: isDark ? 'rgba(226, 232, 240, 1)' : 'rgba(15, 23, 42, 1)',
    heroText: isDark ? 'rgba(248, 250, 252, 1)' : 'rgba(15, 23, 42, 1)',
    accent: base.packetColor,
    accentSoft: isDark ? 'rgba(148, 163, 184, 1)' : 'rgba(71, 85, 105, 1)',
    frame: base.lineColor,
    glow: base.packetColor,
  };
};

const getTextGroups = (lang: Language) => {
  const text = UI_TEXT[lang];
  const services = SERVICES[lang];

  const serviceSummaries = services.map((service) =>
    normalizeLine(
      `${service.title} / ${service.description} / ${service.items.join(' / ')} / ${service.valueProp.join(' / ')}`
    )
  );

  return [
    [
      normalizeLine(text.heroTitle),
      normalizeLine(text.heroSubtitle),
      normalizeLine(text.heroTags),
      normalizeLine(`${text.services.title} / ${text.services.subtitle}`),
      normalizeLine(`${text.portfolio.title} / ${text.portfolio.subtitle}`),
      normalizeLine(`${text.resources.title} / ${text.resources.subtitle}`),
      normalizeLine(`${text.contact.title} / ${text.contact.subtitle}`),
    ],
    serviceSummaries,
    [
      normalizeLine(text.mission.content),
      normalizeLine(text.vision.content),
      normalizeLine(text.values.content),
      normalizeLine(
        `${text.nav.home} / ${text.nav.services} / ${text.nav.work} / ${text.nav.resources} / ${text.nav.contact}`
      ),
      ...services.map((service) => normalizeLine(`${service.title} / ${service.valueProp.join(' / ')}`)),
    ],
  ];
};

const buildRepeatingLines = (
  paragraphs: string[],
  font: string,
  width: number,
  lineHeight: number,
  minLoopHeight: number
) => {
  let repetition = 2;
  let lines: LayoutLine[] = [];

  while (repetition <= 12) {
    const text = Array.from({ length: repetition }, (_, round) =>
      rotateArray(paragraphs, round).join('\n\n')
    ).join('\n\n');

    const prepared = prepareWithSegments(text, font, { whiteSpace: 'pre-wrap' });
    const layout = layoutWithLines(prepared, width, lineHeight);
    lines = layout.lines;

    if (layout.height >= minLoopHeight) {
      return lines;
    }

    repetition += 2;
  }

  return lines;
};

const createScene = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  lang: Language
): Scene => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  setLocale(lang);

  const compact = width < 720;
  const columnCount = compact ? 2 : width < 1200 ? 3 : 4;
  const columnGap = compact ? 18 : width < 1200 ? 24 : 32;
  const sidePadding = compact ? 20 : 44;
  const availableWidth = width - sidePadding * 2 - columnGap * (columnCount - 1);
  const columnWidth = Math.max(150, availableWidth / columnCount);
  const fontSize = compact ? 12 : width < 1200 ? 13 : 14;
  const lineHeight = compact ? 18 : width < 1200 ? 20 : 22;
  const font = `500 ${fontSize}px ${FONT_STACK}`;
  const heroFontSize = compact ? 32 : width < 1200 ? 46 : 64;
  const heroLineHeight = Math.round(heroFontSize * 0.9);
  const heroFont = `700 ${heroFontSize}px ${FONT_STACK}`;
  const groups = getTextGroups(lang);
  const minLoopHeight = height * 1.8;

  const columns = Array.from({ length: columnCount }, (_, index) => {
    const group = rotateArray(groups[index % groups.length], index);
    const lines = buildRepeatingLines(group, font, columnWidth, lineHeight, minLoopHeight);

    return {
      x: sidePadding + index * (columnWidth + columnGap),
      width: columnWidth,
      lineHeight,
      lines,
      speed: (compact ? 16 : 20) + index * 3,
      startOffset: (index * 120) % Math.max(lineHeight, lines.length * lineHeight),
      amplitude: compact ? 6 : 10,
      drift: index * 0.7,
      opacity: compact ? 0.16 + index * 0.025 : 0.15 + index * 0.03,
      accentEvery: 3 + (index % 3),
    };
  });

  const heroText = UI_TEXT[lang].heroTags.split('•').map((tag) => tag.trim()).join('\n');
  const heroLines = layoutWithLines(
    prepareWithSegments(heroText, heroFont, { whiteSpace: 'pre-wrap' }),
    Math.min(width * 0.68, compact ? width - 48 : 760),
    heroLineHeight
  ).lines;

  return {
    width,
    height,
    font,
    columns,
    hero: {
      font: heroFont,
      lineHeight: heroLineHeight,
      lines: heroLines,
      totalHeight: heroLines.length * heroLineHeight,
    },
  };
};

const drawAmbientGlow = (
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  palette: ScenePalette,
  time: number
) => {
  const firstGlowX = scene.width * 0.2 + Math.sin(time * 0.00012) * 70;
  const firstGlowY = scene.height * 0.24 + Math.cos(time * 0.00008) * 40;
  const secondGlowX = scene.width * 0.78 + Math.cos(time * 0.0001) * 60;
  const secondGlowY = scene.height * 0.72 + Math.sin(time * 0.00014) * 50;

  const firstGlow = ctx.createRadialGradient(firstGlowX, firstGlowY, 0, firstGlowX, firstGlowY, scene.width * 0.38);
  firstGlow.addColorStop(0, withAlpha(palette.glow, 0.15));
  firstGlow.addColorStop(1, withAlpha(palette.glow, 0));
  ctx.fillStyle = firstGlow;
  ctx.fillRect(0, 0, scene.width, scene.height);

  const secondGlow = ctx.createRadialGradient(secondGlowX, secondGlowY, 0, secondGlowX, secondGlowY, scene.width * 0.34);
  secondGlow.addColorStop(0, withAlpha(palette.accentSoft, 0.08));
  secondGlow.addColorStop(1, withAlpha(palette.accentSoft, 0));
  ctx.fillStyle = secondGlow;
  ctx.fillRect(0, 0, scene.width, scene.height);
};

const drawHeroLayer = (
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  palette: ScenePalette,
  time: number
) => {
  const { hero } = scene;

  ctx.save();
  ctx.translate(scene.width * 0.55, scene.height * 0.5);
  ctx.rotate(-0.12 + Math.sin(time * 0.00008) * 0.015);
  ctx.font = hero.font;
  ctx.textBaseline = 'top';

  for (let index = 0; index < hero.lines.length; index++) {
    const line = hero.lines[index];
    const x = -line.width / 2;
    const y = -hero.totalHeight / 2 + index * hero.lineHeight;
    const alpha = 0.05 + index * 0.012 + (Math.sin(time * 0.0006 + index) + 1) * 0.012;

    ctx.fillStyle = withAlpha(palette.heroText, alpha);
    ctx.fillText(line.text, x, y);

    if (index === hero.lines.length - 1) {
      ctx.strokeStyle = withAlpha(palette.accent, alpha * 1.9);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y + hero.lineHeight - 6);
      ctx.lineTo(x + Math.min(line.width, 320), y + hero.lineHeight - 6);
      ctx.stroke();
    }
  }

  ctx.restore();
};

const drawColumns = (
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  palette: ScenePalette,
  time: number
) => {
  ctx.font = scene.font;
  ctx.textBaseline = 'top';

  for (let columnIndex = 0; columnIndex < scene.columns.length; columnIndex++) {
    const column = scene.columns[columnIndex];
    const cycleHeight = Math.max(column.lineHeight, column.lines.length * column.lineHeight);
    const scroll = ((time * column.speed) / 1000 + column.startOffset) % cycleHeight;

    ctx.strokeStyle = withAlpha(palette.frame, 0.12);
    ctx.lineWidth = 1;
    ctx.strokeRect(column.x - 10, 28, column.width + 20, scene.height - 56);

    for (let lineIndex = 0; lineIndex < column.lines.length; lineIndex++) {
      const line = column.lines[lineIndex];

      let y = lineIndex * column.lineHeight - scroll;
      while (y < -column.lineHeight) y += cycleHeight;
      while (y > scene.height + column.lineHeight) y -= cycleHeight;

      const centerDistance = Math.abs(((y + column.lineHeight / 2) / scene.height) - 0.5) * 2;
      const edgeFade = clamp(1 - centerDistance * 0.92, 0.06, 1);
      const shimmer = 0.8 + Math.sin(time * 0.001 + lineIndex * 0.35 + column.drift) * 0.2;
      const alpha = column.opacity * edgeFade * shimmer;
      const waveX = Math.sin(time * 0.0007 + lineIndex * 0.22 + column.drift) * column.amplitude;
      const x = column.x + waveX;
      const isAccentLine = (lineIndex + columnIndex) % column.accentEvery === 0;

      ctx.fillStyle = isAccentLine
        ? withAlpha(palette.accent, alpha * 1.8)
        : withAlpha(palette.bodyText, alpha);
      ctx.fillText(line.text, x, y);

      if (isAccentLine) {
        const ruleStart = Math.min(x + line.width + 10, column.x + column.width - 32);
        const ruleEnd = Math.min(ruleStart + 26 + (lineIndex % 3) * 14, column.x + column.width);

        if (ruleEnd > ruleStart + 4) {
          ctx.strokeStyle = withAlpha(palette.accentSoft, alpha * 1.2);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(ruleStart, y + column.lineHeight * 0.6);
          ctx.lineTo(ruleEnd, y + column.lineHeight * 0.6);
          ctx.stroke();
        }
      }
    }
  }
};

export const CanvasBackground = () => {
  const { theme, lang, _systemThemeUpdate } = useStore(settings);
  const { lite } = useStore(performanceMode);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const paletteRef = useRef<ScenePalette>(getPalette(false));
  const [noiseDataUrl, setNoiseDataUrl] = useState('');

  useEffect(() => {
    paletteRef.current = getPalette(resolveIsDark(theme));
  }, [theme, _systemThemeUpdate]);

  useEffect(() => {
    if (lite) {
      setNoiseDataUrl('');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = NOISE_SIZE;
    canvas.height = NOISE_SIZE;

    const context = canvas.getContext('2d');
    if (!context) return;

    const imageData = context.createImageData(NOISE_SIZE, NOISE_SIZE);
    const buffer = new Uint32Array(imageData.data.buffer);

    for (let index = 0; index < buffer.length; index++) {
      buffer[index] = Math.random() < 0.5 ? 0x08000000 : 0;
    }

    context.putImageData(imageData, 0, 0);
    setNoiseDataUrl(canvas.toDataURL());
  }, [lite]);

  useEffect(() => {
    if (lite) {
      sceneRef.current = null;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });
    if (!context) return;

    let resizeTimer: number | undefined;
    let disposed = false;

    const rebuild = () => {
      if (disposed) return;
      sceneRef.current = createScene(canvas, context, lang);
    };

    rebuild();

    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        rebuild();
      });
    }

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(rebuild, 160);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      sceneRef.current = null;
    };
  }, [lang, lite]);

  useEffect(() => {
    if (lite) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });
    if (!context) return;

    let animationFrameId = 0;
    let active = true;
    let lastFrame = 0;
    const frameInterval = 1000 / 45;

    const render = (time: number) => {
      if (!active) return;

      animationFrameId = window.requestAnimationFrame(render);

      const scene = sceneRef.current;
      if (!scene) return;

      const elapsed = time - lastFrame;
      if (elapsed < frameInterval) return;
      lastFrame = time - (elapsed % frameInterval);

      const palette = paletteRef.current;

      context.fillStyle = palette.canvasBg;
      context.fillRect(0, 0, scene.width, scene.height);

      drawAmbientGlow(context, scene, palette, time);
      drawHeroLayer(context, scene, palette, time);
      drawColumns(context, scene, palette, time);
    };

    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      active = false;
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [lite]);

  if (lite) {
    return (
      <div
        className="fixed inset-0 pointer-events-none lite-background"
        style={{
          background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
          willChange: 'auto',
        }}
      />
    );
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-85 dark:opacity-100"
        aria-hidden="true"
      />

      {noiseDataUrl && (
        <div
          className="fixed top-0 left-0 w-full h-full pointer-events-none bg-noise"
          style={{ backgroundImage: `url(${noiseDataUrl})` }}
          aria-hidden="true"
        />
      )}
    </>
  );
};
