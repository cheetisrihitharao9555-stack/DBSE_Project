import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ACCOUNT_NAV, ALL_NAV, WORKSPACE_NAV, type NavItem } from "../config/navigation";
import { useToast } from "../context/ToastContext";

/** Sidebar + top bar shell, ported from the prototype (same class names, same look). */
export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // close the mobile sidebar after navigating
  useEffect(() => {
    setSidebarOpen(false);
    setShowQuickAdd(false);
    setShowNotifications(false);
  }, [pathname]);

  const current = ALL_NAV.find((n) => n.path === pathname);
  const link = (n: NavItem) => (
    <NavLink key={n.path} to={n.path} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
      <span className="ico">{n.icon}</span> {n.label}
    </NavLink>
  );

  const storedUser = localStorage.getItem("crm_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const displayName = user?.name || "User";
  const displayRole = user?.role || "USER";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_user");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <div className={`sidebar-backdrop ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <span className="auth-mark">C</span> CRM
        </div>
        <div className="sidebar-biz">
          <strong>My workspace</strong>Small business CRM
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Workspace</div>
          {WORKSPACE_NAV.map(link)}
          <div className="sidebar-section-label">Account</div>
          {ACCOUNT_NAV.map(link)}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">{avatarLetter}</div>
            <div className="who">
              <div className="name">{displayName}</div>
              <div className="role">{displayRole}</div>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm btn-block" style={{ marginTop: 10 }} onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <div className="main-col">
        <header className="topbar">
          <div className="icon-btn menu-toggle" role="button" aria-label="Toggle menu" onClick={() => setSidebarOpen((o) => !o)}>
            ☰
          </div>
          <div className="topbar-page-title">{current?.label ?? ""}</div>
          <div className="topbar-search">
            <span className="ico">🔍</span>
            <input
              type="text"
              placeholder="Search customers, leads, deals..."
              autoComplete="off"
              readOnly
              onFocus={() => toast.notImplemented("Global search", 4)}
            />
          </div>
          <div className="topbar-right" style={{ position: "relative" }}>
            <div
              className="icon-btn"
              role="button"
              title="Notifications"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowQuickAdd(false);
              }}
            >
              🔔
              <span className="dot" />
            </div>

            <button
              className="btn btn-accent btn-sm"
              onClick={() => {
                setShowQuickAdd(!showQuickAdd);
                setShowNotifications(false);
              }}
            >
              + Quick add ▾
            </button>

            {/* Quick Add Menu */}
            {showQuickAdd && (
              <div
                className="card"
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: 8,
                  width: 220,
                  padding: 8,
                  zIndex: 100,
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                <div
                  className="nav-item"
                  onClick={() => {
                    setShowQuickAdd(false);
                    navigate("/customers");
                  }}
                >
                  <span className="ico">👤</span> New Customer
                </div>
                <div
                  className="nav-item"
                  onClick={() => {
                    setShowQuickAdd(false);
                    navigate("/leads");
                  }}
                >
                  <span className="ico">🎯</span> New Lead
                </div>
                <div
                  className="nav-item"
                  onClick={() => {
                    setShowQuickAdd(false);
                    navigate("/deals");
                  }}
                >
                  <span className="ico">💵</span> New Sales Deal
                </div>
                <div
                  className="nav-item"
                  onClick={() => {
                    setShowQuickAdd(false);
                    navigate("/interactions");
                  }}
                >
                  <span className="ico">💬</span> Log Activity
                </div>
                <div
                  className="nav-item"
                  onClick={() => {
                    setShowQuickAdd(false);
                    navigate("/followups");
                  }}
                >
                  <span className="ico">⏰</span> Schedule Follow-up
                </div>
              </div>
            )}

            {/* Notifications Panel */}
            {showNotifications && (
              <div
                className="card"
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 48,
                  marginTop: 8,
                  width: 320,
                  padding: 14,
                  zIndex: 100,
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13.5,
                    marginBottom: 10,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Recent Notifications</span>
                  <span className="badge badge-info">2 New</span>
                </div>
                <div className="activity-item" style={{ padding: "8px 0" }}>
                  <div className="activity-ico" style={{ background: "var(--warning-100)" }}>
                    ⏰
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>
                      Follow-up due today
                    </div>
                    <div className="activity-time">Send contract to Acme Industries</div>
                  </div>
                </div>
                <div className="activity-item" style={{ padding: "8px 0" }}>
                  <div className="activity-ico" style={{ background: "var(--success-100)" }}>
                    💵
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>
                      Deal Closed Won ($120k)
                    </div>
                    <div className="activity-time">TechNova Global signed SLA</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

