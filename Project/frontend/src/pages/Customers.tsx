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

type CustomerForm = {
  name: string;
  email: string;
  phone: string;
  company: string;
};

const emptyForm: CustomerForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [form, setForm] = useState<CustomerForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
    setError(null);
  };

  const openEditModal = (customer: Customer) => {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
      company: customer.company || "",
    });
    setShowModal(true);
    setError(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const saveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Customer name is required.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (editingId === null) {
        await api.post("/customers", form);
      } else {
        await api.put(`/customers/${editingId}`, form);
      }

      closeModal();
      await loadCustomers();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const deleteCustomer = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (!confirmed) return;

    try {
      setError(null);
      await api.delete(`/customers/${id}`);
      await loadCustomers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "ALL" || c.status?.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = customers.filter(
    (c) => (c.status ?? "ACTIVE").toUpperCase() === "ACTIVE"
  ).length;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p className="desc">
            Manage your customer database and track business accounts.
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-accent" onClick={openAddModal}>
            + Add Customer
          </button>
        </div>
      </div>

      {error && (
        <div className="auth-error" role="alert" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="label">Total Customers</div>
          <div className="value">{customers.length}</div>
          <div className="delta up">↑ Synced with MySQL</div>
        </div>
        <div className="stat-card">
          <div className="label">Active Customers</div>
          <div className="value">{activeCount}</div>
          <div className="delta up">Live database status</div>
        </div>
        <div className="stat-card">
          <div className="label">Filtered Matches</div>
          <div className="value">{filteredCustomers.length}</div>
          <div className="delta flat">Currently visible</div>
        </div>
        <div className="stat-card">
          <div className="label">Status</div>
          <div className="value" style={{ fontSize: 20, color: "var(--success)" }}>
            Operational
          </div>
          <div className="delta flat">Spring Boot Backend</div>
        </div>
      </div>

      {/* Toolbar & Filter */}
      <div className="toolbar">
        <div className="search-input">
          <span className="ico">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            className={`chip ${statusFilter === "ALL" ? "active" : ""}`}
            onClick={() => setStatusFilter("ALL")}
          >
            All ({customers.length})
          </button>
          <button
            className={`chip ${statusFilter === "ACTIVE" ? "active" : ""}`}
            onClick={() => setStatusFilter("ACTIVE")}
          >
            Active ({activeCount})
          </button>
          <button
            className={`chip ${statusFilter === "INACTIVE" ? "active" : ""}`}
            onClick={() => setStatusFilter("INACTIVE")}
          >
            Inactive ({customers.length - activeCount})
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="table-wrap">
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
            Loading customer records from database...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="empty-state">
            <div className="glyph">👤</div>
            <h3>No customers found</h3>
            <p>
              {searchTerm
                ? "No customer matches your search filter."
                : "No customer records have been created yet."}
            </p>
            <button className="btn btn-accent btn-sm" onClick={openAddModal}>
              + Add First Customer
            </button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="row-avatar-cell">
                      <div className="avatar">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="cell-primary">{customer.name}</div>
                        <div className="cell-sub">ID #{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>
                      {customer.company || "—"}
                    </span>
                  </td>
                  <td>{customer.email || "—"}</td>
                  <td>{customer.phone || "—"}</td>
                  <td>
                    <span
                      className={`badge ${
                        (customer.status ?? "ACTIVE").toUpperCase() === "ACTIVE"
                          ? "badge-success"
                          : "badge-neutral"
                      }`}
                    >
                      {customer.status || "ACTIVE"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditModal(customer)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: "var(--danger)" }}
                        onClick={() => deleteCustomer(customer.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      <div className={`modal-overlay ${showModal ? "open" : ""}`}>
        <div className="modal">
          <div className="modal-head">
            <h3>{editingId === null ? "Add New Customer" : "Edit Customer"}</h3>
            <div className="close" onClick={closeModal}>
              ✕
            </div>
          </div>
          <form onSubmit={saveCustomer}>
            <div className="modal-body">
              <div className="field">
                <label htmlFor="modal-name">Full Name *</label>
                <input
                  id="modal-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label htmlFor="modal-company">Company</label>
                <input
                  id="modal-company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corp"
                />
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label htmlFor="modal-email">Email Address</label>
                <input
                  id="modal-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label htmlFor="modal-phone">Phone Number</label>
                <input
                  id="modal-phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
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
              <button
                type="submit"
                className="btn btn-accent"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId === null
                  ? "Create Customer"
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
