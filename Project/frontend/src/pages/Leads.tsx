import { useState, useEffect } from "react";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL" | "WON" | "LOST";
  source: string;
  createdAt: string;
}

const DEFAULT_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Samantha Wright",
    company: "Apex Cloud Services",
    email: "samantha@apexcloud.io",
    phone: "+1 (555) 234-8901",
    value: 14500,
    status: "QUALIFIED",
    source: "Website Demo",
    createdAt: "2026-09-28",
  },
  {
    id: "lead-2",
    name: "Marcus Vance",
    company: "Vance Logistics",
    email: "m.vance@vancelogistics.com",
    phone: "+1 (555) 345-6789",
    value: 28000,
    status: "PROPOSAL",
    source: "Referral",
    createdAt: "2026-09-25",
  },
  {
    id: "lead-3",
    name: "Elena Rostova",
    company: "Nordic Design Studio",
    email: "elena@nordicstudio.co",
    phone: "+1 (555) 456-7890",
    value: 9200,
    status: "NEW",
    source: "Inbound Email",
    createdAt: "2026-10-01",
  },
  {
    id: "lead-4",
    name: "David Chen",
    company: "Horizon Retailers",
    email: "david.chen@horizonretail.com",
    phone: "+1 (555) 567-8901",
    value: 19500,
    status: "CONTACTED",
    source: "Cold Outreach",
    createdAt: "2026-09-30",
  },
  {
    id: "lead-5",
    name: "Claire Becker",
    company: "Becker BioLabs",
    email: "claire@beckerlabs.org",
    phone: "+1 (555) 678-9012",
    value: 36000,
    status: "WON",
    source: "Conference",
    createdAt: "2026-09-15",
  },
];

