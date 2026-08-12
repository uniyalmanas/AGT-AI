"use client";

import { useState } from "react";
import { FileCheck, Sparkles, FileText, CheckCircle2, AlertTriangle, RotateCcw, ExternalLink, ShieldCheck } from "lucide-react";

interface Gstr9AuditResult {
  financialYear: string;
  gstin: string;
  auditedTurnoverPnl: number;
  gstr9DeclaredTurnover: number;
  unreconciledTurnoverDiff: number;
  totalItcAvailed3b: number;
  totalItcAsPer2b: number;
  itcDifference: number;
  shortTaxPayableDrc03: number;
  table4OutwardTaxable: {
    b2b: number;
    b2c: number;
    exports: number;
    igst: number;
    cgst: number;
    sgst: number;
  };
  table6ItcAvailed: {
    inputs: number;
    capitalGoods: number;
    inputServices: number;
  };
  gstr9CReconciliationNotes: string;
}

const SAMPLE_ANNUAL_DATA = `Company Name: Sunrise Traders Pvt Ltd
GSTIN: 27AABCU9603R1ZM
Financial Year: FY 2025-26

Audited Financial Statements (P&L):
- Gross Revenue / Turnover: ₹1,50,00,000
- Other Income (Exempt Dividend): ₹2,00,000

Full-Year 12 Months Filed Returns Summary (GSTR-1 & 3B):
- GSTR-1 Total Outward Taxable Sales: ₹1,48,50,000 (Short by ₹1,50,000 vs Audited P&L)
- Total CGST Paid in 3B: ₹13,36,500
- Total SGST Paid in 3B: ₹13,36,500
- Total ITC Availed in GSTR-3B: ₹5,40,000
- Total Eligible ITC as per GSTR-2B: ₹5,25,000 (Excess ITC claimed in 3B: ₹15,000)`;

function fmt(n: number) {
  if (n === undefined || n === null) return "—";
  return "₹" + n.toLocaleString("en-IN");
}

