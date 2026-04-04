export interface PerformanceInput {
  prefersReducedMotion: boolean;
  saveData: boolean;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  score: number;
}

export const shouldUseLiteMode = (input: PerformanceInput) => {
  if (input.prefersReducedMotion) return true;
  if (input.saveData) return true;
  if (input.effectiveType === 'slow-2g' || input.effectiveType === '2g') {
    return true;
  }
  return input.score < 2;
};
