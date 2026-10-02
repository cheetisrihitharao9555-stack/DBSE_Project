import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../services/api";

type LoginRecord = {
  id: number;
  loginTime: string;
};

export default function LoginHistory() {
  const [history, setHistory] = useState<LoginRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/login-history");
      setHistory(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (value: string) => {
    const date = new Date(value);

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Login History</h1>
          <p className="desc">
            View your previous CRM login activity.
          </p>
        </div>
      </div>

      {error && (
        <div
          className="auth-error"
          role="alert"
          style={{ marginBottom: 16 }}
        >
          {error}
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="empty-state">
            <h3>Loading login history...</h3>
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <div className="glyph">🔐</div>
            <h3>No login history</h3>
            <p>Your login activity will appear here.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: 14,
                    }}
                  >
                    #
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: 14,
                    }}
                  >
                    Login Date & Time
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: 14,
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {history.map((record, index) => (
                  <tr key={record.id}>
                    <td style={{ padding: 14 }}>
                      {index + 1}
                    </td>

                    <td style={{ padding: 14 }}>
                      {formatDateTime(record.loginTime)}
                    </td>

                    <td style={{ padding: 14 }}>
                      <span>Successful</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}