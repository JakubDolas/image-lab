import { useCallback, type DragEvent } from "react";

type Props = {
  onPickFile: (file: File) => void;
  children: React.ReactNode;
};

export function Dropzone({ onPickFile, children }: Props) {
  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f) onPickFile(f);
    },
    [onPickFile]
  );

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="h-full w-full"
    >
      {children}
    </div>
  );
}
