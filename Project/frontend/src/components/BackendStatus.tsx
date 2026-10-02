import { useHealth } from "../hooks/useHealth";
import { API_BASE_URL } from "../services/api";

/** Live result of GET /api/health — proves React → Spring Boot → MySQL works. */
export default function BackendStatus() {
  const { data, error, loading, refresh } = useHealth();

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <div className="card-title-row">
        <h3>Backend connection</h3>
        <button className="btn btn-secondary btn-sm" onClick={() => void refresh()} disabled={loading}>
          {loading ? "Checking…" : "Re-check"}
        </button>
      </div>

      {loading && !data && <div className="skeleton skeleton-card" />}

      {error && (
        <div className="auth-error" role="alert">
          {error}
          <div style={{ marginTop: 6, opacity: 0.8 }}>Tried: {API_BASE_URL}/health</div>
        </div>
      )}

      {data && (
        <div style={{ display: "grid", gap: 10, fontSize: 13.5 }}>
          <Row label="API" value={data.status} ok={data.status === "UP"} />
          <Row label="MySQL database" value={data.database} ok={data.database === "UP"} />
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
            <span>Application</span><span>{data.application}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
            <span>Server time</span><span>{new Date(data.timestamp).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span className={`badge ${ok ? "badge-success" : "badge-danger"}`}>{value}</span>
    </div>
  );
}
