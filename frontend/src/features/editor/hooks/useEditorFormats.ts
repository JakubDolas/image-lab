import { useEffect, useState } from "react";
import { getEditorSupportedFormats } from "@/features/editor/api/formats";

export function useEditorFormats() {
  const [formats, setFormats] = useState<string[]>([]);
  const [preferredExt, setPreferredExt] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getEditorSupportedFormats();
        setFormats(data.formats);
        setPreferredExt(data.preferred_ext ?? {});
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? "Nie udało się pobrać listy formatów.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return {
    formats,
    preferredExt,
    loading,
    error,
  };
}
