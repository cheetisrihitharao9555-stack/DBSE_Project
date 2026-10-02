import type { ReactNode } from "react";

/** Full-page split layout used by the Login and Register screens. */
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="auth-brand"><span className="auth-mark">C</span> CRM</div>
        <div className="auth-quote">
          <h2>Every follow-up, every sale, every customer — in one place.</h2>
          <p>A lightweight CRM built for small businesses: retail, services, agencies, education, and more.</p>
        </div>
        <div className="auth-footnote">© 2026 CRM · built for small business teams</div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form">{children}</div>
      </div>
    </div>
  );
}
