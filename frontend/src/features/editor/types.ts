export type Filters = {
  brightness: number;
  contrast: number;
  saturate: number;
  hue: number;
  temperature: number;
  sepia: number;
  grayscale: number;
  invert: number;
  blur: number;
};

export const DEFAULT_FILTERS: Filters = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hue: 0,
  temperature: 0,
  sepia: 0,
  grayscale: 0,
  invert: 0,
  blur: 0,
};

export function buildCssFilter(f: Filters): string {
  const t = Math.max(-100, Math.min(100, f.temperature));
  const warm =
    t >= 0
      ? `sepia(${t * 0.4}%) hue-rotate(${t * 0.1}deg) saturate(${100 + t * 0.3}%)`
      : `sepia(${Math.abs(t) * 0.25}%) hue-rotate(${t * 0.2}deg) saturate(${100 + t * 0.2}%)`;

  return [
    `brightness(${f.brightness}%)`,
    `contrast(${f.contrast}%)`,
    `saturate(${f.saturate}%)`,
    `hue-rotate(${f.hue}deg)`,
    warm,
    `sepia(${f.sepia}%)`,
    `grayscale(${f.grayscale}%)`,
    `invert(${f.invert}%)`,
    `blur(${f.blur}px)`,
  ].join(" ");
}
