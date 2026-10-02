import { useState, useEffect } from "react";

export interface Interaction {
  id: string;
  type: "CALL" | "MEETING" | "EMAIL" | "NOTE" | "TASK";
  contact: string;
  company: string;
  date: string;
  summary: string;
  outcome: string;
  sentiment: "Positive" | "Neutral" | "Needs Follow-up";
}

const DEFAULT_INTERACTIONS: Interaction[] = [
  {
    id: "int-1",
    type: "CALL",
    contact: "David Chen",
    company: "Horizon Retailers",
    date: "2026-10-02 14:30",
    summary: "Reviewed initial software specifications and timeline.",
    outcome: "Agreed to follow up next Tuesday with tailored proposal.",
    sentiment: "Positive",
  },
  {
    id: "int-2",
    type: "MEETING",
    contact: "Samantha Wright",
    company: "Apex Cloud Services",
    date: "2026-10-01 11:00",
    summary: "Quarterly architectural review and multi-tenant hosting setup.",
    outcome: "Client requested quote on dedicated database cluster.",
    sentiment: "Positive",
  },
  {
    id: "int-3",
    type: "EMAIL",
    contact: "Marcus Vance",
    company: "Vance Logistics",
    date: "2026-09-30 09:15",
    summary: "Sent customized demo video and API documentation links.",
    outcome: "Confirmed receipt; forwarding to technical VP.",
    sentiment: "Neutral",
  },
  {
    id: "int-4",
    type: "NOTE",
    contact: "Elena Rostova",
    company: "Nordic Design Studio",
    date: "2026-09-29 16:45",
    summary: "Met at regional business expo; requested priority onboarding.",
    outcome: "Scheduled introductory discovery call.",
    sentiment: "Needs Follow-up",
  },
  {
    id: "int-5",
    type: "TASK",
    contact: "Claire Becker",
    company: "Becker BioLabs",
    date: "2026-09-28 13:00",
    summary: "Finalized NDA and master service agreement paperwork.",
    outcome: "Signed contract received and archived.",
    sentiment: "Positive",
  },
];

const TYPE_ICONS: Record<Interaction["type"], string> = {
  CALL: "📞",
  MEETING: "👥",
  EMAIL: "✉️",
  NOTE: "📝",
  TASK: "✅",
};

