import { useState, useEffect } from "react";

export interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: "DISCOVERY" | "PROPOSAL" | "IN_REVIEW" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST";
  probability: number;
  closeDate: string;
  owner: string;
}

const DEFAULT_DEALS: Deal[] = [
  {
    id: "deal-1",
    name: "Enterprise Multi-Region License",
    company: "Acme Industries",
    value: 65000,
    stage: "NEGOTIATION",
    probability: 80,
    closeDate: "2026-10-15",
    owner: "Adithya V.",
  },
  {
    id: "deal-2",
    name: "API Infrastructure Scale-Up",
    company: "TechNova Global",
    value: 120000,
    stage: "CLOSED_WON",
    probability: 100,
    closeDate: "2026-09-30",
    owner: "Adithya V.",
  },
  {
    id: "deal-3",
    name: "Fleet Management Integration",
    company: "Vance Logistics",
    value: 48000,
    stage: "PROPOSAL",
    probability: 40,
    closeDate: "2026-10-28",
    owner: "Sarah J.",
  },
  {
    id: "deal-4",
    name: "Design System Subscription",
    company: "Nordic Design Studio",
    value: 18500,
    stage: "IN_REVIEW",
    probability: 60,
    closeDate: "2026-11-04",
    owner: "Adithya V.",
  },
  {
    id: "deal-5",
    name: "Dedicated Cloud Pod Tier",
    company: "Apex Cloud Services",
    value: 85000,
    stage: "DISCOVERY",
    probability: 20,
    closeDate: "2026-11-20",
    owner: "David K.",
  },
];

const STAGE_LABELS: Record<Deal["stage"], { label: string; badge: string }> = {
  DISCOVERY: { label: "Discovery", badge: "badge-info" },
  PROPOSAL: { label: "Proposal", badge: "badge-info" },
  IN_REVIEW: { label: "In Review", badge: "badge-warning" },
  NEGOTIATION: { label: "Negotiation", badge: "badge-warning" },
  CLOSED_WON: { label: "Closed Won", badge: "badge-success" },
  CLOSED_LOST: { label: "Closed Lost", badge: "badge-danger" },
};

