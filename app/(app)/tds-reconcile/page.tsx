"use client";

import { useState } from "react";
import { GitCompare, Sparkles, FileText, CheckCircle2, AlertTriangle, Info, RotateCcw, Download } from "lucide-react";
import { FileUploadZone } from "@/components/FileUploadZone";

interface TdsMismatch {
  deductorName: string;
  tan: string;
  section: string;
  booksAmount: string;
  form26ASAmount: string;
  aisAmount: string;
  status: "missing_in_26as" | "section_mismatch" | "matched" | "excess_in_26as";
  actionableFix: string;
}

interface TdsReconcileResult {
  summary: string;
  tdsMatchScore: number;
  totalBooksTds: number;
  totalForm26ASTds: number;
  totalAisTds: number;
  unclaimedRefundCredit: number;
  mismatches: TdsMismatch[];
  recommendations: string[];
}

const SAMPLE_BOOKS = `Deductor: HDFC Bank Ltd | TAN: MUMH01234F | Sec 194A | Gross Payment: ₹5,00,000 | TDS: ₹50,000
Deductor: Infosys Technologies | TAN: BLRI09876E | Sec 194J | Gross Payment: ₹12,00,000 | TDS: ₹1,20,000
Deductor: Reliance Retail Ltd | TAN: MUMR54321D | Sec 194C | Gross Payment: ₹8,00,000 | TDS: ₹16,000`;

const SAMPLE_26AS = `Deductor: HDFC Bank Ltd | TAN: MUMH01234F | Sec 194A | Total Deposited: ₹50,000
Deductor: Infosys Technologies | TAN: BLRI09876E | Sec 194J | Total Deposited: ₹1,00,000 (Short by ₹20,000 due to non-filing Q4 26Q)
Deductor: Reliance Retail Ltd | TAN: MUMR54321D | Sec 194C | Total Deposited: ₹16,000`;

function fmt(n: number) {
  if (n === undefined || n === null) return "—";
  return "₹" + n.toLocaleString("en-IN");
}

