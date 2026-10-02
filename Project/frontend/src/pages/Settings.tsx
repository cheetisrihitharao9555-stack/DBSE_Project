import { useState } from "react";

export default function Settings() {
  const storedUser = localStorage.getItem("crm_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [name, setName] = useState(user?.name || "Adithya Vishnubhatla");
  const [email] = useState(user?.email || "adithya@example.com");
  const [role] = useState(user?.role || "USER");
  const [workspaceName, setWorkspaceName] = useState("Small business CRM");
  const [currency, setCurrency] = useState("USD ($)");
  const [timezone, setTimezone] = useState("UTC+05:30 (IST)");
  const [twoFactor, setTwoFactor] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updated = { ...user, name };
      localStorage.setItem("crm_user", JSON.stringify(updated));
    }
    setSavedMessage("Settings saved successfully.");
    setTimeout(() => setSavedMessage(null), 3500);
  };

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", width: "100%" }}>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="desc">
            Manage your account preferences, business profile, and application security.
          </p>
        </div>
      </div>

      {savedMessage && (
        <div
          className="badge badge-success"
          style={{
            padding: "10px 16px",
            fontSize: 13,
            marginBottom: 20,
            display: "block",
            textAlign: "center",
          }}
        >
          ✓ {savedMessage}
        </div>
      )}

      {/* User Profile */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title-row">
          <h3>Personal Profile</h3>
          <span className="badge badge-info">{role}</span>
        </div>

        <form onSubmit={handleSaveProfile}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div
              className="avatar"
              style={{
                width: 60,
                height: 60,
                fontSize: 24,
                background: "var(--accent-100)",
                color: "var(--accent)",
              }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{name}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                {email}
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="field">
              <label>Full Display Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Email Address (Read-only)</label>
              <input value={email} disabled style={{ opacity: 0.7 }} />
            </div>
          </div>

          <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn btn-accent">
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Workspace Preferences */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title-row">
          <h3>Workspace & Localization</h3>
        </div>

        <div className="form-grid-2">
          <div className="field">
            <label>Workspace Name</label>
            <input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Currency Format</label>
            <select
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "var(--paper-100)",
                color: "var(--text-primary)",
                border: "1px solid var(--line-strong)",
                borderRadius: "var(--radius-sm)",
              }}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="GBP (£)">GBP (£)</option>
              <option value="INR (₹)">INR (₹)</option>
            </select>
          </div>
        </div>

        <div className="field" style={{ marginTop: 14 }}>
          <label>Default Timezone</label>
          <input
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          />
        </div>
      </div>

      {/* Security & Authentication */}
      <div className="card">
        <div className="card-title-row">
          <h3>Security & Credentials</h3>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>
              Two-Factor Authentication (2FA)
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>
              Add an extra layer of security to your administrator account.
            </div>
          </div>
          <input
            type="checkbox"
            checked={twoFactor}
            onChange={(e) => setTwoFactor(e.target.checked)}
            style={{
              width: 20,
              height: 20,
              cursor: "pointer",
              accentColor: "var(--accent)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 14,
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Database Engine</div>
            <div style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>
              Connected to MySQL 8.0 on port 3306 (crm_db)
            </div>
          </div>
          <span className="badge badge-success">Connected</span>
        </div>
      </div>
    </div>
  );
}
