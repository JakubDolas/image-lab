import { useEffect, useState } from "react";

type LoaderFn = () => Promise<{
  formats: string[];
  preferred_ext?: Record<string, string>;
}>;

export function useFormatsBase(
  loadFn: LoaderFn,
  blocked: string[]
) {
  const [formats, setFormats] = useState<string[]>([]);
  const [preferredExt, setPreferredExt] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const data = await loadFn();
        if (cancelled) return;

        const filtered = (data.formats || []).filter(
          (f) => !blocked.includes(f.toLowerCase())
        );

        setFormats(filtered);
        setPreferredExt(data.preferred_ext ?? {});
        setError(null);
      } catch {
        if (cancelled) return;
        setFormats([]);
        setError("Nie udało się pobrać listy formatów.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadFn, blocked]);

  return { formats, preferredExt, loading, error };
}
