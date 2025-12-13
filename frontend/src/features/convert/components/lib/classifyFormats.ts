export const CATEGORY_MAP: Record<string, { cat: string; rank: number }> = {
  jpeg: { cat: "Najczęstsze", rank: 10 },
  png: { cat: "Najczęstsze", rank: 20 },
  webp: { cat: "Najczęstsze", rank: 30 },

  tiff: { cat: "Bezstratne", rank: 40 },
  bmp: { cat: "Bezstratne", rank: 50 },
  ppm: { cat: "Bezstratne", rank: 60 },
  pgm: { cat: "Bezstratne", rank: 61 },
  pbm: { cat: "Bezstratne", rank: 62 },
  pnm: { cat: "Bezstratne", rank: 63 },
  dib: { cat: "Bezstratne", rank: 64 },

  jpeg2000: { cat: "Stratne", rank: 70 },
  tga: { cat: "Stratne", rank: 80 },

  ico: { cat: "Ikony/miniatury", rank: 90 },
  icns: { cat: "Ikony/miniatury", rank: 100 },

  pdf: { cat: "Dokumenty/druk", rank: 110 },
  eps: { cat: "Dokumenty/druk", rank: 120 },

  dds: { cat: "Gry/tekstury", rank: 140 },

  pcx: { cat: "Legacy", rank: 150 },
  sgi: { cat: "Legacy", rank: 160 },
  xpm: { cat: "Legacy", rank: 171 },
  im: { cat: "Legacy", rank: 172 },
  msp: { cat: "Legacy", rank: 173 },

  spider: { cat: "Naukowe/specjalistyczne", rank: 205 },
  gif:    { cat: "Naukowe/specjalistyczne", rank: 206 },
  mpo:    { cat: "Naukowe/specjalistyczne", rank: 207 },
};

export const SECTION_ORDER = [
  "Najczęstsze",
  "Bezstratne",
  "Stratne",
  "Ikony/miniatury",
  "Dokumenty/druk",
  "Gry/tekstury",
  "Legacy",
  "Naukowe/specjalistyczne",
];

export function groupFormats(all: string[]) {
  const allowed = new Set(Object.keys(CATEGORY_MAP));

  const filtered = all.filter(f => allowed.has(f.toLowerCase()));

  const buckets: Record<string, { name: string; items: string[] }> = {};
  for (const f of filtered) {
    const key = f.toLowerCase();
    const meta = CATEGORY_MAP[key];
    const cat = meta.cat;
    if (!buckets[cat]) buckets[cat] = { name: cat, items: [] };
    buckets[cat].items.push(key);
  }

  for (const cat of Object.keys(buckets)) {
    buckets[cat].items.sort((a, b) => {
      const ra = CATEGORY_MAP[a]?.rank ?? 999;
      const rb = CATEGORY_MAP[b]?.rank ?? 999;
      if (ra !== rb) return ra - rb;
      return a.localeCompare(b);
    });
  }

  return SECTION_ORDER
    .filter((c) => buckets[c]?.items?.length)
    .map((c) => buckets[c]);
}

