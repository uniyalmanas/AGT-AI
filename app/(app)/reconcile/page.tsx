"use client";
import { useState } from "react";
import { GitMerge, Sparkles, AlertTriangle, CheckCircle2, Info, RotateCcw } from "lucide-react";

interface ReconcileResult {
  summary: string;
  mismatches: Array<{ field: string; gstr1: string; gstr3b: string; gstr2b: string; severity: "high" | "medium" | "low"; fix: string }>;
  itcRisks: string[];
  recommendations: string[];
  complianceScore: number;
}

const SAMPLE_1 = `GSTR-1 (filed):
Total B2B supplies: ₹12,50,000
Total B2C supplies: ₹3,80,000
Export supplies: ₹2,10,000
Total tax collected (IGST): ₹45,000
Total tax collected (CGST): ₹1,08,000
Total tax collected (SGST): ₹1,08,000`;

const SAMPLE_3B = `GSTR-3B (to be filed):
Outward taxable supplies: ₹15,90,000
Tax paid (IGST): ₹45,000
Tax paid (CGST): ₹1,05,000
Tax paid (SGST): ₹1,05,000
ITC claimed (IGST): ₹38,000
ITC claimed (CGST): ₹14,500
ITC claimed (SGST): ₹14,500`;

const SAMPLE_2B = `GSTR-2B (auto-populated):
Available ITC (IGST): ₹35,000
Available ITC (CGST): ₹12,000
Available ITC (SGST): ₹12,000
Ineligible ITC (Section 17(5)): ₹8,000`;

const severityStyle: Record<string, string> = {
  high:   "bg-danger-bg border-danger-border",
  medium: "bg-warning-bg border-warning-border",
  low:    "bg-info-bg border-info-border",
};
const severityBadge: Record<string, string> = {
  high: "badge-danger", medium: "badge-warning", low: "badge-info",
};

export default function ReconcilePage() {
  const [gstr1, setGstr1] = useState("");
  const [gstr3b, setGstr3b] = useState("");
  const [gstr2b, setGstr2b] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReconcileResult | null>(null);
  const [error, setError] = useState("");

  async function runReconcile() {
    if (!gstr1.trim() || !gstr3b.trim()) {
      setError("Please provide at least GSTR-1 and GSTR-3B data."); return;
    }
    setError(""); setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gstr1, gstr3b, gstr2b }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setResult(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally { setLoading(false); }
  }

  function loadSample() { setGstr1(SAMPLE_1); setGstr3b(SAMPLE_3B); setGstr2b(SAMPLE_2B); }
  function reset() { setGstr1(""); setGstr3b(""); setGstr2b(""); setResult(null); setError(""); }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2">
            <GitMerge size={22} className="text-brand-600" />
            Reconciliation Checker
          </h1>
          <p className="text-sm text-ink-300 mt-1">Detect GSTR-1 vs GSTR-3B vs GSTR-2B mismatches before the GST department does</p>
        </div>
        {result && <button onClick={reset} className="btn-secondary"><RotateCcw size={14} /> Reset</button>}
      </div>

      {!result && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "GSTR-1 data", value: gstr1, set: setGstr1, placeholder: "Paste GSTR-1 summary…", required: true },
              { label: "GSTR-3B data", value: gstr3b, set: setGstr3b, placeholder: "Paste GSTR-3B figures…", required: true },
              { label: "GSTR-2B data (optional)", value: gstr2b, set: setGstr2b, placeholder: "Paste GSTR-2B ITC data…", required: false },
            ].map(({ label, value, set, placeholder, required }) => (
              <div key={label} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-ink-900">{label}</h3>
                  {required && <span className="badge-danger text-[10px]">Required</span>}
                </div>
                <textarea
                  className="input h-40 resize-none text-xs font-mono"
                  placeholder={placeholder}
                  value={value}
                  onChange={e => set(e.target.value)}
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="text-xs text-danger-text bg-danger-bg rounded-lg px-3 py-2 flex items-center gap-2">
              <AlertTriangle size={13} /> {error}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={runReconcile} disabled={loading} className="btn-primary">
              {loading ? <><span className="spinner" /> Analysing…</> : <><Sparkles size={15} /> Run reconciliation</>}
            </button>
            <button onClick={loadSample} className="btn-secondary text-xs">Load sample data</button>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-5">
          {/* Score */}
          <div className="card p-6 flex items-center gap-6">
            <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-bold text-2xl
              ${result.complianceScore >= 80 ? "bg-success-bg text-success-text" :
                result.complianceScore >= 60 ? "bg-warning-bg text-warning-text" : "bg-danger-bg text-danger-text"}`}>
              {result.complianceScore}
              <span className="text-xs font-normal">/ 100</span>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-ink-900 text-lg">Compliance Score</h2>
              <p className="text-sm text-ink-400 mt-1">{result.summary}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-danger-text">{result.mismatches.length}</div>
              <div className="text-xs text-ink-300">mismatches found</div>
            </div>
          </div>

          {/* Mismatches */}
          {result.mismatches.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-ink-50">
                <h2 className="font-semibold text-ink-900">Mismatches</h2>
              </div>
              <div className="divide-y divide-ink-50">
                {result.mismatches.map((m, i) => (
                  <div key={i} className={`p-4 border-l-4 ${severityStyle[m.severity]}`}
                    style={{ borderLeftColor: m.severity === "high" ? "#be123c" : m.severity === "medium" ? "#b45309" : "#1d4ed8" }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm text-ink-900">{m.field}</span>
                          <span className={severityBadge[m.severity]}>{m.severity} priority</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-xs mb-2">
                          {[["GSTR-1", m.gstr1], ["GSTR-3B", m.gstr3b], ["GSTR-2B", m.gstr2b]].map(([k, v]) => (
                            <div key={k}>
                              <div className="text-ink-300 mb-0.5">{k}</div>
                              <div className="font-mono font-medium text-ink-700">{v || "N/A"}</div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-start gap-1.5 text-xs">
                          <Info size={12} className="mt-0.5 flex-shrink-0 text-ink-300" />
                          <span className="text-ink-500">{m.fix}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ITC Risks */}
          {result.itcRisks?.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-ink-900 mb-3 flex items-center gap-2">
                <AlertTriangle size={15} className="text-warning-text" /> ITC Risks
              </h2>
              <ul className="space-y-2">
                {result.itcRisks.map((r, i) => (
                  <li key={i} className="text-sm text-ink-600 flex gap-2">
                    <span className="text-warning-text mt-0.5">⚠</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations?.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-ink-900 mb-3 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-success-text" /> What to do next
              </h2>
              <ol className="space-y-2">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-ink-600 flex gap-3">
                    <span className="text-brand-400 font-bold flex-shrink-0">{i + 1}.</span> {r}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
