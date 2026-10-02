import { useState, useEffect } from "react";

export interface FollowUp {
  id: string;
  title: string;
  contact: string;
  company: string;
  dueDate: string;
  dueTime: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  completed: boolean;
  notes: string;
}

const DEFAULT_FOLLOWUPS: FollowUp[] = [
  {
    id: "fup-1",
    title: "Send customized multi-region enterprise contract",
    contact: "Adithya Vishnubhatla",
    company: "Acme Industries",
    dueDate: "2026-10-03",
    dueTime: "10:30 AM",
    priority: "HIGH",
    completed: false,
    notes: "Include SLA addendum for 99.99% uptime guarantee.",
  },
  {
    id: "fup-2",
    title: "Technical architecture follow-up with VP of Engineering",
    contact: "Samantha Wright",
    company: "Apex Cloud Services",
    dueDate: "2026-10-04",
    dueTime: "02:00 PM",
    priority: "HIGH",
    completed: false,
    notes: "Review VPC peering and security compliance report.",
  },
  {
    id: "fup-3",
    title: "Confirm logistics software integration timeline",
    contact: "Marcus Vance",
    company: "Vance Logistics",
    dueDate: "2026-10-05",
    dueTime: "11:15 AM",
    priority: "MEDIUM",
    completed: false,
    notes: "Coordinate with product implementation team.",
  },
  {
    id: "fup-4",
    title: "Introductory onboarding check-in call",
    contact: "Elena Rostova",
    company: "Nordic Design Studio",
    dueDate: "2026-10-02",
    dueTime: "04:30 PM",
    priority: "LOW",
    completed: true,
    notes: "Client completed account setup smoothly.",
  },
];

