import { useCallback, useEffect, useState } from "react";
import { healthService } from "../services/healthService";
import { getErrorMessage } from "../services/api";
import type { HealthResponse } from "../types/health";

/** Calls GET /api/health once on mount; call refresh() to re-check. */
export function useHealth() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await healthService.check());
    } catch (err) {
      setData(null);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, error, loading, refresh };
}
