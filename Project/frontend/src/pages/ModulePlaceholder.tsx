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

export default function ModulePlaceholder() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState<CustomerForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError(null);
  };

  const openEditForm = (customer: Customer) => {
    setEditingId(customer.id);

    setForm({
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
      company: customer.company || "",
    });

    setShowForm(true);
    setError(null);
  };

  const closeForm = () => {
    setShowForm(false);
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

      closeForm();
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

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p className="desc">
            Manage your customers and their contact information.
          </p>
        </div>

        <button
          className="btn btn-accent"
          onClick={openAddForm}
        >
          + Add Customer
        </button>
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

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="page-header">
            <div>
              <h2>
                {editingId === null
                  ? "Add Customer"
                  : "Edit Customer"}
              </h2>
            </div>
          </div>

          <form onSubmit={saveCustomer}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: 16,
              }}
            >
              <div className="field">
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Customer name"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="customer@email.com"
                />
              </div>

              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                />
              </div>

              <div className="field">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Company name"
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 20,
              }}
            >
              <button
                type="submit"
                className="btn btn-accent"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId === null
                  ? "Add Customer"
                  : "Save Changes"}
              </button>

              <button
                type="button"
                className="btn"
                onClick={closeForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="empty-state">
            <h3>Loading customers...</h3>
          </div>
        ) : customers.length === 0 ? (
          <div className="empty-state">
            <div className="glyph">👥</div>
            <h3>No customers yet</h3>
            <p>
              Add your first customer to start managing your
              CRM data.
            </p>

            <button
              className="btn btn-accent"
              onClick={openAddForm}
              style={{ marginTop: 12 }}
            >
              + Add Customer
            </button>
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
                  <th style={{ textAlign: "left", padding: 14 }}>
                    Name
                  </th>
                  <th style={{ textAlign: "left", padding: 14 }}>
                    Email
                  </th>
                  <th style={{ textAlign: "left", padding: 14 }}>
                    Phone
                  </th>
                  <th style={{ textAlign: "left", padding: 14 }}>
                    Company
                  </th>
                  <th style={{ textAlign: "left", padding: 14 }}>
                    Status
                  </th>
                  <th style={{ textAlign: "right", padding: 14 }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td style={{ padding: 14 }}>
                      <strong>{customer.name}</strong>
                    </td>

                    <td style={{ padding: 14 }}>
                      {customer.email || "-"}
                    </td>

                    <td style={{ padding: 14 }}>
                      {customer.phone || "-"}
                    </td>

                    <td style={{ padding: 14 }}>
                      {customer.company || "-"}
                    </td>

                    <td style={{ padding: 14 }}>
                      {customer.status}
                    </td>

                    <td
                      style={{
                        padding: 14,
                        textAlign: "right",
                      }}
                    >
                      <button
                        className="btn"
                        onClick={() =>
                          openEditForm(customer)
                        }
                        style={{ marginRight: 8 }}
                      >
                        Edit
                      </button>

                      <button
                        className="btn"
                        onClick={() =>
                          deleteCustomer(customer.id)
                        }
                      >
                        Delete
                      </button>
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