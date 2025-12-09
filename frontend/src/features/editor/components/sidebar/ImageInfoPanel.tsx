import type { FC } from "react";
import { FaSave } from "react-icons/fa";

export type ImageInfo = {
  width?: number;
  height?: number;
  format?: string;
  sizeBytes?: number;
  colorSpace?: string;
};

type ImageInfoPanelProps = {
  info: ImageInfo | null;
};

const formatFileSize = (bytes?: number): string => {
if (typeof bytes !== "number") return "";

const kb = 1024;
const mb = 1024 * 1024;

if (bytes >= mb) {
    return `${(bytes / mb).toFixed(1)} MB`;
}
if (bytes >= kb) {
    return `${(bytes / kb).toFixed(0)} KB`;
}
return `${bytes} B`;
};

const ImageInfoPanel: FC<ImageInfoPanelProps> = ({ info }) => {
  if (!info) return null;

  const { width, height, format, sizeBytes, colorSpace } = info;

  return (
    <section className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-slate-200">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Informacje o obrazie
      </div>

      <dl className="space-y-1.5">
        {width && height && (
          <div className="flex items-center justify-between gap-2">
            <dt className="flex items-center gap-2 text-slate-400">
              <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-white/10 text-[13px]">
                ⧉
              </span>
              <span>Wymiary</span>
            </dt>
            <dd>{width} × {height} px</dd>
          </div>
        )}

        {format && (
          <div className="flex items-center justify-between gap-2">
            <dt className="flex items-center gap-2 text-slate-400">
              <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-white/10 text-[13px]">
                Fo
              </span>
              <span>Format</span>
            </dt>
            <dd>{format}</dd>
          </div>
        )}

        {typeof sizeBytes === "number" && (
          <div className="flex items-center justify-between gap-2">
            <dt className="flex items-center gap-2 text-slate-400">
              <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-white/10 text-[13px]">
                <FaSave />
              </span>
              <span>Rozmiar</span>
            </dt>
            <dd>{formatFileSize(sizeBytes)}</dd>
          </div>
        )}

        {colorSpace && (
          <div className="flex items-center justify-between gap-2">
            <dt className="flex items-center gap-2 text-slate-400">
              <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-white/10 text-[13px]">
                ⬤
              </span>
              <span>Kolor</span>
            </dt>
            <dd>{colorSpace}</dd>
          </div>
        )}
      </dl>
    </section>
  );
};

export default ImageInfoPanel;
