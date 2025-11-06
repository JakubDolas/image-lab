export type Filters = {
  brightness: number; contrast: number; saturate: number; hue: number; temperature: number;
};

export const DEFAULT_FILTERS: Filters = {
  brightness: 100, contrast: 100, saturate: 100, hue: 0, temperature: 0,
};
