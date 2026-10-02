import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../services/api";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("crm_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const [userResponse, customerResponse] = await Promise.all([
        api.get("/auth/me"),
        api.get("/customers"),
      ]);

      setUser(userResponse.data);
      setCustomers(customerResponse.data);
    } catch (err) {
      setError(getErrorMessage(err));
      const saved = localStorage.getItem("crm_user");
      if (saved) {
        try {
          setUser((prev) => prev || JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_user");
    window.location.href = "/login";
  };

  if (loading && !user) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "10px 0 30px", maxWidth: 1200, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back, <strong>{user?.name}</strong>
          </p>
        </div>

        <button onClick={logout}>Logout</button>
      </div>

      {error && (
        <div
          style={{
            padding: 15,
            marginBottom: 20,
            border: "1px solid #ff5555",
            borderRadius: 8,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <div
          style={{
            padding: 25,
            border: "1px solid #333",
            borderRadius: 12,
          }}
        >
          <h3>Total Customers</h3>
          <h2>{customers.length}</h2>
        </div>

        <div
          style={{
            padding: 25,
            border: "1px solid #333",
            borderRadius: 12,
          }}
        >
          <h3>Active Customers</h3>
          <h2>
            {customers.filter((customer) => customer.status === "ACTIVE").length}
          </h2>
        </div>

        <div
          style={{
            padding: 25,
            border: "1px solid #333",
            borderRadius: 12,
          }}
        >
          <h3>Account</h3>
          <h2>{user?.role}</h2>
        </div>
      </div>

      <div>
        <h2>Recent Customers</h2>

        {customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: 15,
                minWidth: 500,
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 12 }}>Name</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Email</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Phone</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Company</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Status</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td style={{ padding: 12 }}>{customer.name}</td>
                    <td style={{ padding: 12 }}>{customer.email}</td>
                    <td style={{ padding: 12 }}>{customer.phone}</td>
                    <td style={{ padding: 12 }}>{customer.company}</td>
                    <td style={{ padding: 12 }}>{customer.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}