const STAGES = [
  { key: "NEW", label: "New", color: "var(--info)" },
  { key: "CONTACTED", label: "Contacted", color: "var(--warning)" },
  { key: "QUALIFIED", label: "Qualified", color: "var(--accent)" },
  { key: "PROPOSAL", label: "Proposal", color: "#A855F7" },
  { key: "WON", label: "Won", color: "var(--success)" },
] as const;

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem("crm_leads_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_LEADS;
      }
    }
    return DEFAULT_LEADS;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    value: 5000,
    status: "NEW" as Lead["status"],
    source: "Website",
  });

  useEffect(() => {
    localStorage.setItem("crm_leads_data", JSON.stringify(leads));
  }, [leads]);

  const totalValue = leads.reduce((acc, lead) => acc + (lead.value || 0), 0);
  const wonCount = leads.filter((l) => l.status === "WON").length;
  const qualifiedCount = leads.filter((l) => l.status === "QUALIFIED" || l.status === "PROPOSAL").length;

  const openAddModal = (initialStatus: Lead["status"] = "NEW") => {
    setEditingId(null);
    setForm({
      name: "",
      company: "",
      email: "",
      phone: "",
      value: 5000,
      status: initialStatus,
      source: "Website",
    });
    setShowModal(true);
  };

  const openEditModal = (lead: Lead) => {
    setEditingId(lead.id);
    setForm({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      value: lead.value,
      status: lead.status,
      source: lead.source,
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
      setLeads((prev) =>
        prev.map((l) =>
          l.id === editingId
            ? { ...l, ...form, value: Number(form.value) }
            : l
        )
      );
    } else {
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        name: form.name,
        company: form.company,
        email: form.email,
        phone: form.phone,
        value: Number(form.value) || 0,
        status: form.status,
        source: form.source,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setLeads((prev) => [newLead, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to remove this lead?")) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const advanceStatus = (leadId: string, currentStatus: Lead["status"]) => {
    const order: Lead["status"][] = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON"];
    const idx = order.indexOf(currentStatus);
    if (idx !== -1 && idx < order.length - 1) {
      const nextStatus = order[idx + 1];
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l))
      );
    }
  };

  const filteredLeads = leads.filter((l) => {
    const s = searchTerm.toLowerCase();
    return (
      l.name.toLowerCase().includes(s) ||
      l.company.toLowerCase().includes(s) ||
      l.email.toLowerCase().includes(s)
    );
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
      <div className="page-header">
        <div>
          <h1>Leads</h1>
          <p className="desc">
            Track prospective clients, advance stages, and grow your sales pipeline.
          </p>
        </div>
        <div className="page-header-actions">
          <div style={{ display: "flex", gap: 6 }}>
            <button
              className={`chip ${viewMode === "kanban" ? "active" : ""}`}
              onClick={() => setViewMode("kanban")}
            >
              Kanban Board
            </button>
            <button
              className={`chip ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              List View
            </button>
          </div>
          <button className="btn btn-accent" onClick={() => openAddModal()}>
            + Add Lead
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Total Leads</div>
          <div className="value">{leads.length}</div>
          <div className="delta up">Active pipeline</div>
        </div>
        <div className="stat-card">
          <div className="label">Pipeline Value</div>
          <div className="value">${totalValue.toLocaleString()}</div>
          <div className="delta up">Estimated value</div>
        </div>
        <div className="stat-card">
          <div className="label">Qualified / Proposal</div>
          <div className="value">{qualifiedCount}</div>
          <div className="delta up">High intent</div>
        </div>
        <div className="stat-card">
          <div className="label">Won Deals</div>
          <div className="value">{wonCount}</div>
          <div className="delta up">Converted customers</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-input">
          <span className="ico">🔍</span>
          <input
            type="text"
            placeholder="Search leads by name, company, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === "kanban" ? (
        <div className="kanban">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter(
              (l) => l.status === stage.key
            );
            const stageTotal = stageLeads.reduce((acc, l) => acc + l.value, 0);

            return (
              <div key={stage.key} className="kanban-col">
                <div className="kanban-col-head">
                  <span className="t">{stage.label}</span>
                  <span className="n">{stageLeads.length}</span>
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: "var(--text-muted)",
                    marginBottom: 10,
                    paddingLeft: 4,
                  }}
                >
                  ${stageTotal.toLocaleString()}
                </div>

                <div style={{ minHeight: 200 }}>
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="kanban-card"
                      onClick={() => openEditModal(lead)}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div className="name">{lead.name}</div>
                        <span
                          style={{
                            fontWeight: 700,
                            color: "var(--accent-600)",
                            fontSize: 12,
                          }}
                        >
                          ${lead.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="meta">{lead.company}</div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          marginTop: 4,
                        }}
                      >
                        {lead.email}
                      </div>

                      <div className="foot">
                        <span className="badge badge-neutral" style={{ fontSize: 10 }}>
                          {lead.source}
                        </span>
                        {stage.key !== "WON" && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: 11, padding: "2px 8px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              advanceStatus(lead.id, lead.status);
                            }}
                            title="Advance to next stage"
                          >
                            Advance →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div
                      style={{
                        padding: "24px 10px",
                        textAlign: "center",
                        fontSize: 12,
                        color: "var(--text-muted)",
                        border: "1px dashed var(--line)",
                        borderRadius: "var(--radius-md)",
                        marginBottom: 10,
                      }}
                    >
                      No leads in {stage.label}
                    </div>
                  )}

                  <button
                    className="kanban-add"
                    onClick={() => openAddModal(stage.key as Lead["status"])}
                  >
                    + Add to {stage.label}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lead</th>
                <th>Company</th>
                <th>Estimated Value</th>
                <th>Stage</th>
                <th>Source</th>
                <th>Added</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div className="row-avatar-cell">
                      <div className="avatar">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="cell-primary">{lead.name}</div>
                        <div className="cell-sub">{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{lead.company}</td>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    ${lead.value.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        lead.status === "WON"
                          ? "badge-success"
                          : lead.status === "QUALIFIED" || lead.status === "PROPOSAL"
                          ? "badge-warning"
                          : "badge-info"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{lead.source}</span>
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: 12 }}>
                    {lead.createdAt}
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
                        onClick={() => openEditModal(lead)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: "var(--danger)" }}
                        onClick={() => handleDelete(lead.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <div className={`modal-overlay ${showModal ? "open" : ""}`}>
        <div className="modal">
          <div className="modal-head">
            <h3>{editingId ? "Edit Lead" : "Create New Lead"}</h3>
            <div className="close" onClick={closeModal}>
              ✕
            </div>
          </div>
          <form onSubmit={handleSave}>
            <div className="modal-body">
              <div className="field">
                <label>Lead Contact Name *</label>
                <input
                  required
                  placeholder="e.g. Alex Morgan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label>Company / Organization *</label>
                <input
                  required
                  placeholder="e.g. Apex Media Ltd"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>

              <div className="form-grid-2" style={{ marginTop: 12 }}>
                <div className="field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="alex@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Phone Number</label>
                  <input
                    placeholder="+1 555-0100"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: 12 }}>
                <div className="field">
                  <label>Estimated Value ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                  />
                </div>
                <div className="field">
                  <label>Pipeline Stage</label>
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
                        status: e.target.value as Lead["status"],
                      })
                    }
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="QUALIFIED">Qualified</option>
                    <option value="PROPOSAL">Proposal</option>
                    <option value="WON">Won</option>
                    <option value="LOST">Lost</option>
                  </select>
                </div>
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label>Lead Source</label>
                <input
                  placeholder="Website, Referral, Cold Outreach, LinkedIn..."
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                />
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
                {editingId ? "Save Changes" : "Create Lead"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
