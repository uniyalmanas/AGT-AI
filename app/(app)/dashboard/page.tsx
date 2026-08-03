import { FileText, Users, CheckCircle2, AlertTriangle, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Total Clients",        value: "42",    sub: "+3 this month",   icon: Users,         color: "text-brand-600",   bg: "bg-brand-50" },
  { label: "Returns Filed (MTD)",  value: "138",   sub: "of 168 due",      icon: FileText,      color: "text-success-text", bg: "bg-success-bg" },
  { label: "Pending Review",       value: "12",    sub: "needs your sign", icon: Clock,         color: "text-warning-text", bg: "bg-warning-bg" },
  { label: "Mismatches Detected",  value: "4",     sub: "across 3 clients",icon: AlertTriangle, color: "text-danger-text",  bg: "bg-danger-bg" },
];

const RECENT = [
  { client: "Sunrise Traders Pvt Ltd",  gstin: "27AABCU9603R1ZM", form: "GSTR-3B", period: "Mar 2026", status: "filed",   time: "2h ago" },
  { client: "Metro Electricals",         gstin: "27AAACM1234R1ZX", form: "GSTR-1",  period: "Mar 2026", status: "review",  time: "4h ago" },
  { client: "Patel Exports LLP",         gstin: "24AABCP5678R1ZK", form: "GSTR-3B", period: "Mar 2026", status: "mismatch",time: "5h ago" },
  { client: "Krishna Pharma",            gstin: "29AABCK9012R1ZD", form: "GSTR-1",  period: "Mar 2026", status: "filed",   time: "Yesterday" },
  { client: "Global Fashions",           gstin: "06AABCG3456R1ZP", form: "GSTR-3B", period: "Feb 2026", status: "filed",   time: "2 days ago" },
];

const DUE = [
  { form: "GSTR-1",  date: "11 Jul 2026", clients: 42, urgent: false },
  { form: "GSTR-3B", date: "20 Jul 2026", clients: 42, urgent: false },
  { form: "GSTR-3B", date: "20 Jun 2026", clients: 12, urgent: true  },
];

const statusBadge: Record<string, string> = {
  filed:    "badge-success",
  review:   "badge-warning",
  mismatch: "badge-danger",
};

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Good morning, CA Sharma 👋</h1>
          <p className="text-sm text-ink-300 mt-1">Sunday, 14 June 2026 · GSTR-3B due in 6 days for 12 clients</p>
        </div>
        <Link href="/gstr3b" className="btn-primary">
          <FileText size={15} />
          New Return
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-ink-300 font-medium">{label}</span>
              <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={15} className={color} />
              </div>
            </div>
            <div className="text-2xl font-bold text-ink-900">{value}</div>
            <div className="text-xs text-ink-300 mt-1">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="col-span-2 card overflow-hidden">
          <div className="px-5 py-4 border-b border-ink-50 flex items-center justify-between">
            <h2 className="font-semibold text-ink-900">Recent filings</h2>
            <Link href="/clients" className="text-xs text-brand-600 hover:underline">View all</Link>
          </div>
          <table className="w-full">
            <thead className="bg-ink-50/60">
              <tr>
                <th className="table-head">Client</th>
                <th className="table-head">Form</th>
                <th className="table-head">Period</th>
                <th className="table-head">Status</th>
                <th className="table-head">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {RECENT.map((r, i) => (
                <tr key={i} className="hover:bg-ink-50/40 transition-colors">
                  <td className="table-cell">
                    <div className="font-medium text-ink-900 text-xs">{r.client}</div>
                    <div className="text-[11px] text-ink-300 font-mono">{r.gstin}</div>
                  </td>
                  <td className="table-cell font-semibold text-brand-700">{r.form}</td>
                  <td className="table-cell text-ink-400">{r.period}</td>
                  <td className="table-cell">
                    <span className={statusBadge[r.status]}>
                      {r.status === "filed" ? "✓ Filed" : r.status === "review" ? "⏳ Review" : "⚠ Mismatch"}
                    </span>
                  </td>
                  <td className="table-cell text-ink-300 text-xs">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Due dates */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={15} className="text-ink-300" />
            <h2 className="font-semibold text-ink-900">Upcoming due dates</h2>
          </div>
          <div className="space-y-3">
            {DUE.map((d, i) => (
              <div key={i} className={`p-3 rounded-xl border ${d.urgent ? "bg-danger-bg border-danger-border" : "bg-ink-50 border-ink-100"}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-sm ${d.urgent ? "text-danger-text" : "text-ink-700"}`}>{d.form}</span>
                  {d.urgent && <span className="badge-danger">Urgent</span>}
                </div>
                <div className={`text-xs mt-1 ${d.urgent ? "text-danger-text" : "text-ink-400"}`}>{d.date}</div>
                <div className="text-xs text-ink-300 mt-0.5">{d.clients} clients pending</div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-ink-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-success-text" />
              <span className="text-xs font-semibold text-ink-700">This month's efficiency</span>
            </div>
            <div className="text-2xl font-bold text-ink-900">3.8x</div>
            <div className="text-xs text-ink-300">faster than manual filing</div>
            <div className="mt-2 text-xs text-success-text bg-success-bg rounded-lg px-3 py-2">
              Saved ~47 hours this month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