export default function Followups() {
  const [followups, setFollowups] = useState<FollowUp[]>(() => {
    const saved = localStorage.getItem("crm_followups_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_FOLLOWUPS;
      }
    }
    return DEFAULT_FOLLOWUPS;
  });

  const [filter, setFilter] = useState<"ALL" | "PENDING" | "TODAY" | "COMPLETED">("PENDING");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    contact: "",
    company: "",
    dueDate: new Date().toISOString().split("T")[0],
    dueTime: "10:00 AM",
    priority: "HIGH" as FollowUp["priority"],
    notes: "",
  });

  useEffect(() => {
    localStorage.setItem("crm_followups_data", JSON.stringify(followups));
  }, [followups]);

  const todayStr = new Date().toISOString().split("T")[0];
  const pendingCount = followups.filter((f) => !f.completed).length;
  const todayCount = followups.filter(
    (f) => !f.completed && f.dueDate === todayStr
  ).length;
  const highPriorityCount = followups.filter(
    (f) => !f.completed && f.priority === "HIGH"
  ).length;
  const completedCount = followups.filter((f) => f.completed).length;

  const toggleComplete = (id: string) => {
    setFollowups((prev) =>
      prev.map((f) => (f.id === id ? { ...f, completed: !f.completed } : f))
    );
  };

  const deleteFollowup = (id: string) => {
    setFollowups((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.contact.trim()) return;

    const newFup: FollowUp = {
      id: `fup-${Date.now()}`,
      title: form.title,
      contact: form.contact,
      company: form.company,
      dueDate: form.dueDate,
      dueTime: form.dueTime,
      priority: form.priority,
      completed: false,
      notes: form.notes,
    };

    setFollowups((prev) => [newFup, ...prev]);
    setShowModal(false);
  };

  const filteredFollowups = followups.filter((f) => {
    if (filter === "PENDING") return !f.completed;
    if (filter === "COMPLETED") return f.completed;
    if (filter === "TODAY") return !f.completed && f.dueDate === todayStr;
    return true;
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
      <div className="page-header">
        <div>
          <h1>Follow-ups</h1>
          <p className="desc">
            Never miss a client touchpoint. Schedule, organize, and complete key reminders.
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-accent" onClick={() => setShowModal(true)}>
            + New Follow-up
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Pending Tasks</div>
          <div className="value">{pendingCount}</div>
          <div className="delta up">Action required</div>
        </div>
        <div className="stat-card">
          <div className="label">Due Today</div>
          <div className="value" style={{ color: "var(--warning)" }}>
            {todayCount}
          </div>
          <div className="delta up">Immediate attention</div>
        </div>
        <div className="stat-card">
          <div className="label">High Priority</div>
          <div className="value" style={{ color: "var(--danger)" }}>
            {highPriorityCount}
          </div>
          <div className="delta flat">Critical revenue impact</div>
        </div>
        <div className="stat-card">
          <div className="label">Completed</div>
          <div className="value" style={{ color: "var(--success)" }}>
            {completedCount}
          </div>
          <div className="delta up">Tasks cleared</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div style={{ display: "flex", gap: 6 }}>
          <button
            className={`chip ${filter === "PENDING" ? "active" : ""}`}
            onClick={() => setFilter("PENDING")}
          >
            Pending ({pendingCount})
          </button>
          <button
            className={`chip ${filter === "TODAY" ? "active" : ""}`}
            onClick={() => setFilter("TODAY")}
          >
            Due Today ({todayCount})
          </button>
          <button
            className={`chip ${filter === "COMPLETED" ? "active" : ""}`}
            onClick={() => setFilter("COMPLETED")}
          >
            Completed ({completedCount})
          </button>
          <button
            className={`chip ${filter === "ALL" ? "active" : ""}`}
            onClick={() => setFilter("ALL")}
          >
            All ({followups.length})
          </button>
        </div>
      </div>

      {/* List */}
      <div className="dash-col">
        {filteredFollowups.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{
              padding: 16,
              opacity: item.completed ? 0.65 : 1,
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  flex: 1,
                  minWidth: 260,
                }}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleComplete(item.id)}
                  style={{
                    width: 20,
                    height: 20,
                    cursor: "pointer",
                    accentColor: "var(--accent)",
                  }}
                />

                <div>
                  <div
                    style={{
                      fontSize: 14.5,
                      fontWeight: 600,
                      textDecoration: item.completed ? "line-through" : "none",
                      color: item.completed
                        ? "var(--text-muted)"
                        : "var(--text-primary)",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "var(--text-secondary)",
                      marginTop: 3,
                    }}
                  >
                    👤 {item.contact} {item.company && `• ${item.company}`}
                  </div>
                  {item.notes && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        marginTop: 4,
                      }}
                    >
                      {item.notes}
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span
                  className={`badge ${
                    item.priority === "HIGH"
                      ? "badge-danger"
                      : item.priority === "MEDIUM"
                      ? "badge-warning"
                      : "badge-neutral"
                  }`}
                >
                  {item.priority}
                </span>

                <div
                  style={{
                    fontSize: 12.5,
                    color: "var(--text-secondary)",
                    textAlign: "right",
                  }}
                >
                  <div>📅 {item.dueDate}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: 11 }}>
                    {item.dueTime}
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  style={{ color: "var(--danger)", padding: "4px 8px" }}
                  onClick={() => deleteFollowup(item.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredFollowups.length === 0 && (
          <div className="card empty-state">
            <div className="glyph">⏰</div>
            <h3>No follow-ups in this view</h3>
            <p>You have cleared all items or none match the selected filter.</p>
            <button
              className="btn btn-accent btn-sm"
              onClick={() => setShowModal(true)}
            >
              + Create Follow-up
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <div className={`modal-overlay ${showModal ? "open" : ""}`}>
        <div className="modal">
          <div className="modal-head">
            <h3>Schedule Follow-up</h3>
            <div className="close" onClick={() => setShowModal(false)}>
              ✕
            </div>
          </div>
          <form onSubmit={handleSave}>
            <div className="modal-body">
              <div className="field">
                <label>Task / Follow-up Action *</label>
                <input
                  required
                  placeholder="e.g. Call client regarding proposal feedback"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-grid-2" style={{ marginTop: 12 }}>
                <div className="field">
                  <label>Contact Person *</label>
                  <input
                    required
                    placeholder="e.g. Samantha Wright"
                    value={form.contact}
                    onChange={(e) =>
                      setForm({ ...form, contact: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Company</label>
                  <input
                    placeholder="e.g. Apex Cloud Services"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: 12 }}>
                <div className="field">
                  <label>Due Date</label>
                  <input
                    type="date"
                    required
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm({ ...form, dueDate: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Due Time</label>
                  <input
                    placeholder="e.g. 02:00 PM"
                    value={form.dueTime}
                    onChange={(e) =>
                      setForm({ ...form, dueTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label>Priority Level</label>
                <select
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "var(--paper-100)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--line-strong)",
                    borderRadius: "var(--radius-sm)",
                  }}
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value as FollowUp["priority"],
                    })
                  }
                >
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="LOW">Low Priority</option>
                </select>
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label>Additional Notes</label>
                <input
                  placeholder="Key prep notes, links, agenda..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-foot">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-accent">
                Schedule Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
