import { useMemo, useState } from "react";
import { RATIOS, PRESET_WIDTHS, type RatioId } from "../presets";

type NativeSize = { w: number; h: number } | null;

export function useResizePresets(
  nat: NativeSize,
  limitToOrig: boolean,
  onPickSize: (w: number, h: number) => void
) {
  const [portrait, setPortrait] = useState(false);
  const [picked, setPicked] = useState<RatioId | null>(null);
  const [selectedPreset, setSelectedPreset] =
    useState<{ w: number; h: number } | null>(null);

  const activeRatio = useMemo(() => {
    if (!picked) return null;
    return RATIOS.find(r => r.id === picked) ?? null;
  }, [picked]);

  function clampToOriginal(W: number, H: number) {
    if (!limitToOrig || !nat) return { W, H };
    return { W: Math.min(W, nat.w), H: Math.min(H, nat.h) };
  }

  function pickRatio(r: RatioId) {
    setPicked(prev => (prev === r ? null : r));
  }

  function applyPreset(r: RatioId, widthLandscape: number) {
    const ratio = RATIOS.find(x => x.id === r)!;

    let W = widthLandscape;
    let H = Math.round((W * ratio.h) / ratio.w);
    if (portrait) [W, H] = [H, W];

    ({ W, H } = clampToOriginal(W, H));

    onPickSize(W, H);
    setSelectedPreset({ w: W, h: H });
  }

  return {
    portrait,
    setPortrait,
    picked,
    setPicked,
    activeRatio,
    selectedPreset,
    pickRatio,
    applyPreset,
    PRESET_WIDTHS,
  };
}
