import { useEffect, useRef, useState } from "react";

export function useAutoRefresh(fetchCallback, intervalMs = 300000, dependencies) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Optional: keep for future (you can remove if you want)
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

  const savedCallback = useRef(fetchCallback);

  useEffect(() => {
    savedCallback.current = fetchCallback;
  }, [fetchCallback]);

  useEffect(() => {
    let alive = true;

    const load = async (isInitial = false) => {
      if (isInitial) setLoading(true);

      try {
        const result = await savedCallback.current();
        if (!alive) return;

        setData(result);
        setError(null);

        // ✅ Backend-ready: use generated_at if API provides it, else fallback to client time
        const generatedAt = result?.generated_at ? new Date(result.generated_at) : new Date();
        setLastRefreshTime(generatedAt);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "Failed to load data");
      } finally {
        if (alive && isInitial) setLoading(false);
      }
    };

    load(true);

    const intervalId = setInterval(() => {
      load(false);
    }, intervalMs);

    return () => {
      alive = false;
      clearInterval(intervalId);
    };
  }, [intervalMs, dependencies]);

  return { data, loading, error, lastRefreshTime };
}