export default function Sales() {
  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem("crm_deals_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_DEALS;
      }
    }
    return DEFAULT_DEALS;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    company: "",
    value: 25000,
    stage: "DISCOVERY" as Deal["stage"],
    closeDate: "2026-10-30",
    owner: "Adithya V.",
  });

  useEffect(() => {
    localStorage.setItem("crm_deals_data", JSON.stringify(deals));
  }, [deals]);

  const pipelineValue = deals
    .filter((d) => d.stage !== "CLOSED_LOST")
    .reduce((acc, d) => acc + d.value, 0);

  const wonRevenue = deals
    .filter((d) => d.stage === "CLOSED_WON")
    .reduce((acc, d) => acc + d.value, 0);

  const weightedForecast = deals
    .filter((d) => d.stage !== "CLOSED_LOST" && d.stage !== "CLOSED_WON")
    .reduce((acc, d) => acc + (d.value * d.probability) / 100, 0);

  const avgDeal =
    deals.length > 0 ? Math.round(pipelineValue / deals.length) : 0;

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      company: "",
      value: 25000,
      stage: "DISCOVERY",
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      owner: "Adithya V.",
    });
    setShowModal(true);
  };

  const openEditModal = (d: Deal) => {
    setEditingId(d.id);
    setForm({
      name: d.name,
      company: d.company,
      value: d.value,
      stage: d.stage,
      closeDate: d.closeDate,
      owner: d.owner,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const getStageProbability = (stage: Deal["stage"]) => {
    switch (stage) {
      case "DISCOVERY":
        return 20;
      case "PROPOSAL":
        return 40;
      case "IN_REVIEW":
        return 60;
      case "NEGOTIATION":
        return 80;
      case "CLOSED_WON":
        return 100;
      case "CLOSED_LOST":
        return 0;
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const prob = getStageProbability(form.stage);

    if (editingId) {
      setDeals((prev) =>
        prev.map((d) =>
          d.id === editingId
            ? {
                ...d,
                ...form,
                value: Number(form.value),
                probability: prob,
              }
            : d
        )
      );
    } else {
      const newDeal: Deal = {
        id: `deal-${Date.now()}`,
        name: form.name,
        company: form.company,
        value: Number(form.value) || 0,
        stage: form.stage,
        probability: prob,
        closeDate: form.closeDate,
        owner: form.owner,
      };
      setDeals((prev) => [newDeal, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      setDeals((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const filteredDeals = deals.filter((d) => {
    const s = searchTerm.toLowerCase();
    const matchSearch =
      d.name.toLowerCase().includes(s) || d.company.toLowerCase().includes(s);
    const matchStage = stageFilter === "ALL" || d.stage === stageFilter;
    return matchSearch && matchStage;
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
      <div className="page-header">
        <div>
          <h1>Sales & Deals</h1>
          <p className="desc">
            Track active revenue opportunities, stage probabilities, and close dates.
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-accent" onClick={openAddModal}>
            + Add Deal
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Total Pipeline</div>
          <div className="value">${pipelineValue.toLocaleString()}</div>
          <div className="delta up">Active opportunities</div>
        </div>
        <div className="stat-card">
          <div className="label">Closed Won Revenue</div>
          <div className="value" style={{ color: "var(--success)" }}>
            ${wonRevenue.toLocaleString()}
          </div>
          <div className="delta up">Realized revenue</div>
        </div>
        <div className="stat-card">
          <div className="label">Weighted Forecast</div>
          <div className="value">${Math.round(weightedForecast).toLocaleString()}</div>
          <div className="delta flat">Based on probability</div>
        </div>
        <div className="stat-card">
          <div className="label">Avg Deal Size</div>
          <div className="value">${avgDeal.toLocaleString()}</div>
          <div className="delta up">Across all stages</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-input">
          <span className="ico">🔍</span>
          <input
            type="text"
            placeholder="Search deals by name or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button
            className={`chip ${stageFilter === "ALL" ? "active" : ""}`}
            onClick={() => setStageFilter("ALL")}
          >
            All Deals ({deals.length})
          </button>
          <button
            className={`chip ${stageFilter === "DISCOVERY" ? "active" : ""}`}
            onClick={() => setStageFilter("DISCOVERY")}
          >
            Discovery
          </button>
          <button
            className={`chip ${stageFilter === "PROPOSAL" ? "active" : ""}`}
            onClick={() => setStageFilter("PROPOSAL")}
          >
            Proposal
          </button>
          <button
            className={`chip ${stageFilter === "NEGOTIATION" ? "active" : ""}`}
            onClick={() => setStageFilter("NEGOTIATION")}
          >
            Negotiation
          </button>
          <button
            className={`chip ${stageFilter === "CLOSED_WON" ? "active" : ""}`}
            onClick={() => setStageFilter("CLOSED_WON")}
          >
            Won
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Deal Name</th>
              <th>Account</th>
              <th>Value ($)</th>
              <th>Stage</th>
              <th>Probability</th>
              <th>Est. Close</th>
              <th>Owner</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map((deal) => {
              const meta = STAGE_LABELS[deal.stage] || {
                label: deal.stage,
                badge: "badge-neutral",
              };
              return (
                <tr key={deal.id}>
                  <td>
                    <div className="cell-primary">{deal.name}</div>
                    <div className="cell-sub">ID #{deal.id}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{deal.company}</span>
                  </td>
                  <td
                    style={{
                      fontWeight: 700,
                      color:
                        deal.stage === "CLOSED_WON"
                          ? "var(--success)"
                          : "var(--text-primary)",
                      fontSize: 14.5,
                    }}
                  >
                    ${deal.value.toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge ${meta.badge}`}>{meta.label}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 44,
                          height: 6,
                          background: "var(--paper-200)",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${deal.probability}%`,
                            height: "100%",
                            background:
                              deal.probability >= 80
                                ? "var(--success)"
                                : deal.probability >= 40
                                ? "var(--warning)"
                                : "var(--info)",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>
                        {deal.probability}%
                      </span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
                    {deal.closeDate}
                  </td>
                  <td>
                    <span className="badge badge-neutral">{deal.owner}</span>
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
                        onClick={() => openEditModal(deal)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: "var(--danger)" }}
                        onClick={() => handleDelete(deal.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredDeals.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 30 }}>
                  No deals match your criteria.
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
            <h3>{editingId ? "Edit Deal" : "Create New Deal"}</h3>
            <div className="close" onClick={closeModal}>
              ✕
            </div>
          </div>
          <form onSubmit={handleSave}>
            <div className="modal-body">
              <div className="field">
                <label>Deal Title *</label>
                <input
                  required
                  placeholder="e.g. Annual Cloud Infrastructure Renewal"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label>Associated Account / Company *</label>
                <input
                  required
                  placeholder="e.g. Acme Industries"
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                />
              </div>

              <div className="form-grid-2" style={{ marginTop: 12 }}>
                <div className="field">
                  <label>Deal Value ($) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.value}
                    onChange={(e) =>
                      setForm({ ...form, value: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="field">
                  <label>Sales Stage</label>
                  <select
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "var(--paper-100)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--line-strong)",
                      borderRadius: "var(--radius-sm)",
                    }}
                    value={form.stage}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        stage: e.target.value as Deal["stage"],
                      })
                    }
                  >
                    <option value="DISCOVERY">Discovery (20%)</option>
                    <option value="PROPOSAL">Proposal (40%)</option>
                    <option value="IN_REVIEW">In Review (60%)</option>
                    <option value="NEGOTIATION">Negotiation (80%)</option>
                    <option value="CLOSED_WON">Closed Won (100%)</option>
                    <option value="CLOSED_LOST">Closed Lost (0%)</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: 12 }}>
                <div className="field">
                  <label>Expected Close Date</label>
                  <input
                    type="date"
                    value={form.closeDate}
                    onChange={(e) =>
                      setForm({ ...form, closeDate: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Deal Owner</label>
                  <input
                    value={form.owner}
                    onChange={(e) =>
                      setForm({ ...form, owner: e.target.value })
                    }
                  />
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
                {editingId ? "Save Changes" : "Create Deal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
