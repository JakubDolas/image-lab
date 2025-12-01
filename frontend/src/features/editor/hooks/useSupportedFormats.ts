import { useEffect, useState } from "react";
import { getSupportedFormats } from "@/features/convert/api";

type SupportedState = {
  formats: string[];
  preferredExt: Record<string, string>;
  loading: boolean;
  error: string | null;
};

export function useSupportedFormats(): SupportedState {
  const [formats, setFormats] = useState<string[]>([]);
  const [preferredExt, setPreferredExt] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { formats, preferred_ext } = await getSupportedFormats();
        if (cancelled) return;
        setFormats(formats || []);
        setPreferredExt(preferred_ext || {});
        setError(null);
      } catch (e) {
        if (cancelled) return;
        setError("Nie udało się pobrać listy formatów.");
        setFormats([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { formats, preferredExt, loading, error };
}
