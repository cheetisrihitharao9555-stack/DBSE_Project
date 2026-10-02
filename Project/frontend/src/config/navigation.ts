export interface NavItem {
  path: string;
  label: string;
  icon: string;
  description: string;
  /** Phase in which the page gets its real backend (used by placeholders). */
  phase: number;
}

// Icons are the same glyphs the original prototype used.
export const WORKSPACE_NAV: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: "◆", phase: 3, description: "Get a quick overview of deals, leads, follow-ups, and recent activity." },
  { path: "/customers", label: "Customers", icon: "👤", phase: 4, description: "Manage and organize customer information in one place." },
  { path: "/leads", label: "Leads", icon: "🎯", phase: 5, description: "Track potential customers through the lead pipeline." },
  { path: "/accounts", label: "Accounts", icon: "🏢", phase: 6, description: "Manage the companies your customers and deals belong to." },
  { path: "/deals", label: "Sales", icon: "💵", phase: 7, description: "Track deals through the sales pipeline and monitor revenue." },
  { path: "/interactions", label: "Interactions", icon: "💬", phase: 8, description: "Keep a complete history of calls, meetings, emails, notes and tasks." },
  { path: "/followups", label: "Follow-ups", icon: "⏰", phase: 8, description: "Schedule, track, reschedule, and complete important follow-ups." },
  { path: "/reports", label: "Reports", icon: "📊", phase: 9, description: "View insights into sales, leads, and customer activity." },
];

export const ACCOUNT_NAV: NavItem[] = [
  { path: "/login-history", label: "Login History", icon: "🔐", phase: 2, description: "View your previous CRM login activity." },
  { path: "/settings", label: "Settings", icon: "⚙", phase: 10, description: "Manage your profile, business details, team and security." },
];

export const ALL_NAV: NavItem[] = [...WORKSPACE_NAV, ...ACCOUNT_NAV];