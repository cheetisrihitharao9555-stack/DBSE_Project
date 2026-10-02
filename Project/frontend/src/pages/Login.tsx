import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { api, getErrorMessage } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setNotice(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const user = response.data;

      localStorage.setItem("crm_token", user.token);

      localStorage.setItem(
        "crm_user",
        JSON.stringify({
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
        })
      );

      navigate("/dashboard");
    } catch (error) {
      setNotice(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <form onSubmit={onSubmit} noValidate>
        <h1>Welcome back</h1>
        <p className="sub">Log in to your CRM account.</p>

        {notice && (
          <div
            className="auth-error"
            role="alert"
            style={{ marginBottom: 16 }}
          >
            {notice}
          </div>
        )}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@business.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-accent btn-block"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <div className="auth-form-footer">
          Don’t have an account? <Link to="/register">Create one</Link>
        </div>
      </form>
    </AuthShell>
  );
}