export default function TdsReconcilePage() {
  const [booksText, setBooksText] = useState("");
  const [form26ASText, setForm26ASText] = useState("");
  const [aisText, setAisText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TdsReconcileResult | null>(null);
  const [error, setError] = useState("");

  async function runTdsReconciliation() {
    if (!booksText.trim() || !form26ASText.trim()) {
      setError("Please provide both Books TDS data and Form 26AS data.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tds-reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booksTdsData: booksText,
          form26asData: form26ASText,
          aisData: aisText,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Reconciliation failed");
      setResult(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error running TDS reconciliation");
    } finally {
      setLoading(false);
    }
  }

  function loadSampleData() {
    setBooksText(SAMPLE_BOOKS);
    setForm26ASText(SAMPLE_26AS);
    setAisText("AIS Statement matched with 26AS records.");
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900 flex items-center gap-2">
            <GitCompare size={24} className="text-brand-600" />
            Form 26AS & AIS / TIS TDS Reconciliation Engine
          </h1>
          <p className="text-xs sm:text-sm text-ink-300 mt-1">
            Auto-match Books TDS against Form 26AS and AIS statements before ITR filing to claim full tax refunds
          </p>
        </div>
        {result && (
          <button onClick={() => { setResult(null); setBooksText(""); setForm26ASText(""); }} className="btn-secondary self-start sm:self-auto">
            <RotateCcw size={14} /> New Reconciliation
          </button>
        )}
      </div>

      {!result ? (
        <div className="card p-4 sm:p-6 space-y-5 bg-white border border-ink-100">
          <div className="flex items-center justify-between pb-3 border-b border-ink-100">
            <h2 className="font-semibold text-ink-900 text-sm sm:text-base">Provide TDS Data Records</h2>
            <button onClick={loadSampleData} className="btn-secondary text-xs">
              Load Sample Data
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">1. Books TDS Register (Tally / Excel Export)</label>
              <textarea
                className="input h-48 resize-none font-mono text-xs"
                placeholder="Paste Books TDS ledger or deductor details…"
                value={booksText}
                onChange={(e) => setBooksText(e.target.value)}
              />
            </div>
            <div>
              <label className="label">2. Form 26AS Text / PDF Download</label>
              <textarea
                className="input h-48 resize-none font-mono text-xs"
                placeholder="Paste Form 26AS Part A / Part A1 TDS data…"
                value={form26ASText}
                onChange={(e) => setForm26ASText(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">3. AIS / TIS Statement (Optional)</label>
            <textarea
              className="input h-20 resize-none font-mono text-xs"
              placeholder="Paste Annual Information Statement (AIS) TDS entries…"
              value={aisText}
              onChange={(e) => setAisText(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-xs text-danger-text bg-danger-bg border border-danger-border rounded-xl px-3 py-2 flex items-center gap-2">
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <button onClick={runTdsReconciliation} disabled={loading} className="btn-primary w-full justify-center py-3 text-xs sm:text-sm">
            {loading ? (
              <>
                <span className="spinner" /> Reconciling 26AS vs Books with AI…
              </>
            ) : (
              <>
                <Sparkles size={16} /> Run AI TDS Reconciliation
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Match Score Banner */}
          <div className="card p-4 sm:p-6 bg-gradient-to-r from-brand-600 to-brand-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-200">TDS Reconciliation Health</span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1">TDS Match Score: {result.tdsMatchScore} / 100</h2>
              <p className="text-xs text-brand-100 mt-1 leading-relaxed max-w-xl">{result.summary}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-brand-200 uppercase tracking-wider">Unclaimed Tax Refund Credit</span>
              <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-300 mt-1">{fmt(result.unclaimedRefundCredit)}</div>
              <span className="text-[11px] text-brand-100">Ready to claim in ITR</span>
            </div>
          </div>

          {/* Metric Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-4">
              <span className="text-xs text-ink-300 font-medium">Total Books TDS</span>
              <div className="text-xl font-bold font-mono text-ink-900 mt-1">{fmt(result.totalBooksTds)}</div>
            </div>
            <div className="card p-4">
              <span className="text-xs text-ink-300 font-medium">Form 26AS TDS Deposited</span>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-1">{fmt(result.totalForm26ASTds)}</div>
            </div>
            <div className="card p-4">
              <span className="text-xs text-ink-300 font-medium">AIS / TIS Statement TDS</span>
              <div className="text-xl font-bold font-mono text-brand-700 mt-1">{fmt(result.totalAisTds)}</div>
            </div>
          </div>

          {/* Itemized Mismatch Table */}
          <div className="card p-4 sm:p-6 bg-white border border-ink-100">
            <h3 className="text-sm font-bold text-ink-900 mb-4">Itemized Deductor Discrepancies</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="bg-ink-50 font-bold text-ink-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Deductor Name</th>
                    <th className="p-3">TAN</th>
                    <th className="p-3">Section</th>
                    <th className="p-3">Books TDS</th>
                    <th className="p-3">Form 26AS</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actionable Fix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50 font-sans">
                  {result.mismatches.map((m, idx) => (
                    <tr key={idx} className="hover:bg-ink-50/40 transition">
                      <td className="p-3 font-semibold text-ink-900">{m.deductorName}</td>
                      <td className="p-3 font-mono text-ink-400">{m.tan}</td>
                      <td className="p-3 font-mono text-brand-700">{m.section}</td>
                      <td className="p-3 font-mono text-ink-700">{m.booksAmount}</td>
                      <td className="p-3 font-mono text-emerald-700">{m.form26ASAmount}</td>
                      <td className="p-3">
                        <span className={`badge ${
                          m.status === "matched" ? "badge-success" : m.status === "missing_in_26as" ? "badge-danger" : "badge-warning"
                        }`}>
                          {m.status === "matched" ? "✓ Matched" : m.status === "missing_in_26as" ? "⚠ Short Deposited" : " Section Mismatch"}
                        </span>
                      </td>
                      <td className="p-3 text-ink-700 leading-tight">{m.actionableFix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card p-6 bg-white border border-ink-100">
            <h3 className="text-sm font-bold text-ink-900 mb-3">Actionable Next Steps for CA</h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="text-xs text-ink-700 flex items-start gap-2">
                  <span className="font-bold text-brand-600">{i + 1}.</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
