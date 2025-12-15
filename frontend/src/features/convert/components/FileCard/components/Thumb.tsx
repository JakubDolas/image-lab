import { useEffect, useState } from "react";

export default function Thumb({ file }: { file: Blob | File }) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (!file) {
      setUrl(undefined);
      return;
    }
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => {
      URL.revokeObjectURL(u);
    };
  }, [file]);
  return <div className="w-14 h-14 rounded-xl border border-white/10 overflow-hidden bg-black/30">
    <img src={url} className="w-full h-full object-cover" />
  </div>;
}
