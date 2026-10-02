import { useState } from "react";

export default function Reports() {
  const [timeframe, setTimeframe] = useState<"YTD" | "6M" | "Q3">("6M");

  const monthlyData = [
    { month: "May", revenue: 42000, target: 38000 },
    { month: "Jun", revenue: 58000, target: 50000 },
    { month: "Jul", revenue: 74000, target: 65000 },
    { month: "Aug", revenue: 89000, target: 80000 },
    { month: "Sep", revenue: 120000, target: 95000 },
    { month: "Oct", revenue: 98000, target: 90000 },
  ];

  const funnelData = [
    { stage: "Total Leads Generated", count: 142, pct: 100, color: "var(--info)" },
    { stage: "Contacted & Qualified", count: 88, pct: 62, color: "var(--warning)" },
    { stage: "Formal Proposals Delivered", count: 46, pct: 32, color: "var(--accent)" },
    { stage: "Negotiations In Progress", count: 24, pct: 17, color: "#A855F7" },
    { stage: "Closed Won Accounts", count: 18, pct: 13, color: "var(--success)" },
  ];

  const topAccounts = [
    { name: "TechNova Global", revenue: "$120,000", share: "28%", tier: "Enterprise" },
    { name: "Acme Industries", revenue: "$65,000", share: "15%", tier: "Enterprise" },
    { name: "Apex Cloud Services", revenue: "$85,000", share: "20%", tier: "Mid-Market" },
    { name: "Vance Logistics", revenue: "$48,000", share: "11%", tier: "Mid-Market" },
    { name: "Horizon Retailers", revenue: "$32,000", share: "8%", tier: "Enterprise" },
  ];

  const sources = [
    { source: "Website Inbound Demo", pct: 38, count: 54 },
    { source: "Customer Referrals", pct: 26, count: 37 },
    { source: "Direct Outreach / LinkedIn", pct: 20, count: 28 },
    { source: "Industry Conferences", pct: 16, count: 23 },
  ];

  const maxRev = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
      <div className="page-header">
        <div>
          <h1>Analytics & Reports</h1>
          <p className="desc">
            Executive insights into pipeline velocity, conversion funnels, and revenue realization.
          </p>
        </div>
        <div className="page-header-actions">
          <div style={{ display: "flex", gap: 6 }}>
            <button
              className={`chip ${timeframe === "6M" ? "active" : ""}`}
              onClick={() => setTimeframe("6M")}
            >
              Last 6 Months
            </button>
            <button
              className={`chip ${timeframe === "YTD" ? "active" : ""}`}
              onClick={() => setTimeframe("YTD")}
            >
              Year to Date
            </button>
            <button
              className={`chip ${timeframe === "Q3" ? "active" : ""}`}
              onClick={() => setTimeframe("Q3")}
            >
              Quarter 3
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Total Recognized Revenue</div>
          <div className="value" style={{ color: "var(--success)" }}>
            $481,000
          </div>
          <div className="delta up">↑ +24.8% vs previous period</div>
        </div>
        <div className="stat-card">
          <div className="label">Pipeline Win Rate</div>
          <div className="value">34.2%</div>
          <div className="delta up">↑ +5.1% efficiency</div>
        </div>
        <div className="stat-card">
          <div className="label">Average Deal Size</div>
          <div className="value">$26,720</div>
          <div className="delta up">↑ +14.2% YoY growth</div>
        </div>
        <div className="stat-card">
          <div className="label">Sales Cycle Velocity</div>
          <div className="value">21 Days</div>
          <div className="delta up">↓ -4 days faster to close</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="dash-grid" style={{ marginBottom: 20 }}>
        {/* Revenue Growth Bar Chart */}
        <div className="card">
          <div className="card-title-row">
            <div>
              <h3>Monthly Revenue & Targets</h3>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                Actual closed revenue (cyan/accent) vs quota targets (outline)
              </p>
            </div>
            <span className="badge badge-success">+18% Target Beat</span>
          </div>

          <div
            style={{
              height: 220,
              display: "flex",
              alignItems: "flex-end",
              gap: 16,
              paddingTop: 30,
              paddingBottom: 10,
              borderBottom: "1px solid var(--line)",
            }}
          >
            {monthlyData.map((item) => {
              const heightPct = Math.round((item.revenue / maxRev) * 100);
              return (
                <div
                  key={item.month}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    justifyContent: "flex-end",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-secondary)",
                      marginBottom: 6,
                    }}
                  >
                    ${Math.round(item.revenue / 1000)}k
                  </span>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 38,
                      height: `${heightPct}%`,
                      background:
                        "linear-gradient(180deg, var(--accent) 0%, rgba(198,134,63,0.3) 100%)",
                      borderRadius: "6px 6px 0 0",
                      position: "relative",
                      transition: "height 0.4s ease",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      marginTop: 10,
                      color: "var(--text-primary)",
                    }}
                  >
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Conversion Funnel */}
        <div className="card">
          <div className="card-title-row">
            <div>
              <h3>Pipeline Conversion Funnel</h3>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                Conversion attrition through sales stages
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {funnelData.map((f) => (
              <div key={f.stage}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12.5,
                    marginBottom: 5,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{f.stage}</span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    <strong>{f.count}</strong> ({f.pct}%)
                  </span>
                </div>
                <div
                  style={{
                    height: 8,
                    background: "var(--paper-200)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${f.pct}%`,
                      height: "100%",
                      background: f.color,
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Top Accounts & Lead Acquisition Sources */}
      <div className="dash-row-2">
        {/* Top Accounts */}
        <div className="card">
          <div className="card-title-row">
            <h3>Top Performing Accounts</h3>
            <span style={{ fontSize: 12, color: "var(--accent-600)", fontWeight: 600 }}>
              All Time
            </span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Tier</th>
                <th>Revenue</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {topAccounts.map((a) => (
                <tr key={a.name}>
                  <td>
                    <span style={{ fontWeight: 600 }}>{a.name}</span>
                  </td>
                  <td>
                    <span className="badge badge-info">{a.tier}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                    {a.revenue}
                  </td>
                  <td>
                    <span style={{ color: "var(--accent)" }}>{a.share}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lead Sources Distribution */}
        <div className="card">
          <div className="card-title-row">
            <h3>Acquisition Channels</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {sources.map((s) => (
              <div key={s.source}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12.5,
                    marginBottom: 4,
                  }}
                >
                  <span>{s.source}</span>
                  <span style={{ fontWeight: 600 }}>{s.pct}%</span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "var(--paper-200)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${s.pct}%`,
                      height: "100%",
                      background: "var(--accent)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
