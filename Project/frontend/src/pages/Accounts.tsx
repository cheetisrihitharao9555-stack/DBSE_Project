import { useState, useEffect } from "react";

export interface Account {
  id: string;
  name: string;
  industry: string;
  website: string;
  tier: "Enterprise" | "Mid-Market" | "Startup";
  annualRevenue: number;
  phone: string;
  status: "ACTIVE" | "PROSPECT" | "CHURNED";
  contactsCount: number;
}

const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: "acc-1",
    name: "Acme Industries",
    industry: "Manufacturing",
    website: "https://acmeindustries.com",
    tier: "Enterprise",
    annualRevenue: 4200000,
    phone: "+1 (555) 019-2831",
    status: "ACTIVE",
    contactsCount: 12,
  },
  {
    id: "acc-2",
    name: "TechNova Global",
    industry: "Software & SaaS",
    website: "https://technova.io",
    tier: "Enterprise",
    annualRevenue: 7800000,
    phone: "+1 (555) 014-9922",
    status: "ACTIVE",
    contactsCount: 8,
  },
  {
    id: "acc-3",
    name: "Apex Cloud Services",
    industry: "Cloud Infrastructure",
    website: "https://apexcloud.io",
    tier: "Mid-Market",
    annualRevenue: 1500000,
    phone: "+1 (555) 234-8901",
    status: "PROSPECT",
    contactsCount: 4,
  },
  {
    id: "acc-4",
    name: "Nordic Design Studio",
    industry: "Creative Agency",
    website: "https://nordicstudio.co",
    tier: "Startup",
    annualRevenue: 480000,
    phone: "+1 (555) 456-7890",
    status: "PROSPECT",
    contactsCount: 3,
  },
  {
    id: "acc-5",
    name: "Vance Logistics",
    industry: "Supply Chain",
    website: "https://vancelogistics.com",
    tier: "Mid-Market",
    annualRevenue: 2900000,
    phone: "+1 (555) 345-6789",
    status: "ACTIVE",
    contactsCount: 6,
  },
];

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem("crm_accounts_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_ACCOUNTS;
      }
    }
    return DEFAULT_ACCOUNTS;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    industry: "Technology",
    website: "",
    tier: "Mid-Market" as Account["tier"],
    annualRevenue: 1000000,
    phone: "",
    status: "ACTIVE" as Account["status"],
  });

  useEffect(() => {
    localStorage.setItem("crm_accounts_data", JSON.stringify(accounts));
  }, [accounts]);

  const totalRev = accounts.reduce((acc, a) => acc + (a.annualRevenue || 0), 0);
  const enterpriseCount = accounts.filter((a) => a.tier === "Enterprise").length;
  const activeCount = accounts.filter((a) => a.status === "ACTIVE").length;

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      industry: "Technology",
      website: "",
      tier: "Mid-Market",
      annualRevenue: 1000000,
      phone: "",
      status: "ACTIVE",
    });
    setShowModal(true);
  };

  const openEditModal = (acc: Account) => {
    setEditingId(acc.id);
    setForm({
      name: acc.name,
      industry: acc.industry,
      website: acc.website,
      tier: acc.tier,
      annualRevenue: acc.annualRevenue,
      phone: acc.phone,
      status: acc.status,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingId) {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? {
                ...a,
                ...form,
                annualRevenue: Number(form.annualRevenue),
              }
            : a
        )
      );
    } else {
      const newAcc: Account = {
        id: `acc-${Date.now()}`,
        name: form.name,
        industry: form.industry,
        website: form.website,
        tier: form.tier,
        annualRevenue: Number(form.annualRevenue) || 0,
        phone: form.phone,
        status: form.status,
        contactsCount: 1,
      };
      setAccounts((prev) => [newAcc, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const filteredAccounts = accounts.filter((a) => {
    const s = searchTerm.toLowerCase();
    const matchSearch =
      a.name.toLowerCase().includes(s) ||
      a.industry.toLowerCase().includes(s) ||
      a.website.toLowerCase().includes(s);
    const matchTier = tierFilter === "ALL" || a.tier === tierFilter;
    return matchSearch && matchTier;
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
      <div className="page-header">
        <div>
          <h1>Accounts</h1>
          <p className="desc">
            Organize companies, manage corporate hierarchies, and track revenue tiers.
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-accent" onClick={openAddModal}>
            + Add Account
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Total Accounts</div>
          <div className="value">{accounts.length}</div>
          <div className="delta up">Managed organizations</div>
        </div>
        <div className="stat-card">
          <div className="label">Enterprise Tier</div>
          <div className="value">{enterpriseCount}</div>
          <div className="delta up">High-value clients</div>
        </div>
        <div className="stat-card">
          <div className="label">Combined Portfolio Rev</div>
          <div className="value">${(totalRev / 1000000).toFixed(1)}M</div>
          <div className="delta up">Client market cap</div>
        </div>
        <div className="stat-card">
          <div className="label">Active Accounts</div>
          <div className="value">{activeCount}</div>
          <div className="delta up">In good standing</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-input">
          <span className="ico">🔍</span>
          <input
            type="text"
            placeholder="Search accounts by company, industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            className={`chip ${tierFilter === "ALL" ? "active" : ""}`}
            onClick={() => setTierFilter("ALL")}
          >
            All Tiers
          </button>
          <button
            className={`chip ${tierFilter === "Enterprise" ? "active" : ""}`}
            onClick={() => setTierFilter("Enterprise")}
          >
            Enterprise
          </button>
          <button
            className={`chip ${tierFilter === "Mid-Market" ? "active" : ""}`}
            onClick={() => setTierFilter("Mid-Market")}
          >
            Mid-Market
          </button>
          <button
            className={`chip ${tierFilter === "Startup" ? "active" : ""}`}
            onClick={() => setTierFilter("Startup")}
          >
            Startup
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Industry</th>
              <th>Tier</th>
              <th>Est. Annual Revenue</th>
              <th>Phone</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((acc) => (
              <tr key={acc.id}>
                <td>
                  <div className="row-avatar-cell">
                    <div
                      className="avatar"
                      style={{
                        background:
                          acc.tier === "Enterprise"
                            ? "var(--accent-100)"
                            : "var(--info-100)",
                        color:
                          acc.tier === "Enterprise"
                            ? "var(--accent)"
                            : "var(--info)",
                      }}
                    >
                      🏢
                    </div>
                    <div>
                      <div className="cell-primary">{acc.name}</div>
                      <div className="cell-sub">{acc.website}</div>
                    </div>
                  </div>
                </td>
                <td>{acc.industry}</td>
                <td>
                  <span
                    className={`badge ${
                      acc.tier === "Enterprise"
                        ? "badge-warning"
                        : acc.tier === "Mid-Market"
                        ? "badge-info"
                        : "badge-neutral"
                    }`}
                  >
                    {acc.tier}
                  </span>
                </td>
                <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  ${(acc.annualRevenue / 1000).toLocaleString()}k / yr
                </td>
                <td>{acc.phone || "—"}</td>
                <td>
                  <span
                    className={`badge ${
                      acc.status === "ACTIVE"
                        ? "badge-success"
                        : acc.status === "PROSPECT"
                        ? "badge-info"
                        : "badge-danger"
                    }`}
                  >
                    {acc.status}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEditModal(acc)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ color: "var(--danger)" }}
                      onClick={() => handleDelete(acc.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredAccounts.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 30 }}>
                  No accounts match your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <div className={`modal-overlay ${showModal ? "open" : ""}`}>
        <div className="modal">
          <div className="modal-head">
            <h3>{editingId ? "Edit Account" : "Add Account"}</h3>
            <div className="close" onClick={closeModal}>
              ✕
            </div>
          </div>
          <form onSubmit={handleSave}>
            <div className="modal-body">
              <div className="field">
                <label>Company Name *</label>
                <input
                  required
                  placeholder="e.g. Acme Corporation"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-grid-2" style={{ marginTop: 12 }}>
                <div className="field">
                  <label>Industry</label>
                  <input
                    placeholder="e.g. SaaS, Finance, Logistics"
                    value={form.industry}
                    onChange={(e) =>
                      setForm({ ...form, industry: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Account Tier</label>
                  <select
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "var(--paper-100)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--line-strong)",
                      borderRadius: "var(--radius-sm)",
                    }}
                    value={form.tier}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tier: e.target.value as Account["tier"],
                      })
                    }
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Mid-Market">Mid-Market</option>
                    <option value="Startup">Startup</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: 12 }}>
                <div className="field">
                  <label>Website URL</label>
                  <input
                    placeholder="https://company.com"
                    value={form.website}
                    onChange={(e) =>
                      setForm({ ...form, website: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Phone</label>
                  <input
                    placeholder="+1 555-0100"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: 12 }}>
                <div className="field">
                  <label>Est. Annual Revenue ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.annualRevenue}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        annualRevenue: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label>Status</label>
                  <select
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "var(--paper-100)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--line-strong)",
                      borderRadius: "var(--radius-sm)",
                    }}
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as Account["status"],
                      })
                    }
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PROSPECT">Prospect</option>
                    <option value="CHURNED">Churned</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-foot">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-accent">
                {editingId ? "Save Changes" : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