export default function Gstr9AuditPage() {
  const [annualText, setAnnualText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Gstr9AuditResult | null>(null);
  const [error, setError] = useState("");

  async function runAnnualAudit() {
    if (!annualText.trim()) {
      setError("Please paste annual financial data or 12-month return summary.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/gstr9-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ annualDataText: annualText }),
      });

      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Annual audit processing failed");
      setResult(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error running annual audit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900 flex items-center gap-2">
            <FileCheck size={24} className="text-brand-600" />
            Full-Year GSTR-9 & 9C Annual Audit Helper
          </h1>
          <p className="text-xs sm:text-sm text-ink-300 mt-1">
            Consolidate 12 months of GSTR-1/3B against Audited P&L Statements to generate GSTR-9/9C reconciliation tables
          </p>
        </div>
        {result && (
          <button onClick={() => { setResult(null); setAnnualText(""); }} className="btn-secondary self-start sm:self-auto">
            <RotateCcw size={14} /> New Audit
          </button>
        )}
      </div>

      {!result ? (
        <div className="card p-4 sm:p-6 bg-white border border-ink-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ink-100">
            <h2 className="font-semibold text-ink-900 text-sm sm:text-base">Provide Annual Returns & Audited P&L Data</h2>
            <button onClick={() => setAnnualText(SAMPLE_ANNUAL_DATA)} className="btn-secondary text-xs">
              Load Sample Annual Data
            </button>
          </div>

          <textarea
            className="input h-64 resize-none font-mono text-xs"
            placeholder="Paste 12-month GSTR-1/3B filing summaries and Audited P&L statement figures…"
            value={annualText}
            onChange={(e) => setAnnualText(e.target.value)}
          />

          {error && (
            <div className="text-xs text-danger-text bg-danger-bg border border-danger-border rounded-xl px-3 py-2 flex items-center gap-2">
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <button onClick={runAnnualAudit} disabled={loading} className="btn-primary w-full justify-center py-3 text-xs sm:text-sm">
            {loading ? (
              <>
                <span className="spinner" /> Consolidating 12 Months Returns & Audited P&L…
              </>
            ) : (
              <>
                <Sparkles size={16} /> Run Full-Year GSTR-9 & 9C Audit
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Summary Banner */}
          <div className="card p-4 sm:p-6 bg-white border border-brand-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">GSTR-9C Reconciliation Status</span>
                <h2 className="text-xl sm:text-2xl font-bold text-ink-900 mt-0.5">Annual Audit Consolidated — {result.financialYear}</h2>
                <p className="text-xs font-mono text-ink-300">GSTIN: {result.gstin}</p>
              </div>
              <div className="sm:text-right">
                <span className="text-xs text-ink-400 uppercase tracking-wider">Recommended DRC-03 Payment</span>
                <div className="text-xl sm:text-2xl font-mono font-bold text-red-600 mt-1">{fmt(result.shortTaxPayableDrc03)}</div>
                <span className="text-[11px] text-ink-300">Short paid tax liability</span>
              </div>
            </div>
          </div>

          {/* Metric Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-4">
              <span className="text-xs text-ink-300 font-medium">Audited P&L Gross Turnover</span>
              <div className="text-xl font-bold font-mono text-ink-900 mt-1">{fmt(result.auditedTurnoverPnl)}</div>
            </div>
            <div className="card p-4">
              <span className="text-xs text-ink-300 font-medium">GSTR-9 Declared Turnover</span>
              <div className="text-xl font-bold font-mono text-brand-700 mt-1">{fmt(result.gstr9DeclaredTurnover)}</div>
            </div>
            <div className="card p-4">
              <span className="text-xs text-ink-300 font-medium">GSTR-9C Unreconciled Diff</span>
              <div className={`text-xl font-bold font-mono mt-1 ${result.unreconciledTurnoverDiff > 0 ? "text-red-600" : "text-emerald-600"}`}>
                {fmt(result.unreconciledTurnoverDiff)}
              </div>
            </div>
          </div>

          {/* GSTR-9 Table 4 */}
          <div className="card p-4 sm:p-6 bg-white border border-ink-100">
            <h3 className="text-sm font-bold text-ink-900 mb-3">GSTR-9 Table 4 — Outward Taxable Supplies</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="label">B2B Taxable (₹)</label>
                <div className="input font-mono bg-ink-50">{fmt(result.table4OutwardTaxable.b2b)}</div>
              </div>
              <div>
                <label className="label">B2C Taxable (₹)</label>
                <div className="input font-mono bg-ink-50">{fmt(result.table4OutwardTaxable.b2c)}</div>
              </div>
              <div>
                <label className="label">Exports Zero-Rated (₹)</label>
                <div className="input font-mono bg-ink-50">{fmt(result.table4OutwardTaxable.exports)}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">CGST (₹)</label>
                <div className="input font-mono bg-ink-50">{fmt(result.table4OutwardTaxable.cgst)}</div>
              </div>
              <div>
                <label className="label">SGST (₹)</label>
                <div className="input font-mono bg-ink-50">{fmt(result.table4OutwardTaxable.sgst)}</div>
              </div>
              <div>
                <label className="label">IGST (₹)</label>
                <div className="input font-mono bg-ink-50">{fmt(result.table4OutwardTaxable.igst)}</div>
              </div>
            </div>
          </div>

          {/* GSTR-9 Table 6 & 8 */}
          <div className="card p-4 sm:p-6 bg-white border border-ink-100">
            <h3 className="text-sm font-bold text-ink-900 mb-3">GSTR-9 Table 6 & 8 — Input Tax Credit (ITC) Consolidation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Total ITC Availed in 3B (₹)</label>
                <div className="input font-mono bg-ink-50">{fmt(result.totalItcAvailed3b)}</div>
              </div>
              <div>
                <label className="label">Eligible ITC as per 2B (₹)</label>
                <div className="input font-mono bg-ink-50">{fmt(result.totalItcAsPer2b)}</div>
              </div>
              <div>
                <label className="label">Excess ITC Difference (₹)</label>
                <div className="input font-mono bg-red-50 text-red-700 font-bold">{fmt(result.itcDifference)}</div>
              </div>
            </div>
          </div>

          {/* GSTR-9C Notes */}
          <div className="card p-6 bg-purple-50/50 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={16} className="text-purple-700" />
              <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider">CA Auditor Certification Observation (GSTR-9C)</h3>
            </div>
            <p className="text-xs text-purple-950 leading-relaxed font-sans">{result.gstr9CReconciliationNotes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
