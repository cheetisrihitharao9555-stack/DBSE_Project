import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Leads from "./pages/Leads";
import Accounts from "./pages/Accounts";
import Sales from "./pages/Sales";
import Interactions from "./pages/Interactions";
import Followups from "./pages/Followups";
import Reports from "./pages/Reports";
import LoginHistory from "./pages/LoginHistory";
import Settings from "./pages/Settings";
import AppLayout from "./layouts/AppLayout";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem("crm_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem("crm_token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/deals" element={<Sales />} />
        <Route path="/interactions" element={<Interactions />} />
        <Route path="/followups" element={<Followups />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/login-history" element={<LoginHistory />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}