export default function Interactions() {
  const [interactions, setInteractions] = useState<Interaction[]>(() => {
    const saved = localStorage.getItem("crm_interactions_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_INTERACTIONS;
      }
    }
    return DEFAULT_INTERACTIONS;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    type: "CALL" as Interaction["type"],
    contact: "",
    company: "",
    summary: "",
    outcome: "",
    sentiment: "Positive" as Interaction["sentiment"],
  });

  useEffect(() => {
    localStorage.setItem("crm_interactions_data", JSON.stringify(interactions));
  }, [interactions]);

  const callsCount = interactions.filter((i) => i.type === "CALL").length;
  const meetingsCount = interactions.filter((i) => i.type === "MEETING").length;
  const emailsCount = interactions.filter((i) => i.type === "EMAIL").length;

  const openAddModal = () => {
    setForm({
      type: "CALL",
      contact: "",
      company: "",
      summary: "",
      outcome: "",
      sentiment: "Positive",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contact.trim() || !form.summary.trim()) return;

    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newInt: Interaction = {
      id: `int-${Date.now()}`,
      type: form.type,
      contact: form.contact,
      company: form.company,
      date: formatted,
      summary: form.summary,
      outcome: form.outcome,
      sentiment: form.sentiment,
    };

    setInteractions((prev) => [newInt, ...prev]);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this interaction record?")) {
      setInteractions((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const filteredInteractions = interactions.filter((i) => {
    const s = searchTerm.toLowerCase();
    const matchSearch =
      i.contact.toLowerCase().includes(s) ||
      i.company.toLowerCase().includes(s) ||
      i.summary.toLowerCase().includes(s);
    const matchType = typeFilter === "ALL" || i.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
      <div className="page-header">
        <div>
          <h1>Interactions</h1>
          <p className="desc">
            Complete communication audit log of customer touchpoints, meetings, and calls.
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-accent" onClick={openAddModal}>
            + Log Activity
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Total Activities</div>
          <div className="value">{interactions.length}</div>
          <div className="delta up">Documented events</div>
        </div>
        <div className="stat-card">
          <div className="label">Calls Logged</div>
          <div className="value">{callsCount}</div>
          <div className="delta up">Direct phone sync</div>
        </div>
        <div className="stat-card">
          <div className="label">Meetings Held</div>
          <div className="value">{meetingsCount}</div>
          <div className="delta up">Client demos & briefs</div>
        </div>
        <div className="stat-card">
          <div className="label">Emails Sent</div>
          <div className="value">{emailsCount}</div>
          <div className="delta flat">Correspondence</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-input">
          <span className="ico">🔍</span>
          <input
            type="text"
            placeholder="Search activities by person, company, keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button
            className={`chip ${typeFilter === "ALL" ? "active" : ""}`}
            onClick={() => setTypeFilter("ALL")}
          >
            All ({interactions.length})
          </button>
          <button
            className={`chip ${typeFilter === "CALL" ? "active" : ""}`}
            onClick={() => setTypeFilter("CALL")}
          >
            Calls
          </button>
          <button
            className={`chip ${typeFilter === "MEETING" ? "active" : ""}`}
            onClick={() => setTypeFilter("MEETING")}
          >
            Meetings
          </button>
          <button
            className={`chip ${typeFilter === "EMAIL" ? "active" : ""}`}
            onClick={() => setTypeFilter("EMAIL")}
          >
            Emails
          </button>
          <button
            className={`chip ${typeFilter === "NOTE" ? "active" : ""}`}
            onClick={() => setTypeFilter("NOTE")}
          >
            Notes
          </button>
        </div>
      </div>

      {/* List */}
      <div className="dash-col">
        {filteredInteractions.map((item) => (
          <div key={item.id} className="card" style={{ padding: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "var(--radius-md)",
                    background: "var(--paper-200)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {TYPE_ICONS[item.type]}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>
                      {item.contact}
                    </span>
                    {item.company && (
                      <span
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: 13,
                        }}
                      >
                        • {item.company}
                      </span>
                    )}
                    <span
                      className={`badge ${
                        item.sentiment === "Positive"
                          ? "badge-success"
                          : item.sentiment === "Neutral"
                          ? "badge-neutral"
                          : "badge-warning"
                      }`}
                    >
                      {item.sentiment}
                    </span>
                  </div>
                  <p
                    style={{
                      marginTop: 6,
                      fontSize: 13.5,
                      color: "var(--text-primary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.summary}
                  </p>
                  {item.outcome && (
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 12.5,
                        color: "var(--text-secondary)",
                        background: "var(--paper-050)",
                        padding: "6px 12px",
                        borderRadius: "var(--radius-sm)",
                        borderLeft: "2px solid var(--accent)",
                      }}
                    >
                      <strong>Outcome:</strong> {item.outcome}
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 8,
                }}
              >
                <span
                  style={{ fontSize: 12, color: "var(--text-muted)" }}
                >
                  {item.date}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ color: "var(--danger)", padding: "2px 8px" }}
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredInteractions.length === 0 && (
          <div className="card empty-state">
            <div className="glyph">💬</div>
            <h3>No interactions found</h3>
            <p>Log calls, messages, and meetings to keep track of communications.</p>
            <button className="btn btn-accent btn-sm" onClick={openAddModal}>
              + Log First Activity
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <div className={`modal-overlay ${showModal ? "open" : ""}`}>
        <div className="modal">
          <div className="modal-head">
            <h3>Log New Interaction</h3>
            <div className="close" onClick={closeModal}>
              ✕
            </div>
          </div>
          <form onSubmit={handleSave}>
            <div className="modal-body">
              <div className="form-grid-2">
                <div className="field">
                  <label>Activity Type</label>
                  <select
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "var(--paper-100)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--line-strong)",
                      borderRadius: "var(--radius-sm)",
                    }}
                    value={form.type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type: e.target.value as Interaction["type"],
                      })
                    }
                  >
                    <option value="CALL">Phone Call</option>
                    <option value="MEETING">Meeting</option>
                    <option value="EMAIL">Email</option>
                    <option value="NOTE">Quick Note</option>
                    <option value="TASK">Task Completed</option>
                  </select>
                </div>
                <div className="field">
                  <label>Client Sentiment</label>
                  <select
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "var(--paper-100)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--line-strong)",
                      borderRadius: "var(--radius-sm)",
                    }}
                    value={form.sentiment}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sentiment: e.target.value as Interaction["sentiment"],
                      })
                    }
                  >
                    <option value="Positive">Positive</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Needs Follow-up">Needs Follow-up</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: 12 }}>
                <div className="field">
                  <label>Contact Name *</label>
                  <input
                    required
                    placeholder="e.g. David Chen"
                    value={form.contact}
                    onChange={(e) =>
                      setForm({ ...form, contact: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Company</label>
                  <input
                    placeholder="e.g. Horizon Retailers"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label>Discussion Summary *</label>
                <textarea
                  required
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "var(--paper-100)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--line-strong)",
                    borderRadius: "var(--radius-sm)",
                    fontFamily: "inherit",
                  }}
                  placeholder="Key topics discussed, client feedback, or inquiries..."
                  value={form.summary}
                  onChange={(e) =>
                    setForm({ ...form, summary: e.target.value })
                  }
                />
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label>Action Items / Next Steps</label>
                <input
                  placeholder="e.g. Send updated pricing deck by Friday"
                  value={form.outcome}
                  onChange={(e) =>
                    setForm({ ...form, outcome: e.target.value })
                  }
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
                Save Activity
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
