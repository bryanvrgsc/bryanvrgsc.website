import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { performanceMode } from '../../store';

/**
 * CanvasBackground
 *
 * The static background is the default SSR output.
 * The rich canvas animation is progressively enhanced only when the performance
 * heuristic upgrades the experience and the animation engine is lazy-loaded.
 */
export const CanvasBackground = () => {
  const { lite } = useStore(performanceMode);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const shouldRenderCanvas = isHydrated && !lite;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!shouldRenderCanvas) {
      cleanupRef.current?.();
      cleanupRef.current = null;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    const loadAnimation = async () => {
      const { startCanvasBackground } = await import('./CanvasBackgroundEngine');

      if (cancelled || !canvas.isConnected) {
        return;
      }

      cleanupRef.current = startCanvasBackground(canvas);
    };

    loadAnimation().catch(() => {
      cleanupRef.current = null;
    });

    return () => {
      cancelled = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [shouldRenderCanvas]);

  return (
    <div aria-hidden="true" className="adaptive-background fixed inset-0 pointer-events-none">
      {shouldRenderCanvas && (
        <canvas
          ref={canvasRef}
          className="adaptive-background-canvas absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
};
